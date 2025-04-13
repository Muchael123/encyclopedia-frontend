import Colors from "@/constants/Colors";
import { BACKEND_URL } from "@/constants/urls";
import { useAuthStore } from "@/store/authStore";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

// === Types ===
interface Question {
  _id: string;
  question: string;
  answer: string;
}

interface Answer {
  questionId: string;
  selected: string;
  isCorrect: boolean;
}

interface QuizData {
  questions: Question[];
  answers: Answer[];
  totalPoints: number;
}

export default function MyAnswers() {
  const navigation = useNavigation();
  const { id, topicname } = useLocalSearchParams();
  const token = useAuthStore((state) => state.token);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<QuizData | null>(null);
  const correctAnswersCount = data?.answers?.filter((a) => a.isCorrect).length ?? 0;

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
    setLoading(true);
    if (!id) {
      setLoading(false);
      router.back();
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}user/answers/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (!res.ok) {
        const message =
          result.error ||
          result?.errors?.join(", ") ||
          result.message ||
          "Error getting quiz answers";
        setError(message);
        Alert.alert("Error", message + "\nWant to reload?", [
          { text: "Cancel", style: "cancel" },
          { text: "Reload", onPress: () => fetchQuiz() },
        ]);
        return;
      }

      setData(result.quiz as QuizData);
      setError(null);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Error getting quiz answers");
      Alert.alert("Error", "Error getting quiz answers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.purple} />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      StickyHeaderComponent={() => (
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{topicname} Answers</Text>
        </View>
      )}
      contentContainerStyle={styles.contentContainer}
      style={styles.scrollContainer}
    >
      {/* Score Summary */}
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>
           You scored {correctAnswersCount} out of {data?.questions?.length ?? 0}
        </Text>
      </View>

      {/* Questions */}
      {data?.questions?.map((question, index) => {
        const answer = data.answers.find(
          (ans) => ans.questionId === question._id
        );
        const isCorrect = answer?.isCorrect;

        return (
          <View
            key={index}
            style={[
              styles.quizcard,
              {
                backgroundColor: isCorrect ? "#d4edda" : "#f8d7da",
                borderLeftColor: isCorrect ? "green" : "red",
              },
            ]}
          >
            <Text style={styles.questionIndex}>Question {index + 1}</Text>
            <Text style={styles.questionText}>{question.question}</Text>

            <Text style={styles.answerText}>
              Your Answer: <Text style={styles.boldText}>{answer?.selected}</Text>
            </Text>

            <Text style={styles.answerText}>
              Correct Answer: <Text style={styles.boldText}>{question.answer}</Text>
            </Text>

            <Text style={[styles.resultText, { color: isCorrect ? "green" : "red" }]}>
              {isCorrect ? "Correct ✅" : "Incorrect ❌"}
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 30,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    padding: 20,
    backgroundColor: Colors.purple,
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  scoreContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.purple,
    width: "100%",
    textAlign: "left",
  },
  quizcard: {
    padding: 20,
    marginVertical: 10,
    backgroundColor: Colors.white,
    borderRadius: 10,
    width: "90%",
    borderLeftWidth: 6,
  },
  questionIndex: {
    fontWeight: "bold",
    marginBottom: 8,
    fontSize: 16,
    color: "#333",
  },
  questionText: {
    fontSize: 16,
    marginBottom: 10,
    color: "#444",
  },
  answerText: {
    fontSize: 15,
    marginBottom: 4,
    color: "#333",
  },
  boldText: {
    fontWeight: "bold",
  },
  resultText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
  },
});
