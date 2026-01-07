import axios from "axios";
import { DASHBOARD_COUNT, GET_MY_AUCTION, GET_MY_TENDER, GET_TENDER_DETAILS, LIVE_AUCTION, LIVE_TENDER, LOG_IN_URL, PROCEED_PURCHASE_AUCTION, PROCEED_TO_BID, PURCHASE_TENDER_OFFLINE, TENDER_LOGIN } from "./ApiUrls";
import { apiCall } from "../../Axios/Axios";

// User

export const userLogin = async (payload: { emailAdd: string, password: string }): Promise<any> => {
  try {
    // const response = await axios.post(LOG_IN_URL, { ...payload, divice: "mobileApp" });
    const response = await axios.post(TENDER_LOGIN, { ...payload, device: "mobileApp" });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const fetchDashboard = async (): Promise<any> => {
  const data = await apiCall<any>('get', `${DASHBOARD_COUNT}`);
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
    const response = await axios.post(PROCEED_PURCHASE_AUCTION, payload);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// Tender Purchase offline
export const offlineTenderPurchase = async (payload: any): Promise<any> => {
  try {
    const response = await apiCall<any>('post', PURCHASE_TENDER_OFFLINE, payload);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// tender  
export const fetchPurchaseTender = async ({
  page,
  size,
}: {
  page: number;
  size: number;
}) => {
  return apiCall<any>(
    'get',
    `${GET_MY_TENDER}?page=${page}&size=${size}`
  );
};



export const fetchLiveTender = async (): Promise<any> => {
  const data = await apiCall<any>('get', `${LIVE_TENDER}`);
  return data
}
export const fetchTenderById = async (tenderId: string): Promise<any> => {
  const data = await apiCall<any>(
    'get',
    `${GET_TENDER_DETAILS}${tenderId}`
  );
  return data;
};

export const proceedToBid = async (tenderId: string): Promise<any> => {
  const data = await apiCall<any>(
    'get',
    `${PROCEED_TO_BID}${tenderId}`
  );
  return data;
}
