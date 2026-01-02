export interface LiveAuctionTileProps {
    data: any
    onPurchasePress?: () => void;
    onDetailsPress?: () => void;
    index: number;
    auctionDispatchDate?: string;
    auctionOfWork?: string;
    purchaseEnd?: string;
    auctionFees?: string | number;
    isPurchased?: boolean;
    auctionId?: any;
    auctionNumber?: any;
}

export interface allBooleanProps {
    showDetail?: boolean
    isShowFilter?: boolean
}