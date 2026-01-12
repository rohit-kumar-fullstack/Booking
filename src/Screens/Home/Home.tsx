import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, StatusBar, TouchableOpacity, RefreshControl } from 'react-native';
import { Header } from '../../Component/Index';
import BookingStyle from './HomeStyle';
import { Plus } from 'lucide-react-native';
import BookingCreateModal from '../../Modals/BookingCreateModal';
import { useSelector } from 'react-redux';
import colors from '../../Constant/Color';
import AnimatedCard from './AnimatedCard';

const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Hotel', value: 'hotel' },
  { label: 'Cab', value: 'cab' },
  { label: 'Resort', value: 'resort' },
  { label: 'Flight', value: 'flight' },
];

const Home = () => {
  const BOOKINGS = useSelector((state: any) => state.booking);
  const [showBookModal, setShowBookModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const filteredBookings = useMemo(() => {
    if (selectedFilter === 'all') return BOOKINGS;
    return BOOKINGS.filter((b: any) => b.service === selectedFilter);
  }, [BOOKINGS, selectedFilter]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  };

  return (
    <View style={BookingStyle.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F1F5F9" />
      <Header title="Bookings" />

      {/* filter */}
      <View style={BookingStyle.filterRow}>
        {FILTERS.map(item => {
          const active = selectedFilter === item.value;
          return (
            <TouchableOpacity
              key={item.value}
              onPress={() => setSelectedFilter(item.value)}
              style={[
                BookingStyle.filterChip,
                active && BookingStyle.filterChipActive,
              ]}
            >
              <Text
                style={[
                  BookingStyle.filterText,
                  active && BookingStyle.filterTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* render card */}
      <FlatList
        data={filteredBookings}
        keyExtractor={item => item.id}
        contentContainerStyle={BookingStyle.listContent}
        renderItem={({ item, index }) => (
          <AnimatedCard item={item} index={index} />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={BookingStyle.emptyText}>
            No bookings found
          </Text>
        }
      />

      <TouchableOpacity
        style={BookingStyle.floatingButton}
        onPress={() => setShowBookModal(true)}
      >
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {showBookModal && (
        <BookingCreateModal
          visible={showBookModal}
          onClose={() => setShowBookModal(false)}
        />
      )}
    </View>
  );
};

export default Home;
