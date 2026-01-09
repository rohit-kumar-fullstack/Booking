import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useRoute } from '@react-navigation/native';

const LiveTenderDetail = () => {
    const route = useRoute<any>();
    const { tender } = route.params;
    console.log("live tender details : ", tender)
    return (
        <View>
            <Text>LiveTenderDetail</Text>
        </View>
    )
}

export default LiveTenderDetail

const styles = StyleSheet.create({})