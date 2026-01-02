import { View, Dimensions } from 'react-native';
import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const Skeleton = () => {
  const { width } = Dimensions.get('screen');
  const cardWidth = width - 30; // full width with some padding

  return (
    <View style={{ padding: 10 }}>
      {[...Array(6)].map((_, index) => (
        <SkeletonPlaceholder key={index}>
          <SkeletonPlaceholder.Item
            width={cardWidth}
            marginBottom={20}
            borderRadius={12}
            overflow="hidden"
          >
            {/* Image */}
            <SkeletonPlaceholder.Item width={cardWidth} height={150} borderRadius={12} />

            {/* Title */}
            <SkeletonPlaceholder.Item marginTop={10} width={cardWidth * 0.7} height={18} borderRadius={6} />

            {/* Subtitle / Price */}
            <SkeletonPlaceholder.Item marginTop={6} width={cardWidth * 0.5} height={14} borderRadius={6} />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
      ))}
    </View>
  );
};

export default Skeleton;
