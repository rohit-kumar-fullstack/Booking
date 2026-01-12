import axios from "axios";
import { AUCTION_DOCUMENT_DOWNLOAD, DASHBOARD_COUNT, EMD_CHECK, FORARD_AUCTION_ITEM, GET_AUCTION_DETAILS, GET_MY_AUCTION, GET_MY_TENDER, GET_TENDER_DETAILS, LIVE_AUCTION, LIVE_TENDER, LOG_IN_URL, PROCEED_PURCHASE_AUCTION, PROCEED_TO_BID, PURCHASE_TENDER_OFFLINE, TENDER_LOGIN, PURCHASE_AUCTION_LIST, PURCHASE_OFFLINE_AUCTION, REVERSE_AUCTION_ITEM, VIEW_AUCTION_DOCUMENTS, VIEW_AUCTION_ITEM_DETAIL } from "./ApiUrls";
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
  const data = await apiCall<any>('get', `${LIVE_AUCTION}`, {}, payload);
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



export const fetchPurchaseAuctionList = async (payload: any): Promise<any> => {
  const data = await apiCall<any>('post', `${PURCHASE_AUCTION_LIST}`, payload);
  return data
}

export const getAuction = async (payload: any) => {
  const selectedRes = await apiCall<any>('get', GET_AUCTION_DETAILS, {}, { id: payload.auctionId });
  return selectedRes.data;
}
export const viewAuctionItemDocuments = async (payload: { auctionItemId: number }) => {
  const selectedRes = await apiCall<any>('get', VIEW_AUCTION_ITEM_DETAIL, {}, payload);
  return selectedRes.data;
}
export const viewAuctionDocuments = async (payload: { auctionId: number }) => {
  const selectedRes = await apiCall<any>('get', VIEW_AUCTION_DOCUMENTS, {}, payload);
  return selectedRes.data;
}
export const viewAuctionDocumentDownload = async (payload: { documentId: number, isAmendment: boolean }) => {
  const selectedRes = await apiCall<any>('get', AUCTION_DOCUMENT_DOWNLOAD, {}, payload);
  return selectedRes.data;
}