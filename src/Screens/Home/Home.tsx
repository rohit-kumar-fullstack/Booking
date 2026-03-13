import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, RefreshControl, FlatList } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { colors, NavigationString } from '../../Constant/AllImports';

import LinearGradient from 'react-native-linear-gradient';
import { Badge } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import MainStyle from '../../Styles/MainStyle';
import { addToCart, decrementQty, incrementQty } from '../../Redux/Slices/AddToCartProduct';
// import SearchButton from './Component/SearchButton';
import Skelton from '../../Component/Skelton/Skelton';
import SearchButton from './Component/SearchButton';
import { Headset, Heart, ShoppingCart } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const Home = () => {
  const Navigation: any = useNavigation();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  const cartProducts = useSelector(
    (state: any) => state.cart.cartProducts,
  );

  const cartCount = Object.keys(cartProducts).length;
  const [products, setProducts] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await fetch('https://fakestoreapi.com/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.log('API Error', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, []),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

  const handleAddCart = (product: any) => {
    dispatch(
      addToCart({
        productId: String(product.id),
        qty: 1,
        productData: product,
      }),
    );
  };

  const handleIncrement = (id: any) => {
    dispatch(
      incrementQty({
        productId: String(id),
      }),
    );
  };

  const handleDecrement = (id: any) => {
    dispatch(
      decrementQty({
        productId: String(id),
      }),
    );
  };

  const renderProduct = ({ item }: any) => {
    const cartItem = cartProducts[String(item.id)];

    return (
      <View style={styles.card}>
        <TouchableOpacity
          onPress={() =>
            Navigation.navigate(NavigationString.ProductDetail, {
              product: item,
            })
          }
        >

          <Image source={{ uri: item.image }} style={styles.image} />

          <Text numberOfLines={2} style={styles.title}>
            {item.title}
          </Text>

          <Text style={styles.price}>₹ {item.price}</Text>
        </TouchableOpacity>


        {!cartItem ? (
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => handleAddCart(item)}>
            <Text style={styles.btnText}>Add</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.qtyContainer}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => handleDecrement(item.id)}>
              <Text style={styles.qtyText}>-</Text>
            </TouchableOpacity>

            <Text style={styles.qtyValue}>{cartItem.qty}</Text>

            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => handleIncrement(item.id)}>
              <Text style={styles.qtyText}>+</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      {/* Header */}
      <LinearGradient
        colors={['#0F766E', '#f4fffd']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ paddingHorizontal: 10, paddingTop: insets.top }}>
        <View style={[MainStyle.flexBetween]}>
          <SearchButton onPress={() => { }} />

          <View
            style={[
              MainStyle.flexBetween,
              { width: '40%', justifyContent: 'space-around' },
            ]}>

            <TouchableOpacity
              onPress={() =>
                Navigation.navigate(NavigationString.HelpSupport)
              }>
              {/* <Icon3 name="headset" size={24} color={colors.Black} /> */}
              <Headset size={24} color={colors.black} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                Navigation.navigate(NavigationString.WishListProduct)
              }>
              {/* <Icon2 name="heart-outline" size={24} color={colors.Black} /> */}
                <Heart size={24} color={colors.black} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => Navigation.navigate(NavigationString.Cart)}>
              {/* <Icon name="shopping-cart" size={24} color={colors.Black} /> */}
                <ShoppingCart  size={24} color={colors.black} />

              {cartCount > 0 && (
                <Badge style={styles.badge}>{cartCount}</Badge>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {
        products.length === 0 ? (
          <Skelton />
        ) :
          <FlatList
            data={products}
            keyExtractor={item => item.id.toString()}
            renderItem={renderProduct}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            contentContainerStyle={{ padding: 10, paddingBottom: 50 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[colors.primary]}
              />
            }
          />
      }

    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    width: width / 2 - 20,
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
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

  badge: {
    position: 'absolute',
    right: -8,
    top: -6,
    backgroundColor: colors.primary,
  },
});

