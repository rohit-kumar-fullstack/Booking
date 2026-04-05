import { View, RefreshControl } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { colors } from '../../Constant/AllImports';
import { useNavigation } from '@react-navigation/native';
import { addToCart, decrementQty, incrementQty } from '../../Redux/Slices/AddToCartProduct';
import Skelton from '../../Component/Skelton/Skelton';
import { FlashList } from '@shopify/flash-list';
import { useDispatch, useSelector } from 'react-redux';
import Product from '../Product/Product';
import Animated, { useSharedValue, useAnimatedScrollHandler } from 'react-native-reanimated';
import { Header } from '@components/Index';

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList);

const Home = () => {
  const Navigation: any = useNavigation();
  const dispatch = useDispatch();

  const cartProducts = useSelector((state: any) => state.cart.cartProducts);

  const [refreshing, setRefreshing] = useState(false);
  const [products, setProducts] = useState<any[]>([
    {
      id: 1,
      title: 'Wireless Bluetooth Headphones',
      price: 1299,
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 2,
      title: 'Smart Watch Series 7',
      price: 2499,
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 3,
      title: 'Men Casual Shoes',
      price: 999,
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 4,
      title: 'Women Handbag',
      price: 1599,
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 5,
      title: 'Gaming Mouse RGB',
      price: 799,
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 6,
      title: 'Laptop Backpack',
      price: 1199,
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 7,
      title: 'Wireless Earbuds',
      price: 1799,
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 8,
      title: 'Fitness Band',
      price: 899,
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 9,
      title: 'Wireless Bluetooth Headphones',
      price: 1299,
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 10,
      title: 'Smart Watch Series 7',
      price: 2499,
      image: 'https://via.placeholder.com/150',
    },
  ]);

  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const renderItem = useCallback(
    ({ item }: any) => {
      const cartItem = cartProducts[String(item.id)];

      return (
        <Product
          item={item}
          cartItem={cartItem}
          onAdd={handleAddCart}
          onInc={handleIncrement}
          onDec={handleDecrement}
          navigation={Navigation}
        />
      );
    },
    [cartProducts],
  );

  const handleAddCart = useCallback((product: any) => {
    dispatch(
      addToCart({
        productId: String(product.id),
        qty: 1,
        productData: product,
      }),
    );
  }, []);

  const handleIncrement = useCallback((id: any) => {
    dispatch(incrementQty({ productId: String(id) }));
  }, []);

  const handleDecrement = useCallback((id: any) => {
    dispatch(decrementQty({ productId: String(id) }));
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('https://fakestoreapi.com/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.log('API Error', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>

      <Header scrollY={scrollY} />

      {products.length === 0 ? (
        <Skelton />
      ) : (
        <AnimatedFlashList
          data={products}
          renderItem={renderItem}
          keyExtractor={(item: any) => item.id.toString()}
          onScroll={onScroll}
          scrollEventThrottle={16}
          numColumns={2}
          // estimatedItemSize={220}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            padding: 10,
            paddingBottom: 50,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
            />
          }
          removeClippedSubviews
        />
      )}
    </View>
  );
};

export default Home;