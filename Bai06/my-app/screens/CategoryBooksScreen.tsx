import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState, useCallback } from "react";
import api from "../services/api";

const { width } = Dimensions.get("window");
const COLUMN_GAP = 10;
const HORIZONTAL_PADDING = 16;
const PRODUCT_CARD_WIDTH = (width - HORIZONTAL_PADDING * 2 - COLUMN_GAP) / 2;

interface Book {
  id: number;
  title: string;
  description: string;
  price: number;
  stock: number;
  cover_image: string;
  sold_count: number;
  discount: number;
  category_name: string;
  author_name: string;
  publisher_name: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasMore: boolean;
}

export default function CategoryBooksScreen({ route, navigation }: any) {
  const { categoryId, categoryName } = route.params;

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasMore: false,
  });

  const formatPrice = (price: number) => {
    return Number(price).toLocaleString("vi-VN") + " VNĐ";
  };

  const calculateDiscountPrice = (price: number, discountPercent: number) => {
    const discounted = price - (price * discountPercent) / 100;
    return Number(discounted).toLocaleString("vi-VN") + " VNĐ";
  };

  const loadBooks = async (page: number = 1, isRefresh: boolean = false) => {
    if (page === 1) {
      isRefresh ? setRefreshing(true) : setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const res = await api.get("/books/by-category", {
        params: {
          categoryId: categoryId,
          page: page,
          limit: 10,
        },
      });

      const { data, pagination: paginationData } = res.data;

      if (page === 1) {
        setBooks(data);
      } else {
        setBooks((prevBooks) => [...prevBooks, ...data]);
      }

      setPagination(paginationData);
    } catch (err) {
      console.log("Lỗi load sách theo category:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadBooks(1);
  }, [categoryId]);

  const handleLoadMore = () => {
    if (!loadingMore && pagination.hasMore) {
      loadBooks(pagination.currentPage + 1);
    }
  };

  const handleRefresh = () => {
    loadBooks(1, true);
  };

  const renderBookItem = ({ item }: { item: Book }) => (
    <TouchableOpacity
      style={styles.bookCard}
      onPress={() => navigation.navigate("BookDetail", { id: item.id })}
      activeOpacity={0.8}
    >
      {/* Badge giảm giá */}
      {item.discount > 0 && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountBadgeText}>-{item.discount}%</Text>
        </View>
      )}

      <Image
        source={{ uri: item.cover_image }}
        style={styles.bookImage}
        resizeMode="cover"
      />

      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.bookAuthor} numberOfLines={1}>
          {item.author_name || "Không rõ tác giả"}
        </Text>

        {/* Số lượng đã bán */}
        <View style={styles.soldRow}>
          <Ionicons name="cart" size={12} color="#FF6B6B" />
          <Text style={styles.soldText}>Đã bán: {item.sold_count || 0}</Text>
        </View>

        {/* Giá */}
        <View style={styles.priceContainer}>
          {item.discount > 0 ? (
            <>
              <Text style={styles.discountedPrice}>
                {calculateDiscountPrice(item.price, item.discount)}
              </Text>
              <Text style={styles.originalPrice}>{formatPrice(item.price)}</Text>
            </>
          ) : (
            <Text style={styles.normalPrice}>{formatPrice(item.price)}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#6C63FF" />
        <Text style={styles.loadingMoreText}>Đang tải thêm...</Text>
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="book-outline" size={64} color="#ccc" />
        <Text style={styles.emptyText}>Không có sách trong danh mục này</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {categoryName}
        </Text>
        <View style={styles.headerRight}>
          <Text style={styles.totalText}>
            {pagination.totalItems} sản phẩm
          </Text>
        </View>
      </View>

      {/* Loading */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6C63FF" />
          <Text style={styles.loadingText}>Đang tải sách...</Text>
        </View>
      ) : (
        <FlatList
          data={books}
          renderItem={renderBookItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    backgroundColor: "#6C63FF",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    flex: 1,
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  headerRight: {
    marginLeft: 12,
  },
  totalText: {
    color: "#fff",
    fontSize: 12,
    opacity: 0.9,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
  },
  listContainer: {
    padding: HORIZONTAL_PADDING,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: COLUMN_GAP,
  },
  bookCard: {
    width: PRODUCT_CARD_WIDTH,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: "relative",
  },
  discountBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#FF6B6B",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 10,
  },
  discountBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  bookImage: {
    width: "100%",
    height: PRODUCT_CARD_WIDTH * 1.2,
    backgroundColor: "#f0f0f0",
  },
  bookInfo: {
    padding: 10,
  },
  bookTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
    lineHeight: 18,
  },
  bookAuthor: {
    fontSize: 11,
    color: "#999",
    marginBottom: 4,
  },
  soldRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  soldText: {
    fontSize: 11,
    color: "#FF6B6B",
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: "column",
  },
  normalPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#6C63FF",
  },
  discountedPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FF6B6B",
  },
  originalPrice: {
    fontSize: 11,
    color: "#999",
    textDecorationLine: "line-through",
  },
  footerLoader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
  },
  loadingMoreText: {
    marginLeft: 8,
    color: "#666",
    fontSize: 13,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 14,
    color: "#999",
  },
});
