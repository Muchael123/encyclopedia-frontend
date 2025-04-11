import Colors from "@/constants/Colors";
import { BACKEND_URL } from "@/constants/urls";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
type QuizType = {
    _id: string;
    completed: boolean;
    topicid: {
        _id: string;
        name: string;
    };
    totalPoints: number;
}
export default function QuizesList(){
    const [quizes, setQuizes] = useState <QuizType[] | null>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const token = useAuthStore((state) => state.token);

    const fetchQuizzes = async () => {
        try {
            setLoading(true);
            console.log("Fetching quizzes...");
            const res = await fetch(`${BACKEND_URL}user/questions`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            })
            const data = await res.json();
            if(!res.ok){
                console.log("Error getting quizzes", data);
                setError(data.error || data?.errors?.join(",") || data.message ||  "Error getting quizzes");
                return;
            }
            console.log("Quizzes fetched successfully");
            setQuizes(data.quizes);
        }
        catch(err){
            console.error("Error getting quizzes", err);
            setError("Error getting quizzes");
        }
        finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchQuizzes();
    }
    ,[])

    if(loading){
        return(
            <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                <ActivityIndicator size="large" color={Colors.purple} />
                <Text>Loading...</Text>
            </View>
        )
    }
    if(error){
        return(
            <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                <Text>{error}</Text>
            </View>
        )
    }
    if(!quizes || quizes?.length === 0){
        return(
            <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                <Text>No quizzes found</Text>
            </View>
        )
    }
    return(
       <ScrollView style={styles.container}>
            {quizes?.map((quiz) => (
                <Pressable key={quiz._id} style={styles.quizCard} >
                    <Text style={{fontSize: 16, fontWeight: "bold"}}>{quiz.topicid.name}</Text>
                    <Text style={{fontSize: 14}}>Total Points: {quiz.totalPoints}</Text>
                    <Text style={{fontSize: 14}}>Completed: {quiz.completed ? "Yes" : "No"}</Text>
                </Pressable>
            ))}
       </ScrollView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
    },
    errorText: {
        color: "red",
        fontSize: 16,
        textAlign: "center",
    },
    quizCard: {padding: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: Colors.purple, marginBottom: 10, backgroundColor: "white"}
})