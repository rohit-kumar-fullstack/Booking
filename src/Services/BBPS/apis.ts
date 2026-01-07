import axios from "axios";
import { DASHBOARD_COUNT, EMD_CHECK, FORARD_AUCTION_ITEM, GET_MY_AUCTION, GET_MY_TENDER, LIVE_AUCTION, LIVE_TENDER, LOG_IN_URL, PROCEED_PURCHASE_AUCTION, PURCHASE_OFFLINE_AUCTION, REVERSE_AUCTION_ITEM } from "./ApiUrls";
import { apiCall } from "../../Axios/Axios";

// User

export const userLogin = async (payload: { emailAdd: string, password: string }): Promise<any> => {
  try {
    const response = await axios.post(LOG_IN_URL, { ...payload, divice: "mobileApp" });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const fetchDashboard = async (): Promise<any> => {
  const data = await apiCall<any>('get', `${DASHBOARD_COUNT}`);
  return data
}


export const fetchPurchaseTender = async (): Promise<any> => {
  const data = await apiCall<any>('get', `${GET_MY_TENDER}`);
  return data
}
export const fetchLiveTender = async (): Promise<any> => {
  const data = await apiCall<any>('get', `${LIVE_TENDER}`);
  return data
}
export const fetchPurchaseAuction = async (): Promise<any> => {
  const data = await apiCall<any>('get', `${GET_MY_AUCTION}`);
  return data
}
export const fetchLiveAuction = async (payload: any): Promise<any> => {
  const data = await apiCall<any>('get', `${LIVE_AUCTION}`, {}, { payload });
  return data
}

// Auction Purchase offline
export const offlineAuctionPurchase = async (payload: any): Promise<any> => {
  try {
    const response = await apiCall<any>('post', `${PURCHASE_OFFLINE_AUCTION}`, payload);
    return response;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// EMD

export const fetchEmdCheck = async (payload: any): Promise<any> => {
  try {
    const response = await apiCall<any>('get', `${EMD_CHECK}`, {}, payload);
    return response;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const fetchAuctionItem = async (payload: any): Promise<any> => {
  try {
    if (payload.status == 'Reverse') {
      const response = await apiCall<any>('get', `${REVERSE_AUCTION_ITEM}`, {}, payload);
      return response;
    } else {
      const response = await apiCall<any>('get', `${FORARD_AUCTION_ITEM}`, {}, payload);
      return response;
    }


  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};