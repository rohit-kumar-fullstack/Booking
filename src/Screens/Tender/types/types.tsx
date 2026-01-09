export interface LiveTenderTileProps {
    data: any
    onPurchasePress?: () => void;
    onDetailsPress?: () => void;
    index: number;
    tenderDispatchDate?: string;
    tenderOfWork?: string;
    purchaseEnd?: string;
    tenderFees?: string | number;
    isPurchased?: boolean;
    tenderId?: any;
    tenderNumber?: any;
}

export interface allBooleanProps {
    showDetail?: boolean
    isShowFilter?: boolean
}