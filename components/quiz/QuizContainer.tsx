import Colors from "@/constants/Colors";
import { QuestionType, QuizScore } from "@/constants/types";
import { useState } from "react";
import {
    Alert,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { BACKEND_URL } from "@/constants/urls";
import { useAuthStore } from "@/store/authStore";

type QuizContainerProps = {
  quiz: QuestionType;
  topicName: string | undefined;
  index: number;
  scrollTo: (index: number) => void;
  quizlength: number;
  addQuizScore: (
    questionId: string,
    selected: string,
  ) => void;
  score: QuizScore[] | undefined;
  id: string | undefined
};
export default function QuizContainer({
  quiz,
  index,
  scrollTo,
  quizlength,
  addQuizScore,
  score,
  id,
}: QuizContainerProps) {
  console.log("Quiz data", id);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const token = useAuthStore((state) => state.token);
  const handleNext = () => {
    if (selectedOption) {
      addQuizScore(
        quiz._id,
        selectedOption,
      );
    }
    if(index >= quizlength - 1) {
      handleSubmit();
    }
    else {
      scrollTo(index + 1);
    }
  };

  const handleSubmit = async () => {
    if(!score || score?.length < quizlength-1) {
      Alert.alert("Please answer all questions before submitting.");
      return;
    }
    if(!id){
        Alert.alert("Error", "Quiz ID is missing. Returning to home.");
        router.replace("/(tabs)/myquiz")
        return;
    }
    console.log("Submitting quiz scores", score);
    try{
        const res = await fetch(`${BACKEND_URL}user/answers/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                answers: score,
            }),
        });
        const result = await res.json();
        if (!res.ok) {
            console.log("Error submitting quiz scores", result);
            const message = result.error || result?.errors?.join(",") || result.message || "Error submitting quiz scores";
            Alert.alert("Error", message);
            return;
        }
        console.log("Quiz scores submitted successfully", result);
        Alert.alert("Success", "Quiz scores submitted successfully.");
        router.push("/(tabs)");
    } catch(err){
        console.log("Error submitting quiz scores", err);
        Alert.alert("Error", "Failed to submit quiz scores. Please try again.");
    }

  }
  return (
    <View style={styles.container}>
      <View
        style={{
          marginVertical: "8%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: quiz.level === "easy" ? Colors.gray : Colors.purple,
          }}
        >
          Level : {quiz.level}
        </Text>
        <Text style={styles.number}>#{index + 1}</Text>
      </View>
      <View style={styles.quizCon}>
        <Text style={styles.quizTxt}>{quiz.question}</Text>
        <View style={styles.optionCont}>
          {quiz.options.map((option, index) => (
            <Pressable
              key={index}
              style={[
                styles.option,
                {
                  backgroundColor:
                    selectedOption === option ? Colors.lightGray : Colors.white,
                },
              ]}
              onPress={() => setSelectedOption(option)}
            >
              <Text
                style={{
                  fontSize: 18,
                  color:
                    selectedOption === option ? Colors.white : Colors.purple,
                }}
              >
                {String.fromCharCode(65 + index)}. {option}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.btnsCon}>
          {index > 0 && (
            <TouchableOpacity
              style={styles.prevbtn}
              onPress={() => scrollTo(index - 1)}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>Previous</Text>
            </TouchableOpacity>
          )}
          {typeof selectedOption === "string" &&
            (index >= quizlength - 1 ? (
              <TouchableOpacity style={styles.btn} onPress={handleNext}>
                <Text
                  style={{
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  Finish
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.btn} onPress={handleNext}>
                <Text
                  style={{
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  Next
                </Text>
              </TouchableOpacity>
            ))}
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get("screen").width,
    height: "100%",
    paddingHorizontal: 10,
  },
  number: {
    fontSize: 34,
    fontWeight: "bold",
    color: Colors.purple,
    textAlign: "right",
  },
  quizTxt: {
    color: Colors.yellow,
    fontSize: 20,
    fontWeight: "semibold",
    letterSpacing: 1.5,
    width: "100%",
    textAlign: "left",
  },
  quizCon: {
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
  },
  optionCont: {
    flexDirection: "column",
    gap: "10%",
    width: "100%",
    marginTop: 20,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.purple,
    width: "100%",
    minHeight: 50,
    shadowColor: Colors.purple,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 6,
  },
  btnsCon: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 20,
    paddingHorizontal: 10,
    gap: 10,
  },
  btn: {
    backgroundColor: Colors.yellow,
    padding: 10,
    borderRadius: 10,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  prevbtn: {
    backgroundColor: Colors.gray,
    padding: 10,
    borderRadius: 10,
    width: "40%",
    justifyContent: "center",
    alignItems: "center",
  },
});
