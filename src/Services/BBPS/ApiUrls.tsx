const BASE_URL = `https://procurelinc.in/EProcurementSB/`
// const BASE_URL_Auction = `https://procurelinc.in/AuctionPostgre/api/auction/`
export const BASE_URL_Auction = `https://procurelinc.in/Auction/`
// const BASE_URL = `https://192.168.29.226:8090/EProcurementSB/`
const GET_DESIGNATION = `${BASE_URL}contractor/getAllDesignationContractor`
const SAVE_CONTRACTOR_STAGE1 = `${BASE_URL}contractor/registerContractorStage1`
const GET_CONTRACTOR_CLASS = `${BASE_URL}contractor/allContractorClassSecond`
const VERIFY_ORGPAN = `${BASE_URL}ekycdocverify/companyPanVerification`
const SEND_ADHAROTP = `${BASE_URL}ekycdocverify/aadhaarVerification`
const VERIFY_ADHAR = `${BASE_URL}ekycdocverify/aadhaarOtpVerification`
const VERIFY_GST = `${BASE_URL}ekycdocverify/gstVerification`
const ALLORG = `${BASE_URL}contractor/allOrganization`
const ALLSOCIALCAT = `${BASE_URL}contractor/allSocialCategories`
const ALLMSME = `${BASE_URL}contractor/allMsMeOrg`
const ALLCONTRACTOR = `${BASE_URL}contractor/getAllStatesContractor`
const GETCONTRACTORBYSTATE = `${BASE_URL}contractor/getCitiesContractorByStateId`
const REJ_STAGE_TWO = `${BASE_URL}contractor/indianContractorStage2`
const STAGETHREE = `${BASE_URL}contractor/contractorstage3`
const PARTNER_API_ENDPOINT = `${BASE_URL}contractor/contstage3_Partnership`
const ALL_DESIGNATION = `${BASE_URL}contractor/getAllDesignationContractor`
const ALL_MSME = `${BASE_URL}contractor/allMsMeOrg`
const CONTRACTOR_PROFILE = `${BASE_URL}contractor/getPreviousContractorDetails?regisId=`
const CONTRACTOR_BASIC_PROFILE = `${BASE_URL}contractor/getContractorById?contId=`
const CONTRACTOR_PROFILE_UPDATE = `${BASE_URL}contractor/updateContBasicDetails?id=`
const GET_REGISTRATION_STATE = `${BASE_URL}contractor/getContractorOrgTypeandStatus`
const GET_MASTER_DATA = `${BASE_URL}contractor/masterdata/all`

const LOG_IN_URL = `${BASE_URL_Auction}auction/loginWithoutDecryption`
const LIVE_TENDER = `${BASE_URL}liveTender/getAllLiveTenders`
const LIVE_AUCTION = `${BASE_URL_Auction}api/auction/getLiveAuctionForMobile`
const PROCEED_PURCHASE_AUCTION = `${BASE_URL_Auction}api/auction/proceedToPurchase`
const PURCHASE_AUCTION = `${BASE_URL_Auction}api/auction/purchaseAuction`
const PURCHASE_OFFLINE_AUCTION = `${BASE_URL_Auction}api/auction/purchaseAuctionOffline`
const PURCHASE_TENDER = `https://procurelinc.in/EProcurementSB/tenderPayment/purchaseTender`
const AUCTION_PURCHASE_STATUS = `https://api.godemo.in/Auction/api/auction/transactionStatus?orderNo=`
const GET_TENDER_DETAILS = `${BASE_URL}eTendering/getTenderById?tenderId=`
const GET_DOCID = `${BASE_URL}eTendering/download/docId?docId=`
// https://procurelinc.in/EProcurementSB/eTendering/download/docId?docId=158 
// const DOWNLOAD_DOC = `${BASE_URL}eTende                                                                                                                              ring/download/docId?docId=`
const DOWNLOAD_DOC = `${BASE_URL}eTendering/download/docId?docId=`
const TWO_FACTOR_AUTH = `${BASE_URL}contractor/two-factor-auth?status=`
const AUCTION_LOGIN = `https://api.godemo.in/Auction/auction/loginWithoutDecryption`
const GET_AUCTION_DETAILS = `${BASE_URL_Auction}api/auction/getAuction/id`
const TANDER_PURCHASE_STATUS = `https://procurelinc.in/EProcurementSB/tenderPayment/transactionStatus?orderNo=`
const GET_MY_AUCTION = `${BASE_URL_Auction}api/auction/getMyAuction`
const GET_MY_TENDER = "https://procurelinc.in/EProcurementSB/tenderBidding/getAllPurchasedTendersByConId"
const GET_DOCID_AUCTION = `${BASE_URL_Auction}api/auction/viewDocumentsForAuction?auctionId=`
const DOWNLOAD_DOC_AUCTION = "https://api.godemo.in/Auction/api/auction/downloadDocumentForAuction?documentId="
const FORARD_AUCTION_ITEM = `${BASE_URL_Auction}api/auction/getForwardAuctionItems/auctionNumber`
const AUCTION_ITEM_SUBMIT = `${BASE_URL_Auction}api/auction/addEMDDocumentsItemWise`
const EMD_CHECK = `${BASE_URL_Auction}api/auction/getEMDDocumentsForAuction`
const REVERSE_AUCTION_ITEM = `${BASE_URL_Auction}api/auction/getReverseAuctionItems/auctionNumber`
const FORWARD_AUCTION_ITEM = `${BASE_URL_Auction}api/auction/getForwardAuctionItems/auctionNumber`
const SELECTED_AUCTION_ITEM = `${BASE_URL_Auction}api/auction/getEMDDocumentsForAuction`
const GET_TECHNICAL_DOCUMENTAION = `${BASE_URL_Auction}api/auction/getAllTechnicalDocumentTemplates`
const CHECK_TECHNICAL_DOCUMENTAION = `${BASE_URL_Auction}api/auction/checkContractorAuctionMatch`
const TECHNICAL_VALUE_SUBMIT = `${BASE_URL_Auction}api/auction/saveTechnicalDocumentTemplateValue`
const TECHNICAL_DOCUMENT_SUBMIT = `${BASE_URL_Auction}api/auction/TechnicalDocumentUpload`
const ITEM_DETAIL = `${BASE_URL_Auction}api/auction/home/viewDocuments/inventoryId`
const ITEM_DOCUMENT_DOWNLOAD = `${BASE_URL_Auction}api/auction/home/downloadDocument/documentId`

