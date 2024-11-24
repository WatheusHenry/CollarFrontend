import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useSearchParams } from "expo-router/build/hooks";
import Carousel from "react-native-snap-carousel"; // Importando o carrossel
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const PostDetailsScreen = () => {
  const searchParams = useSearchParams();
  const [id, setId] = useState<string>(searchParams.get("id") || "");
  const [title, setTitle] = useState<string>(searchParams.get("title") || "");
  const [description, setDescription] = useState<string>(
    searchParams.get("description") || ""
  );
  const [contactInfos, setContactInfos] = useState<string>(
    searchParams.get("contactInfos") || ""
  );
  const [imageUrl, setImageUrl] = useState<string[]>(
    searchParams.get("images")?.split(",") || []
  );
  const [createdAt, setCreatedAt] = useState<string>(
    searchParams.get("createdAt") || ""
  );
  const [location, setLocation] = useState<string>(
    searchParams.get("location") || ""
  );
  const [status, setStatus] = useState<string>(
    searchParams.get("status") || ""
  );
  const [likes, setLikes] = useState<number>(
    parseInt(searchParams.get("likes") || "0")
  );

  const handleLike = () => {
    setLikes(likes + 1);
  };

  const renderItem = ({ item, index }: { item: string; index: number }) => {
    return (
      <Image key={index} source={{ uri: item }} style={styles.carouselImage} />
    );
  };

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
          <Text style={styles.headerText}>Detalhes</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.imageCountContainer}>
          <Text style={styles.imageCountText}>{imageUrl.length}</Text>
          <Ionicons name="image" size={20} color="white" />
        </View>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={true}
          style={styles.carouselDetailsContainer}
        >
          {imageUrl.map((url, index) => (
            <Image
              key={index}
              source={{ uri: url }}
              style={styles.carouselImage}
            />
          ))}
        </ScrollView>
        <View style={styles.detailsContainer}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              flexWrap: "wrap",
            }}
          >
            <View style={{ flexWrap: "wrap", width: "50%", flex: 1 }}>
              <Text style={styles.status}>{status}</Text>
              <Text style={styles.description}>
                {description}
              </Text>
            </View>
            <View style={styles.metaContainer}>
              <Text style={styles.date}>
                {new Date(createdAt).toLocaleDateString()}
              </Text>
              <Text style={styles.location}> {location}</Text>
            </View>
          </View>

          {contactInfos && (
            <View style={styles.contactContainer}>
              <Text style={styles.contactTitle}>Contato:</Text>
              <Text style={styles.contact}>{contactInfos}</Text>
            </View>
          )}

          <TouchableOpacity style={styles.likeButton} onPress={handleLike}>
            <Ionicons name={"heart"} size={24} color={"red"} />
            <Text style={styles.likes}>{likes} Likes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    margin: 15,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    marginLeft: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  headerText: {
    fontSize: 24,
    fontFamily: "SanFransciscoBold",
  },
  detailsContainer: {
    padding: 16,
    // backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  metaContainer: {
    marginBottom: 12,
    textAlign: "left",
  },
  date: {
    fontSize: 14,
    color: "#888",
  },
  imageCountContainer: {
    position: "absolute",
    top: 30,
    right: 30,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1,
  },
  imageCountText: {
    color: "#fff",
    fontWeight: "bold",
    marginRight: 5,
  },
  location: {
    fontSize: 16,
    color: "#444",
    textAlign: "right",
  },
  description: {
    width: "100%",
    flexWrap: "wrap",
    fontSize: 16,
    fontFamily: "SanFransciscoMedium",
    color: "#555",
    marginBottom: 16,
    lineHeight: 22,
  },
  status: {
    fontSize: 16,
    fontFamily: "SanFransciscoBold",
    color: "#555",
    lineHeight: 22,
  },
  contactContainer: {
    marginBottom: 16,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 4,
  },
  contact: {
    fontSize: 16,
    color: "#555",
  },
  likeButton: {
    flexDirection: "row",
    gap: 5,
    marginTop: 16,
    marginBottom: 16,
  },
  likes: {
    fontSize: 18,
    color: "gray",
    fontWeight: "bold",
  },
  carouselDetailsContainer: {
    width: screenWidth - 50,
    borderRadius: 5,
  },
  carouselImage: {
    width: screenWidth - 30,
    height: "100%",
    borderRadius: 0,
  },
});

export default PostDetailsScreen;
