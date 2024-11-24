import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  FlatList,
  RefreshControl,
  View,
  Text,
  ScrollView,
  TextInput,
} from "react-native";
import Header from "@/components/Header";
import Publication from "@/components/Publication";
import PublicationSkeleton from "@/components/skeletons/PublicationSkeleton";
import {
  fetchPublications,
  PublicationData,
  searchPublications,
} from "@/services/publicationService";

const ExploreScreen = () => {
  const [publications, setPublications] = useState<PublicationData[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [searchText, setSearchText] = useState("");

  const loadPublications = async (query = "") => {
    if (!query.trim()) {
      setPublications([]);
      return;
    }

    setLoading(true);
    try {
      const result = await searchPublications(query);
      setPublications(result);
      setSearchPerformed(true);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadPublications();
  }, []);

  const onSearch = () => {
    loadPublications(searchText);
  };

  const renderPublication = ({ item }: { item: PublicationData }) => (
    <Publication
      id={item.id}
      description={item.description}
      images={item.images}
      contactInfos={item.contactInfo}
      status={item.status}
      user={item.user}
      createdAt={item.createdAt}
      location={item.location}
      likes={item.likeCount}
    />
  );

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar publicações..."
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={onSearch} // Busca ao pressionar Enter
          returnKeyType="search"
        />
      </View>
      {loading ? (
        <PublicationSkeleton />
      ) : !searchPerformed ? (
        <View style={styles.initialState}>
          <Text style={styles.initialMessage}>
            Para começar, pesquise uma publicação.
          </Text>
        </View>
      ) : publications.length === 0 ? (
        <ScrollView contentContainerStyle={styles.emptyState}>
          <Text style={styles.emptyMessage}>Começe a pesquisar</Text>
        </ScrollView>
      ) : (
        <FlatList
          data={publications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPublication}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  searchContainer: {
    padding: 10,
    backgroundColor: "#fff",
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#f8f8f8",
  },
  initialState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  initialMessage: {
    fontSize: 18,
    color: "#555",
    textAlign: "center",
    marginHorizontal: 20,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyMessage: {
    marginTop: 15,
    fontSize: 16,
    color: "#888",
  },
  refreshText: {
    fontSize: 14,
    color: "#888",
    marginTop: 10,
  },
});

export default ExploreScreen;
