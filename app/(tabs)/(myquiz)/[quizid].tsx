import QuizContainer from "@/components/quiz/QuizContainer";
import Colors from "@/constants/Colors";
import { genQuizType, QuizScore } from "@/constants/types";
import { BACKEND_URL } from "@/constants/urls";
import { useAuthStore } from "@/store/authStore";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, BackHandler, FlatList, Pressable, Text, View } from "react-native";

export default function AnswerQuiz() {
    const navigation = useNavigation();
    const { quizid, topicname } = useLocalSearchParams();
    const token = useAuthStore((state) => state.token);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<genQuizType | null>(null);
    const Flatref = useRef<FlatList>(null);
    const [score, setScore] = useState<QuizScore []>();


    const addQuizScore = (questionId: string, selected: string) => {
        const existingQuiz = score?.find((q) => q.questionId === questionId);
        if (existingQuiz) {
            setScore((prev) => prev?.map((q) => (q.questionId === questionId ? { ...q, selected} : q)));
        }
        else {
            setScore((prev) => [...(prev || []), { questionId, selected }]);
        }
    }
    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            title: `${topicname} Quiz`,
            headerTitleStyle: {
                fontSize: 20,
                fontWeight: "bold",
            },
        });
    }, []);

    const fetchQuiz = async () => {
        console.log("Fetching the quiz...", quizid);
        setLoading(true);
        try {
            const res = await fetch(`${BACKEND_URL}user/quiz/${quizid}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            const result = await res.json();

            if (!res.ok) {
                console.log("Error getting topics", result);
                const message = result.error || result?.errors?.join(",") || result.message || "Error getting topics";
                setError(message);
                Alert.alert("Error", message);
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

    useEffect(() => {
        const backAction = () => {
            Alert.alert("Hold on!", "Are you sure you want to go back? You will lose All your quiz information", [
                
                { text: "YES", onPress: () => router.back() },
                {
                    text: "No, cancel",
                    onPress: () => null,
                    style: "cancel",
                },
            ]);
            return true;
        };

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
        return () => backHandler.remove();
    }, []);

    const scrollToindex = (index: number) => {
        if (!data?.questions || index > data.questions.length - 1 || index < 0) {
            Alert.alert("Index out of bounds", "You have reached the end of the quiz");
            return;
        }
        Flatref.current?.scrollToIndex({ index, animated: true });
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size={52} color={Colors.purple} />
                <Text>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>{error}</Text>
                <Pressable onPress={fetchQuiz}>
                    <Text style={{ color: "blue", marginTop: 10, textDecorationColor: Colors.purple, textDecorationStyle: "double" }}>Retry</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <FlatList
            data={data?.questions}
            horizontal
            ref={Flatref}
            keyExtractor={(item, index) => `${item.question}-${index}`}
            renderItem={({ item, index }) => (
                <QuizContainer
                    quizlength={data?.questions?.length ?? 0}
                    scrollTo={scrollToindex}
                    quiz={item}
                    index={index}
                    score={score}
                    id={data?._id}
                    topicName={data?.topicid.name}
                    addQuizScore={addQuizScore}
                />
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10 }}
            style={{ flex: 1, height: "100%" }}
            pagingEnabled
            snapToAlignment="center"
            scrollEnabled={false}
            ListEmptyComponent={() => (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text>No questions found</Text>
                </View>
            )}
            ListFooterComponent={() => (
                <View style={{ padding: 10 }}>
                    <Text style={{ fontSize: 20, fontWeight: "bold" }}>Quiz Completed</Text>
                </View>
            )}
        />
    );
}
