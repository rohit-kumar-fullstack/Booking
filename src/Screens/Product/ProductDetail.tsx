import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import {
  addToCart,
  incrementQty,
  decrementQty,
} from '../../Redux/Slices/AddToCartProduct';
import colors from '../../Constant/Color';
import { ShoppingBag, Star } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const ProductDetail = ({ route, navigation }: any) => {
  const { product } = route.params;

  const dispatch = useDispatch();

  const cartProducts = useSelector((state: any) => state.cart.cartProducts);

  const currentQty = cartProducts[String(product.id)]?.qty || 0;

  const handleAddCart = () => {
    dispatch(
      addToCart({
        productId: String(product.id),
        qty: 1,
        productData: product,
      }),
    );
  };

  const handleIncrement = () => {
    dispatch(
      incrementQty({
        productId: String(product.id),
      }),
    );
  };

  const handleDecrement = () => {
    dispatch(
      decrementQty({
        productId: String(product.id),
      }),
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* PRODUCT IMAGE */}

        <View style={styles.imageSection}>
          <Image source={{ uri: product.image }} style={styles.productImage} />
        </View>

        {/* PRODUCT CARD */}

        <View style={styles.productCard}>

          <Text style={styles.category}>{product.category}</Text>

          <Text style={styles.title}>{product.title}</Text>

          {/* RATING */}

          <View style={styles.ratingBadge}>
            <Star size={24} color={colors.black} />
            <Text style={styles.ratingText}>{product.rating.rate}</Text>
          </View>

          <Text style={styles.review}>
            {product.rating.count} reviews
          </Text>

          {/* PRICE */}

          <Text style={styles.price}>${product.price}</Text>

          {/* QTY CONTROL */}

          {currentQty > 0 && (
            <View style={styles.qtyContainer}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={handleDecrement}>
                <Text style={{fontSize: 18 , fontWeight:'500'}}>-</Text>
              </TouchableOpacity>

              <Text style={styles.qtyValue}>{currentQty}</Text>

              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={handleIncrement}>
                <Text style={{fontSize: 18 , fontWeight:'500'}}>+</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* DESCRIPTION */}

        <View style={styles.descriptionCard}>
          <Text style={styles.sectionTitle}>Product Description</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>

      </ScrollView>

      {/* BOTTOM BUTTON */}

      <View style={styles.bottomBar}>

        {currentQty === 0 ? (
          <TouchableOpacity style={styles.primaryBtn} onPress={handleAddCart}>
            <ShoppingBag size={14} color="#fff" />

            <Text style={styles.primaryText}>Add To Cart</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.navigate('Cart')}>
            <ShoppingBag size={14} color="#fff" />
            <Text style={styles.primaryText}>Go To Cart</Text>
          </TouchableOpacity>
        )}

      </View>
    </View>
  );
};

export default ProductDetail;


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.white
  },

  imageSection: {
    backgroundColor: "#fff",
    height: 340,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12
  },

  productImage: {
    width: width * 0.65,
    height: width * 0.65,
    resizeMode: "contain"
  },

  productCard: {
    backgroundColor: "#fff",
    marginHorizontal: 14,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    // elevation: 4
  },

  category: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 6,
    textTransform: "capitalize"
  },

  title: {
    fontSize: 19,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 10
  },

  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 6
  },

  ratingText: {
    color: colors.black,
    marginLeft: 4,
    fontSize: 13,
    fontWeight: "600"
  },

  review: {
    color: "#6B7280",
    fontSize: 13,
    marginBottom: 10
  },

  price: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16
  },

  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    width: 150,
    justifyContent: "space-between",
    backgroundColor: "#F9FAFB"
  },

  qtyBtn: {
    padding: 12
  },

  qtyValue: {
    fontSize: 18,
    fontWeight: "600"
  },

  descriptionCard: {
    backgroundColor: "#fff",
    marginTop: 12,
    marginHorizontal: 14,
    borderRadius: 16,
    padding: 20
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 10
  },

  description: {
    fontSize: 14,
    lineHeight: 22,
    color: "#4B5563"
  },

  bottomBar: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff"
  },

  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 14
  },

  primaryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 6
  }

});