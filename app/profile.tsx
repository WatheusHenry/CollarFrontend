import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchUserData } from "@/services/userService";
import LogoutButton from "@/components/LogoutButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

type UserProps = {
  id: number;
  name: string;
  email: string;
  profilePicture: string;
};

const ProfileScreen: React.FC = () => {
  const [userData, setUserData] = useState<UserProps | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        if (storedUserId) {
          setUserId(parseInt(storedUserId, 10));
        }
      } catch (error) {
        console.error("Error getting userId from AsyncStorage:", error);
      }
    };

    const fetchData = async () => {
      if (userId === null) {
        setIsLoading(false);
        return;
      }

      // Verifique se os dados já estão no cache (AsyncStorage)
      try {
        const cachedData = await AsyncStorage.getItem(`userData_${userId}`);
        if (cachedData) {
          // Se os dados estiverem no cache, use-os
          setUserData(JSON.parse(cachedData));
          setIsLoading(false);
        } else {
          // Caso contrário, faça a requisição
          const data: UserProps = await fetchUserData(userId);
          setUserData(data);

          // Armazene os dados no cache (AsyncStorage)
          await AsyncStorage.setItem(
            `userData_${userId}`,
            JSON.stringify(data)
          );
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setIsLoading(false);
      }
    };

    fetchUserId();
    fetchData();
  }, [userId]);

  const handleSettings = () => {
    Alert.alert("Configurações", "Tela de configurações.");
  };

  const backRoute = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={backRoute}>
        <AntDesign name="arrowleft" size={24} color="black" />
        <Text style={styles.perfil}>Perfil</Text>
      </TouchableOpacity>
      <SafeAreaView>
        <View style={styles.header}>
          <Image
            source={{
              uri: userData?.profilePicture || "https://via.placeholder.com/30",
            }}
            style={styles.profileImage}
          />
          <Text style={styles.name}>{userData?.name}</Text>
          <Text style={styles.email}>{userData?.email}</Text>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSettings}>
            <Ionicons name="heart" size={20} color="red" />
            <Text style={styles.buttonTextHeart}>Publicações curtidas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleSettings}>
            <Ionicons name="settings-outline" size={20} color="gray" />
            <Text style={styles.buttonText}>Configurações</Text>
          </TouchableOpacity>
          <LogoutButton />
        </View>
      </SafeAreaView>
    </View>
  );
};
const screenHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  perfil: { fontFamily: "SanFransciscoBold", fontSize: 24 },
  backButton: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    top: "5%",
    left: "5%",
  },
  container: {
    height: screenHeight,
    justifyContent: "center",
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
    backgroundColor: "white",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  name: {
    fontFamily: "SanFransciscoSemibold",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    width: "70%",
  },
  email: {
    marginTop: 10,
    fontSize: 16,
    color: "#696969",
  },
  buttonsContainer: {
    marginTop: 50,
    width: "100%",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    
    marginBottom: 20,
  },
  buttonText: {
    color: "gray",
    fontFamily: "SanFransciscoSemibold",
    fontSize: 18,
    marginLeft: 10,
  },
  buttonTextHeart: {
    color: "gray",
    fontFamily: "SanFransciscoSemibold",
    fontSize: 18,
    marginLeft: 10,
  },
  logoutButton: {
    backgroundColor: "#FF4500",
  },
});

export default ProfileScreen;