// Rohit
const DASHBOARD_COUNT = `${BASE_URL_Auction}api/auction/home/dashboard/counts`
const AUCTION_ONE_TIME_BID = `${BASE_URL_Auction}api/bidding/getBidForAuction`
const AUCITON_SINGLE_EMD = `${BASE_URL_Auction}api/auction/addEMDDocumentsAuctionWise`
const PURCHASE_AUCTION_LIST = `${BASE_URL_Auction}api/auction/proceedToPurchase`
const VIEW_AUCTION_ITEM_DETAIL = `${BASE_URL_Auction}api/auction/home/viewDocumentsForAuctionItemDetails`
const VIEW_AUCTION_DOCUMENTS = `${BASE_URL_Auction}api/auction/viewDocumentsForAuction`
const AUCTION_DOCUMENT_DOWNLOAD = `${BASE_URL_Auction}api/auction/home/downloadDocumentForAuction`
const AUCTION_ITEM_DOCUMENT_DOWNLOAD = `${BASE_URL_Auction}api/auction/home/downloadDocument/auctionItemId`

export {
  // Rohit
  VIEW_AUCTION_ITEM_DETAIL,
  AUCTION_ITEM_DOCUMENT_DOWNLOAD,
  AUCTION_DOCUMENT_DOWNLOAD,
  VIEW_AUCTION_DOCUMENTS,
  AUCITON_SINGLE_EMD,
  DASHBOARD_COUNT,
  AUCTION_ONE_TIME_BID,
  ITEM_DOCUMENT_DOWNLOAD,
  PURCHASE_AUCTION_LIST,
  ITEM_DETAIL,
  TECHNICAL_DOCUMENT_SUBMIT,
  TECHNICAL_VALUE_SUBMIT,
  CHECK_TECHNICAL_DOCUMENTAION,
  GET_TECHNICAL_DOCUMENTAION,
  SELECTED_AUCTION_ITEM,
  REVERSE_AUCTION_ITEM,
  FORWARD_AUCTION_ITEM,
  EMD_CHECK,
  AUCTION_ITEM_SUBMIT,
  FORARD_AUCTION_ITEM,
  DOWNLOAD_DOC_AUCTION,
  GET_DOCID_AUCTION,
  GET_MY_TENDER,
  GET_MY_AUCTION,
  TANDER_PURCHASE_STATUS,
  GET_TENDER_DETAILS,
  GET_DESIGNATION,
  SAVE_CONTRACTOR_STAGE1,
  LOG_IN_URL,
  GET_CONTRACTOR_CLASS,
  VERIFY_ORGPAN,
  SEND_ADHAROTP,
  VERIFY_ADHAR,
  VERIFY_GST,
  GET_REGISTRATION_STATE,
  ALLMSME,
  ALLCONTRACTOR,
  ALLORG,
  ALLSOCIALCAT,
  ALL_MSME,
  GETCONTRACTORBYSTATE,
  REJ_STAGE_TWO,
  PARTNER_API_ENDPOINT,
  STAGETHREE,
  ALL_DESIGNATION,
  BASE_URL,
  CONTRACTOR_PROFILE,
  CONTRACTOR_PROFILE_UPDATE,
  LIVE_TENDER,
  LIVE_AUCTION,
  PROCEED_PURCHASE_AUCTION,
  PURCHASE_AUCTION,
  AUCTION_PURCHASE_STATUS,
  CONTRACTOR_BASIC_PROFILE,
  PURCHASE_TENDER,
  GET_DOCID,
  DOWNLOAD_DOC,
  GET_AUCTION_DETAILS,
  AUCTION_LOGIN,
  TWO_FACTOR_AUTH,
  GET_MASTER_DATA,
  PURCHASE_OFFLINE_AUCTION
};

