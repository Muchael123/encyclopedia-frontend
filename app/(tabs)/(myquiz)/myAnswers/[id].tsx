import Colors from "@/constants/Colors";
import { BACKEND_URL } from "@/constants/urls";
import { useAuthStore } from "@/store/authStore";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";

export default function MyAnswers() {
    const navigation = useNavigation();
  const { quizid, topicname } = useLocalSearchParams();
  const token = useAuthStore((state) => state.token);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any | null>(null);

  useEffect(() => {
    navigation.setOptions({
        headerShown: true,
        title: `${topicname} Answers`,
        headerTitleStyle: {
            fontSize: 20,
            fontWeight: "bold",
        },
    });
}, []);

  const fetchQuiz = async () => {
    console.log("Fetching quiz...", quizid);
    setLoading(true);
    if(!quizid){
        setLoading(false);
        router.back();
        return;
    }
    try {
      const res = await fetch(`${BACKEND_URL}user/quiz/${quizid}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (!res.ok) {
        console.log("Error getting topics", result);
        const message =
          result.error ||
          result?.errors?.join(",") ||
          result.message ||
          "Error getting topics";
        setError(message);
        Alert.alert("Error", message + "Want to reload?", [
          { text: "Cancel", style: "cancel" },
          { text: "Reload", onPress: () => fetchQuiz() },
        ]);
        return;
      }

      if (result?.Topics?.length === 0) {
        setError("No topics found");
        return;
      }

      console.log("Topics fetched successfully", result.quiz);
      setData(result.quiz);
      setError(null);
    } catch (err) {
      console.error("Error getting topics", err);
      setError("Error getting topics");
      Alert.alert("Error", "Error getting topics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, [quizid]);

  if(loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.purple} />
        <Text>Loading...</Text>
      </View>
    );
  }
    if (error) {
        return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>{error}</Text>
        </View>
        );
    }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>My Answers</Text>
    </View>
  );
}
