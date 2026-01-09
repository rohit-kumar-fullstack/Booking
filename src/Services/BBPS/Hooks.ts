import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { fetchAuctionItem, fetchDashboard, fetchEmdCheck, fetchLiveAuction, fetchLiveTender, fetchPurchaseAuction, fetchPurchaseAuctionList, fetchPurchaseTender, getAuction, offlineAuctionPurchase, userLogin, offlineTenderPurchase, fetchTenderById, proceedToBid, viewAuctionDocumentDownload, viewAuctionDocuments, viewAuctionItemDocuments } from './apis';

// User

export const useLogin = () => {
    return useMutation({
        mutationFn: (payload: { emailAdd: string, password: string }) => userLogin(payload),
    });
};

// Dashboard
export const useDashboard = () => {
    return useQuery({
        queryKey: ['fetchDashboard'],
        queryFn: () => fetchDashboard()
    });
};

// Auction & Tender

export const useFetchPurchaseTender = () => {
    return useInfiniteQuery({
        queryKey: ['fetchPurchaseTender'],
        queryFn: ({ pageParam = 0 }) =>
            fetchPurchaseTender({
                page: pageParam,
                size: 10,
            }),
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            console.log('last page : ', lastPage)
            console.log("all page : ", allPages)
            const {totalCount } = lastPage;

            const totalPages = Math.ceil(totalCount / 10);
            const nextPage = allPages.length;
            return nextPage < totalPages ? nextPage : undefined;
        },

        select: (data) => ({
            ...data,
            result: data.pages.flatMap(
                (page: any) => page?.data ?? []
            ),
        }),
    });
};



export const useFetchLiveTender = () => {
    return useQuery({
        queryKey: ['fetchLiveTender',],
        queryFn: () => fetchLiveTender()
    });
};

export const useFetchPurchaseAuction = () => {
    return useQuery({
        queryKey: ['fetchPurchaseAuction',],
        queryFn: () => fetchPurchaseAuction()
    });
};

export const useFetchLiveAuction = () => {
    return useInfiniteQuery<any>({
        queryKey: ['fetchLiveAuction'],
        queryFn: ({ pageParam = 0 }) =>
            fetchLiveAuction({
                page: pageParam,
                size: 10,
            }),
        initialPageParam: 0,

        getNextPageParam: (lastPage, allPages) => {
            const { size, totalCount } = lastPage;
            const totalPages = Math.ceil(totalCount / size);
            const nextPage = allPages.length;
            return nextPage < totalPages ? nextPage : undefined;
        },

        select: (data) => {
            const mergedResults = data.pages.flatMap(
                (page: any) => page?.data ?? []
            );

            return {
                ...data,
                result: mergedResults,
            };
        },
    });
};


// Auction Purchase offline

export const useOfflineAuctionPurchase = () => {
    return useMutation({
        mutationFn: (payload: any) => offlineAuctionPurchase(payload),
    });
};
export const useOfflineTenderPurchase = () => {
    return useMutation({
        mutationFn: (payload: any) => offlineTenderPurchase(payload),
    });
};

export const useFetchTenderById = (tenderId: string) => {
    return useQuery({
        queryKey: ['fetchTenderById', tenderId],
        queryFn: () => fetchTenderById(tenderId)

    });
}

export const useProceedToBid = (tenderId?: string) => {
    return useQuery({
        queryKey: ['proceedToBid', tenderId],
        queryFn: () => proceedToBid(tenderId as string),
        enabled: false, // 👈 manual trigger
    });
};




// EMD
export const useEmdCheck = () => {
    return useMutation({
        mutationFn: (payload: any) => fetchEmdCheck(payload),
    });
};

export const useAuctionItem = () => {
    return useMutation({
        mutationFn: (payload: { auctionNumber: string, status: string }) => fetchAuctionItem(payload),
    });
};


// Purchase Auction List
export const usePurchaseAuctionList = () => {
    return useMutation({
        mutationFn: (payload: any) => fetchPurchaseAuctionList(payload),
    });
};

export const useGetAuciton = (payload: { auctionId: string }) => {
    return useQuery({
        queryKey: ['getAuction'],
        queryFn: () => getAuction(payload)
    });
};

export const useGetAucitonDocument = (payload: { auctionId: number }) => {
    return useQuery({
        queryKey: ['viewAuctionDocuments'],
        queryFn: () => viewAuctionDocuments(payload)
    });
};

export const useAucitonItemDetail = (payload: { auctionItemId: number }) => {
    return useQuery({
        queryKey: ['viewAuctionItemDocuments'],
        queryFn: () => viewAuctionItemDocuments(payload)
    });
};

export const useAucitonDocDownload = () => {
    return useMutation({
        mutationFn: (payload: { documentId: number, isAmendment: boolean }) => viewAuctionDocumentDownload(payload),
    });
};
