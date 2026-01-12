import { StyleSheet } from "react-native";
import colors from "../../Constant/Color";

let BookingStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f5f8',
    },

    listContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 24,
    },

    cardWrapper: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginBottom: 14,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },

    accent: {
        width: 6,
        backgroundColor: '#065F46',
    },

    cardContent: {
        flex: 1,
        padding: 16,
    },

    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    name: {
        flex: 1,
        fontSize: 16,
        fontWeight: '700',
        color: '#064E3B',
    },

    badge: {
        backgroundColor: '#D1FAE5',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        marginLeft: 8,
    },

    badgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#065F46',
    },

    bottomRow: {
        marginTop: 12,
    },

    dateLabel: {
        fontSize: 12,
        color: '#6B7280',
    },

    date: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
        marginTop: 2,
    },
    floatingButton: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        backgroundColor: colors.primary,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },
    filterRow: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        gap: 8,
        paddingTop: 20
    },
    filterChip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#E5E7EB',
    },
    filterChipActive: {
        backgroundColor: colors.primary,
    },
    filterText: {
        fontSize: 13,
        color: '#374151',
        fontWeight: '500',
    },
    filterTextActive: {
        color: '#FFFFFF',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 60,
        color: '#6B7280',
        fontSize: 15,
    },

});

export default BookingStyle;