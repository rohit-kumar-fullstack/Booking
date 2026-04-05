import React, { memo } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import NavigationString from '../../Constant/NavigationString';
import colors from '../../Constant/Color';
const { width } = Dimensions.get('window');
const Product = ({ item, cartItem, onAdd, onInc, onDec, navigation }: any) => {
    return (
        <View style={styles.card}>
            <TouchableOpacity
                onPress={() =>
                    navigation.navigate(NavigationString.ProductDetail, {
                        product: item,
                    })
                }>
                <Image source={{ uri: item.image }} style={styles.image} />

                <Text numberOfLines={2} style={styles.title}>
                    {item.title}
                </Text>

                <Text style={styles.price}>₹ {item.price}</Text>
            </TouchableOpacity>

            {!cartItem ? (
                <TouchableOpacity style={styles.addBtn} onPress={() => onAdd(item)}>
                    <Text style={styles.btnText}>Add</Text>
                </TouchableOpacity>
            ) : (
                <View style={styles.qtyContainer}>
                    <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => onDec(item.id)}>
                        <Text style={styles.qtyText}>-</Text>
                    </TouchableOpacity>

                    <Text style={styles.qtyValue}>{cartItem.qty}</Text>

                    <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => onInc(item.id)}>
                        <Text style={styles.qtyText}>+</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

export default memo(Product);

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        width: width / 2 - 15,
        borderRadius: 12,
        padding: 10,
        marginBottom: 15,
        marginHorizontal: 5,
        elevation: 4,
    },

    image: {
        width: '100%',
        height: 110,
        resizeMode: 'contain',
    },

    title: {
        fontSize: 13,
        fontWeight: '600',
        marginTop: 6,
        minHeight: 35,
    },

    price: {
        fontSize: 15,
        fontWeight: '700',
        color: colors.primary,
        marginVertical: 4,
    },

    addBtn: {
        backgroundColor: colors.primary,
        paddingVertical: 6,
        borderRadius: 6,
        alignItems: 'center',
    },

    btnText: {
        color: '#fff',
        fontWeight: '600',
    },

    qtyContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    qtyBtn: {
        backgroundColor: colors.primary,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 4,
    },

    qtyText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },

    qtyValue: {
        marginHorizontal: 10,
        fontWeight: '600',
    },


});