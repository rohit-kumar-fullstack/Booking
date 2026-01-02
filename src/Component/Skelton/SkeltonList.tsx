import { View, Dimensions } from 'react-native';
import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const SkeltonList = () => {
    const { width, height } = Dimensions.get('screen');

    return (
        <View style={{ width: width - 30, height }}>
            {[...Array(10)].map((_, index) => (
                <SkeletonPlaceholder key={index} borderRadius={5}>
                    <SkeletonPlaceholder.Item width={"100%"} height={50} marginBottom={12} />
                </SkeletonPlaceholder>
            ))}
        </View>
    );
};

export default SkeltonList;
