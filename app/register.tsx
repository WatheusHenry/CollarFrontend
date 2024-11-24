import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { register } from "@/services/authService";
import { Ionicons } from "@expo/vector-icons";

const RegisterScreen: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const router = useRouter();

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets.length > 0) {
      setProfilePicture(result.assets[0].uri);
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Validation error", "All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Registration failed", "Passwords do not match.");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);

      if (profilePicture) {
        const fileName = profilePicture.split("/").pop() || "profile.jpg";
        formData.append("profilePicture", {
          uri: profilePicture,
          name: fileName,
          type: "image/jpeg",
        } as any); // Para corrigir tipos
      }

      await register(formData);
      Alert.alert("Success", "Registration successful. Please log in.");
      router.push("/login");
    } catch (error: any) {
      Alert.alert("Registration failed", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crie sua conta</Text>
      <TouchableOpacity onPress={handleImagePick} style={styles.imagePicker}>
        {profilePicture ? (
          <Image source={{ uri: profilePicture }} style={styles.profileImage} />
        ) : (
          <Ionicons name="images" size={24} color="#fff" />

        )}
      </TouchableOpacity>
        <Text style={styles.imagePickerText}>Selecionar foto de perfil</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        placeholderTextColor="#D94509"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#D94509"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#D94509"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar senha"
        placeholderTextColor="#D94509"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Criar conta</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={styles.link}>Já tem uma conta? Entre aqui!</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#FFF3E1",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#D94509",
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#D94509",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: "#FFF3E1",
    color: "#D94509",
  },
  inputFocused: {
    borderColor: "#FF6A2E",
    backgroundColor: "#FFCFBB",
  },
  button: {
    backgroundColor: "#E9622C",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonDisabled: {
    backgroundColor: "#E9622C",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    marginTop: 16,
    textAlign: "center",
    color: "#FF9900",
  },
  imagePicker: {
    height: 100,
    width: 100,
    borderRadius: 50,
    backgroundColor: "#D94509",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    alignSelf: "center",
  },
  imagePickerText: {
    color: "#D94509",
    textAlign: "center",
    marginBottom: 16,
  },
  profileImage: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
});

export default RegisterScreen;
