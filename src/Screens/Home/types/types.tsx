export interface DashboardCard {
    id: number;
    title: 'Tenders' | 'Auctions';
    leftLabel: string;
    leftValue: number;
    rightLabel: string;
    rightValue: number;
    buttonText: string;
}