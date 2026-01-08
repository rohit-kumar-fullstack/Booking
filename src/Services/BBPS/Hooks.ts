import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { fetchAuctionItem, fetchDashboard, fetchEmdCheck, fetchLiveAuction, fetchLiveTender, fetchPurchaseAuction, fetchPurchaseAuctionList, fetchPurchaseTender, getAuction, offlineAuctionPurchase, userLogin, viewAuctionDocumentDownload, viewAuctionDocuments, viewAuctionItemDocuments } from './apis';

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
    return useQuery({
        queryKey: [],
        queryFn: () => fetchPurchaseTender()
    });
};

export const useFetchLiveTender = () => {
    return useQuery({
        queryKey: [],
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
