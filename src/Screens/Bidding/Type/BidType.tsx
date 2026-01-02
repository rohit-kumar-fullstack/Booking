export type AuctionItem = {
  id: number;
  productName: string;
  auctionStartValueFigure: number;
  bidVariationValue: number;
  bidAmount: any
  me: boolean
  bidAvilable: number
  inventoryId: number
};
export type allBooleanType = {
  ItemsBasedBids: any
  showBidModal: boolean
  isActiveItem: boolean
  activeItemId: number | null
  acitveItemData: any
  timeEnd: boolean
}