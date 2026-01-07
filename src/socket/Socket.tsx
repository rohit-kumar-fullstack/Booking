import { useEffect, useReducer, useRef, useCallback } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axios from 'axios';
import Variables from '../Constant/Variable';
import { showErrorAlert, showSuccessAlert } from '../Constant/ShowDailog';
import { useSelector } from 'react-redux';


type SubscriptionCallback = (message: any) => void;

type State = {
  client: Client | null;
  subscriptions: Map<string, any>;
};

type Action =
  | { type: 'SET_CLIENT'; payload: Client }
  | { type: 'ADD_SUBSCRIPTION'; payload: { destination: string; subscription: any } }
  | { type: 'REMOVE_SUBSCRIPTION'; payload: string }
  | { type: 'CLEAR_CLIENT' };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_CLIENT':
      return { ...state, client: action.payload };

    case 'ADD_SUBSCRIPTION':
      return {
        ...state,
        subscriptions: new Map(state.subscriptions).set(
          action.payload.destination,
          action.payload.subscription
        ),
      };

    case 'REMOVE_SUBSCRIPTION': {
      const map = new Map(state.subscriptions);
      map.delete(action.payload);
      return { ...state, subscriptions: map };
    }

    case 'CLEAR_CLIENT':
      return { client: null, subscriptions: new Map() };

    default:
      return state;
  }
};

export const useWebSocketService = (
  webSocketUrl: string,
  onConnectCallback: () => void,
  onErrorCallback: (error: string) => void,
  Token: any) => {
  const [state, dispatch] = useReducer(reducer, {
    client: null,
    subscriptions: new Map(),
  });

  const clientRef = useRef<Client | null>(null);
  const isConnected = useRef(false);

  // ✅ QUEUE MUST BE INSIDE HOOK
  const pendingSubscriptions = useRef<
    { destination: string; callback: SubscriptionCallback }[]
  >([]);

  useEffect(() => {
    clientRef.current = state.client;
  }, [state.client]);

  // ================= CONNECT =================
  const connect = useCallback(() => {
    if (state.client || isConnected.current) return;

    const client = new Client({
      webSocketFactory: () => new SockJS(webSocketUrl),
      reconnectDelay: 5000,
      heartbeatIncoming: 1000,
      heartbeatOutgoing: 1000,

      debug: str => console.log('STOMP:', str),

      onConnect: () => {
        isConnected.current = true;
        // console.log('✅ WebSocket connected');

        // 🔁 Flush queued subscriptions
        pendingSubscriptions.current.forEach(sub =>
          subscribe(sub.destination, sub.callback)
        );
        pendingSubscriptions.current = [];

        onConnectCallback();
      },

      onStompError: frame => {
        onErrorCallback(frame.headers['message'] || 'STOMP Error');
      },
    });

    client.activate();
    dispatch({ type: 'SET_CLIENT', payload: client });
  }, [state.client, webSocketUrl, onConnectCallback, onErrorCallback]);

  // ================= SUBSCRIBE =================
  const subscribe = useCallback(
    (destination: string, callback: SubscriptionCallback) => {
      const client = clientRef.current;

      // 🧠 Queue if not connected
      if (!client || !isConnected.current) {
        // console.log('⏳ Queued subscription:', destination);
        pendingSubscriptions.current.push({ destination, callback });
        return;
      }

      if (state.subscriptions.has(destination)) return;

      const subscription = client.subscribe(destination, (message: IMessage) => {
        if (!message.body) return;

        try {
          const parsed = JSON.parse(message.body);
          callback(parsed);
        } catch (e) {
          console.error('❌ JSON parse error', e);
        }
      });

      dispatch({
        type: 'ADD_SUBSCRIPTION',
        payload: { destination, subscription },
      });
    },
    [state.subscriptions]
  );

  // ================= SEND =================
  const send = useCallback((destination: string, body: Record<string, any> = {}) => {
    const client = clientRef.current;
    if (!client || !isConnected.current) return;

    client.publish({
      destination,
      body: JSON.stringify(body),
    });
  }, []);

  // ================= ROOM =================
  const createRoom = async (roomId: any) => {
    if (!roomId) return;

    try {
      const res = await axios.post(
        `${Variables.socketUrl}livebidding/createRoom`,
        null,
        {
          params: { roomId },
          headers: { Authentication: `Bearer ${Token}` },
        }
      );

      if (res.data.statusCode === 200) {
        connect();
        return joinRoom(roomId);
      }
    } catch {
      connect();
      return joinRoom(roomId);
    }
  };

  const joinRoom = async (roomId: any) => {

    try {
      const { data } = await axios.get(
        `${Variables.socketUrl}livebidding/joinRoom?roomId=${roomId}`,
        { headers: { Authentication: `Bearer ${Token}` } }
      );

      if (data.statusCode === 200) return data.data.bids;
    } catch (e) {
      console.error('Join room error:', e);
    }
  };

  // ================= BID =================
  const placeBid = async (BidDTO: any) => {

    try {
      const res = await axios.post(
        `${Variables.socketUrl}livebidding/placeBid`,
        BidDTO,
        { headers: { Authentication: `Bearer ${Token}` } }
      );

      if (res.data.statusCode === 200) {
        showSuccessAlert(res.data.message);
        return { data: res.data.data, status: true, message: res.data.message };
      }
    } catch (err: any) {
      if (err?.response?.data?.statusCode === 400) {
        showErrorAlert(err.response.data.message);
      }
      return { data: {}, status: false };
    }
  };

  // ================= UNSUBSCRIBE =================
  const unsubscribe = useCallback(
    (destination: string) => {
      const sub = state.subscriptions.get(destination);
      if (sub) {
        sub.unsubscribe();
        dispatch({ type: 'REMOVE_SUBSCRIPTION', payload: destination });
      }
    },
    [state.subscriptions]
  );

  // ================= DISCONNECT =================
  const disconnect = useCallback(() => {
    const client = clientRef.current;

    if (client && isConnected.current) {
      state.subscriptions.forEach(sub => sub.unsubscribe());
      client.deactivate();
      isConnected.current = false;
      dispatch({ type: 'CLEAR_CLIENT' });
    }
  }, [state.subscriptions]);

  return {
    connect,
    subscribe,
    send,
    unsubscribe,
    disconnect,
    createRoom,
    joinRoom,
    placeBid,
  };
};
