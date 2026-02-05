import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import api from "../services/api";

const { width } = Dimensions.get("window");
const COLUMN_GAP = 10;
const HORIZONTAL_PADDING = 20;
const PRODUCT_CARD_WIDTH = (width - HORIZONTAL_PADDING * 2 - COLUMN_GAP) / 2;

export default function HomeScreen({ navigation }: any) {
  const { user } = useAuth();

  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [topDiscounts, setTopDiscounts] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingBestSellers, setLoadingBestSellers] = useState(true);
  const [loadingTopDiscounts, setLoadingTopDiscounts] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggest, setShowSuggest] = useState(false);

  const formatPrice = (price) => {
    return Number(price).toLocaleString("vi-VN") + " VNĐ";
  };

  const calculateDiscountPrice = (price, discountPercent) => {
    const discounted = price - (price * discountPercent) / 100;
    return Number(discounted).toLocaleString("vi-VN") + " VNĐ";
  };




    const loadBooks = async () => {
      setLoadingBooks(true);

      try {
        let params: any = {};

        if (categoryFilter) {
          params.category = categoryFilter;
        }
        else if (search.trim() !== "") {
          params.search = search;
        }

        const res = await api.get("/books", { params });
        setBooks(res.data);

      } catch (err) {
        console.log("Lỗi load sách:", err);
      } finally {
        setLoadingBooks(false);
      }
    };

    const loadSuggestions = async (text) => {
      if (text.trim() === "") {
        setSuggestions([]);
        setShowSuggest(false);
        return;
      }

      try {
        const res = await api.get("/books", {
          params: { search: text }
        });

        // Chỉ lấy 5 gợi ý
        setSuggestions(res.data.slice(0, 5));
        setShowSuggest(true);
      } catch (err) {
        console.log("Lỗi gợi ý:", err);
      }
    };



  const loadCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.log("Lỗi load danh mục:", err);
    } finally {
      setLoadingCategories(false);
    }
  };

  const loadBestSellers = async () => {
    setLoadingBestSellers(true);
    try {
      const res = await api.get("/books/best-sellers");
      setBestSellers(res.data);
    } catch (err) {
      console.log("Lỗi load sách bán chạy:", err);
    } finally {
      setLoadingBestSellers(false);
    }
  };

  const loadTopDiscounts = async () => {
    setLoadingTopDiscounts(true);
    try {
      const res = await api.get("/books/top-discounts");
      setTopDiscounts(res.data);
    } catch (err) {
      console.log("Lỗi load sách giảm giá:", err);
    } finally {
      setLoadingTopDiscounts(false);
    }
  };

    useEffect(() => {
      loadBooks();
    }, [search, categoryFilter]);

    useEffect(() => {
      loadCategories();
      loadBestSellers();
      loadTopDiscounts();
    }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View
          style={{
            backgroundColor: "#6C63FF",
            paddingVertical: 25,
            paddingHorizontal: 20,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 26, fontWeight: "bold" }}>
            UTE Book Store
          </Text>
          <Text style={{ color: "#eee", marginBottom: 12 }}>
            Tri thức mới – Tương lai mới
          </Text>

          {/* SEARCH */}
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#fff",
              borderRadius: 12,
              alignItems: "center",
              paddingHorizontal: 12,
              paddingVertical: 10,
            }}
          >
            <Ionicons name="search" size={20} color="#666" />
                <TextInput
                  placeholder="Tìm kiếm sách..."
                  style={{ marginLeft: 10, flex: 1 }}
                  placeholderTextColor="#999"
                  value={search}
                  onChangeText={(text) => {
                    setSearch(text);
                    loadSuggestions(text);
                  }}
                  onSubmitEditing={() => {
                    navigation.navigate("SearchResult", { keyword: search });
                    setShowSuggest(false);
                  }}
                />


          </View>
            </View>
            {showSuggest && suggestions.length > 0 && (
              <View
                style={{
                  backgroundColor: "#fff",
                  marginTop: 5,
                  borderRadius: 10,
                  padding: 10,
                  elevation: 5,
                }}
              >
                {suggestions.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                        onPress={() => {
                          navigation.navigate("SearchResult", { query: item.title });
                          setShowSuggest(false);
                        }}

                    style={{
                      paddingVertical: 8,
                      borderBottomWidth: 0.5,
                      borderColor: "#eee",
                    }}
                  >
                    <Text style={{ fontSize: 14 }}>{item.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}


        {/* BANNER */}
        <View
          style={{
            margin: 20,
            padding: 20,
            backgroundColor: "#D62478",
            borderRadius: 18,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
            FLASH SALE
          </Text>
          <Text
            style={{
              color: "#fff",
              fontSize: 24,
              fontWeight: "bold",
              marginVertical: 5,
            }}
          >
            Giảm đến 50%
          </Text>
          <Text style={{ color: "#fff", marginBottom: 10 }}>
            Áp dụng cho sinh viên UTE
          </Text>

          <TouchableOpacity
            style={{
              backgroundColor: "#fff",
              paddingVertical: 8,
              paddingHorizontal: 16,
              alignSelf: "flex-start",
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "#D62478", fontWeight: "bold" }}>
              Xem ngay
            </Text>
          </TouchableOpacity>
        </View>

        {/* DANH MỤC */}
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            marginLeft: 20,
            marginBottom: 10,
          }}
        >
          Danh mục
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ paddingLeft: 20, marginBottom: 10 }}
        >
          {loadingCategories ? (
            <Text>Đang tải...</Text>
          ) : (
            categories.map((cat: any) => (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => {
                    // Navigate to CategoryBooksScreen with lazy loading
                    navigation.navigate("CategoryBooks", {
                      categoryId: cat.id,
                      categoryName: cat.name,
                    });
                  }}
                  style={{
                    backgroundColor: categoryFilter === cat.id ? "#6C63FF" : "#fff",
                    width: 100,
                    height: 110,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 15,
                    borderRadius: 16,
                    elevation: 3,
                    padding: 8,
                  }}
                >
                  {cat.image ? (
                    <Image
                      source={{ uri: cat.image }}
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        marginBottom: 5,
                      }}
                    />
                  ) : (
                    <Ionicons
                      name="book-outline"
                      size={30}
                      color={categoryFilter === cat.id ? "#fff" : "#6C63FF"}
                    />
                  )}
                  <Text
                    style={{
                      marginTop: 5,
                      fontSize: 12,
                      color: categoryFilter === cat.id ? "#fff" : "#000",
                      textAlign: "center",
                    }}
                    numberOfLines={2}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>

            ))
          )}
        </ScrollView>

        {/* SÁCH BÁN CHẠY NHẤT */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            marginTop: 20,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            🔥 Top 10 Bán Chạy
          </Text>
          <TouchableOpacity>
            <Text style={{ color: "#6C63FF" }}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ paddingLeft: 20, marginTop: 10 }}
        >
          {loadingBestSellers ? (
            <Text>Đang tải...</Text>
          ) : (
            bestSellers.map((item: any, index: number) => (
              <TouchableOpacity
                key={item.id}
                style={{
                  width: 160,
                  backgroundColor: "#fff",
                  borderRadius: 16,
                  padding: 12,
                  marginRight: 15,
                  elevation: 3,
                  position: "relative",
                }}
                onPress={() =>
                  navigation.navigate("BookDetail", { id: item.id })
                }
              >
                {/* Badge thứ hạng */}
                <View
                  style={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    backgroundColor: index < 3 ? "#FF6B6B" : "#6C63FF",
                    borderRadius: 12,
                    width: 24,
                    height: 24,
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 10,
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 12 }}>
                    {index + 1}
                  </Text>
                </View>

                <Image
                  source={{ uri: item.cover_image }}
                  style={{
                    width: "100%",
                    height: 150,
                    borderRadius: 12,
                    marginBottom: 8,
                  }}
                />

                <Text style={{ fontWeight: "bold", fontSize: 14 }} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={{ color: "#999", fontSize: 11 }} numberOfLines={1}>
                  {item.author_name || "Không rõ"}
                </Text>

                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                  <Ionicons name="cart" size={14} color="#FF6B6B" />
                  <Text style={{ color: "#FF6B6B", fontSize: 12, marginLeft: 4 }}>
                    Đã bán: {item.sold_count || 0}
                  </Text>
                </View>

                <Text
                  style={{
                    fontSize: 15,
                    color: "#6C63FF",
                    fontWeight: "bold",
                    marginTop: 4,
                  }}
                >
                  {formatPrice(item.price)}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        {/* SÁCH NỔI BẬT */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            marginTop: 20,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>Sách nổi bật</Text>

          <TouchableOpacity>
            <Text style={{ color: "#6C63FF" }}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>

        {/* LIST SÁCH */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ paddingLeft: 20, marginTop: 10 }}
        >
          {loadingBooks ? (
            <Text>Đang tải...</Text>
          ) : (
            books.map((item: any) => (
              <TouchableOpacity
                key={item.id}
                style={{
                  width: 160,
                  backgroundColor: "#fff",
                  borderRadius: 16,
                  padding: 12,
                  marginRight: 15,
                  elevation: 3,
                }}
                onPress={() =>
                  navigation.navigate("BookDetail", { id: item.id })
                }
              >
                <Image
                  source={{ uri: item.cover_image }}
                  style={{
                    width: "100%",
                    height: 150,
                    borderRadius: 12,
                    marginBottom: 8,
                  }}
                />

                <Text style={{ fontWeight: "bold", fontSize: 14 }}>
                  {item.title}
                </Text>
                <Text style={{ color: "#999", fontSize: 12 }}>
                  Tác giả: {item.author_name || item.author?.name || "Không rõ"}
                </Text>

                <Text
                  style={{
                    fontSize: 16,
                    color: "#6C63FF",
                    fontWeight: "bold",
                    marginTop: 6,
                  }}
                >
                  {formatPrice(item.price)}
                </Text>

              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        {/* SÁCH GIẢM GIÁ SỐC - 2 CỘT */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            marginTop: 25,
            marginBottom: 10,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            💥 Giảm Giá Sốc
          </Text>
          <TouchableOpacity>
            <Text style={{ color: "#6C63FF" }}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>

        {loadingTopDiscounts ? (
          <Text style={{ marginLeft: 20 }}>Đang tải...</Text>
        ) : (
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              paddingHorizontal: HORIZONTAL_PADDING,
              justifyContent: "space-between",
            }}
          >
            {topDiscounts.map((item: any) => (
              <TouchableOpacity
                key={item.id}
                style={{
                  width: PRODUCT_CARD_WIDTH,
                  backgroundColor: "#fff",
                  borderRadius: 16,
                  padding: 10,
                  marginBottom: 15,
                  elevation: 3,
                  position: "relative",
                }}
                onPress={() =>
                  navigation.navigate("BookDetail", { id: item.id })
                }
              >
                {/* Badge giảm giá */}
                <View
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    backgroundColor: "#FF3B30",
                    borderRadius: 8,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    zIndex: 10,
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 12 }}>
                    -{item.discount}%
                  </Text>
                </View>

                <Image
                  source={{ uri: item.cover_image }}
                  style={{
                    width: "100%",
                    height: 140,
                    borderRadius: 12,
                    marginBottom: 8,
                  }}
                />

                <Text
                  style={{ fontWeight: "bold", fontSize: 13 }}
                  numberOfLines={2}
                >
                  {item.title}
                </Text>
                <Text style={{ color: "#999", fontSize: 11 }} numberOfLines={1}>
                  {item.author_name || "Không rõ"}
                </Text>

                <View style={{ marginTop: 6 }}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#999",
                      textDecorationLine: "line-through",
                    }}
                  >
                    {formatPrice(item.price)}
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      color: "#FF3B30",
                      fontWeight: "bold",
                    }}
                  >
                    {calculateDiscountPrice(item.price, item.discount)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Khoảng cách cuối */}
        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
