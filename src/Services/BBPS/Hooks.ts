import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { fetchDashboard, fetchLiveAuction, fetchLiveTender, fetchPurchaseAuction, fetchPurchaseTender, offlineAuctionPurchase, userLogin } from './apis';

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
        queryKey: ['fetchLiveAuction',],
        queryFn: ({ pageParam = 1 }) =>
            fetchLiveAuction({
                page: pageParam,
                size: 10,
            }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            const { page, size, totalCount } = lastPage;
            const totalPages = Math.ceil(totalCount / size);
            const nextPage = page + 1;
            return nextPage < totalPages ? nextPage : undefined;
        },
        select: (data) => {

            const mergedResults = data.pages.flatMap((page: any) => page.data ?? []);
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