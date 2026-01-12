import React from 'react';
import { View, ActivityIndicator } from 'react-native';

interface LoaderType {
    size?: 'small' | 'large';
    color?: string;
    style?: any;
}

const Loader = ({ size = "large", color = '#000', style }: LoaderType) => {
    return (
        <View style={[{ justifyContent: 'center', alignItems: 'center' , flex:1}, style]}>
            <ActivityIndicator size={size} color={color} />
        </View>
    );
};

export default Loader;
