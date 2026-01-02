import axios from "axios";
import { DASHBOARD_COUNT, GET_MY_AUCTION, GET_MY_TENDER, LIVE_AUCTION, LIVE_TENDER, LOG_IN_URL, PROCEED_PURCHASE_AUCTION } from "./ApiUrls";
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
    const response = await axios.post(PROCEED_PURCHASE_AUCTION, payload);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};