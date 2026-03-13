import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image,
} from 'react-native';

import LottieView from 'lottie-react-native';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import { colors, NavigationString } from '../../Constant/AllImports';
import { Header } from '../../Component/Index';

import {
  removeFromCart,
  incrementQty,
  decrementQty,
} from '../../Redux/Slices/AddToCartProduct';
import Header2 from '../../Component/Header/Header2';

const { width } = Dimensions.get('window');

const Cart = () => {

  const navigation: any = useNavigation();
  const dispatch = useDispatch();

  const cartProducts = useSelector((state: any) => state.cart.cartProducts);


  const cartItems = useMemo(() => {
    return Object.keys(cartProducts).map(key => ({
      ...cartProducts[key].productData,
      qty: cartProducts[key].qty,
    }));
  }, [cartProducts]);


  const subtotal = useMemo(() => {
    return cartItems.reduce((acc: number, item: any) => {
      return acc + item.price * item.qty;
    }, 0);
  }, [cartItems]);

  const shipping = subtotal > 0 ? 50 : 0;

  const gst = subtotal * 0.18;

  const total = subtotal + shipping + gst;


  const removeItem = (id: any) => {
    dispatch(removeFromCart({ productId: String(id) }));
  };

  const increment = (id: any) => {
    dispatch(incrementQty({ productId: String(id) }));
  };

  const decrement = (id: any) => {
    dispatch(decrementQty({ productId: String(id) }));
  };


  const renderItem = ({ item, index }: any) => {

    return (

      <Animated.View
        entering={FadeInUp.delay(index * 80)}
        style={styles.card}
      >

        <Image
          source={{ uri: item.image }}
          style={styles.image}
        />

        <View style={styles.details}>

          <Text numberOfLines={2} style={styles.title}>
            {item.title}
          </Text>

          <Text style={styles.category}>
            {item.category}
          </Text>

          <Text style={styles.price}>
            ₹ {item.price}
          </Text>


          <View style={styles.bottomRow}>

            {/* QTY CONTROLLER */}

            <View style={styles.qtyContainer}>

              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => decrement(item.id)}
              >
                <Text style={styles.qtySymbol}>−</Text>
              </TouchableOpacity>

              <Text style={styles.qtyValue}>
                {item.qty}
              </Text>

              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => increment(item.id)}
              >
                <Text style={styles.qtySymbol}>+</Text>
              </TouchableOpacity>

            </View>


            <TouchableOpacity
              onPress={() => removeItem(item.id)}
            >

              <Text style={styles.removeText}>
                Remove
              </Text>

            </TouchableOpacity>

          </View>

        </View>

      </Animated.View>

    );

  };


  if (cartItems.length === 0) {

    return (

      <View style={styles.container}>

        <Header2 title="My Cart" />

        <View style={styles.emptyContainer}>

          <Animated.View entering={FadeIn.duration(800)}>
            <LottieView
              source={require('../../lottie/ShoppingCart.json')}
              autoPlay
              loop
              style={styles.animation}
            />
          </Animated.View>

          <Text style={styles.emptyTitle}>
            Your Cart Is Empty
          </Text>

          <Text style={styles.subtitle}>
            Looks like you haven't added anything yet
          </Text>

          <TouchableOpacity
            style={styles.shopBtn}
            onPress={() => navigation.navigate(NavigationString.Home)}
          >

            <Text style={styles.shopText}>
              Start Shopping
            </Text>

          </TouchableOpacity>

        </View>

      </View>

    );
  }


  return (

    <View style={styles.container}>

      <Header2 title="My Cart" />

      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={(item: any) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 220 }}
      />


      {/* ORDER SUMMARY */}

      <View style={styles.summaryContainer}>

        <Text style={styles.summaryTitle}>
          Order Summary
        </Text>

        <View style={styles.summaryRow}>
          <Text>Subtotal</Text>
          <Text>₹ {subtotal.toFixed(2)}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text>Shipping</Text>
          <Text>₹ {shipping}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text>GST (18%)</Text>
          <Text>₹ {gst.toFixed(2)}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.summaryRow}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={styles.totalPrice}>
            ₹ {total.toFixed(2)}
          </Text>
        </View>


        <TouchableOpacity
          style={styles.checkoutBtn}
        >

          <Text style={styles.checkoutText}>
            Proceed To Checkout
          </Text>

        </TouchableOpacity>

      </View>

    </View>

  );

};

export default Cart;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F5F6FA"
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 12,
    marginVertical: 8,
    padding: 12,
    borderRadius: 14,
    elevation: 2
  },

  image: {
    width: 85,
    height: 85,
    resizeMode: "contain"
  },

  details: {
    flex: 1,
    marginLeft: 12
  },

  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111"
  },

  category: {
    fontSize: 13,
    color: "#777",
    marginVertical: 4
  },

  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 8
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF2FF",
    borderRadius: 8
  },

  qtyBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4
  },

  qtySymbol: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary
  },

  qtyValue: {
    fontSize: 15,
    fontWeight: "600",
    paddingHorizontal: 6
  },

  removeText: {
    color: "#E53935",
    fontWeight: "600"
  },

  summaryContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 20
  },

  summaryTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4
  },

  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 10
  },

  totalText: {
    fontWeight: "700",
    fontSize: 16
  },

  totalPrice: {
    fontWeight: "700",
    fontSize: 18
  },

  checkoutBtn: {
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 10,
    marginTop: 12,
    alignItems: "center"
  },

  checkoutText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20
  },

  animation: {
    width: width * 0.65,
    height: width * 0.65
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 10
  },

  subtitle: {
    color: "#777",
    marginTop: 8,
    marginBottom: 25,
    textAlign: "center"
  },

  shopBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 26,
    paddingVertical: 12,
    borderRadius: 25
  },

  shopText: {
    color: "#fff",
    fontWeight: "600"
  }

});