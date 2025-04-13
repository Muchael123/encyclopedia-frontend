import Colors from "@/constants/Colors";
import { BACKEND_URL } from "@/constants/urls";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, Touchable, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from "expo-router";

type QuizType = {
    _id: string;
    completed: boolean;
    topicid: {
        _id: string;
        name: string;
    };
    totalPoints: number;
    totalScore: number;
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
            console.log("Quizzes fetched successfully", data.quizes[1]);
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
                <Pressable onPress={()=> router.replace("/(tabs)/(home)")} style={{padding: 10, backgroundColor: Colors.purple, borderRadius: 5, marginTop: 10}}>
                    <Text style={{color: "white"}}>Create one Here</Text>
                </Pressable>
                <Text>Try refreshing</Text>
                <TouchableOpacity onPress={fetchQuizzes} style={{padding: 10, backgroundColor: Colors.purple, borderRadius: 5, marginTop: 10}}>
                    <Text style={{color: "white"}}>Refresh</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const handleAnswer = (quizid: string, topicname: string) => {
        console.log("Answer quiz", quizid);
        router.push({
            pathname: "/(tabs)/(myquiz)/[quizid]",
            params:{quizid, topicname}
        });
        
    }
    const checkmyAnswers = (quizid: string, topicname: string) => {
        console.log("Answer quiz", quizid);
        router.push({
            pathname: "/(tabs)/(myquiz)/myAnswers/[id]",
            params:{ id: quizid, topicname}
        });
        
    }
    return(
       <ScrollView style={styles.container}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            refreshControl={
                <RefreshControl refreshing={loading} onRefresh={fetchQuizzes} colors={[Colors.purple]} tintColor={Colors.purple} title="Refreshing..." titleColor={Colors.purple} progressBackgroundColor={Colors.white} progressViewOffset={100} />
            }
            contentContainerStyle={{paddingBottom: 100}}
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
        >
            {quizes?.map((quiz) => (
                <View key={quiz._id} style={styles.quizCard} >
                    <Text style={{fontSize: 16, fontWeight: "bold"}}>{quiz.topicid.name}</Text>
                    <Text style={{fontSize: 14}}> <MaterialCommunityIcons name="credit-card-edit" size={24} color="black" /> Total Points: {quiz.totalPoints}</Text>
                    <Text style={{fontSize: 14, color: quiz.completed? Colors.purple : Colors.danger}}>Completed: {quiz.completed ? "Yes" : "No"}</Text>
                    <Text style={{fontSize: 14}}> <MaterialCommunityIcons name="credit-card-edit" size={24} color="black" /> MyScore: {quiz.totalScore} / {quiz.totalPoints}</Text>
                    <Pressable onPress={()=> quiz.completed?checkmyAnswers(quiz._id, quiz.topicid.name) :handleAnswer(quiz._id, quiz.topicid.name) } style={{padding: 10, backgroundColor: quiz.completed ? Colors.purple : Colors.yellow, borderRadius: 5, marginTop: 10, alignItems: "center", justifyContent: "center"}}>
                        <Text style={{color: "white"}}>{quiz.completed ? "Check My Scores" : "Answer this Test"}</Text>
                    </Pressable>
                </View>
            ))}
       </ScrollView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 100,
    },
    errorText: {
        color: "red",
        fontSize: 16,
        textAlign: "center",
    },
    quizCard: {
        padding: 10,
         borderWidth: StyleSheet.hairlineWidth,
          borderColor: Colors.gray,
           marginBottom: 10,
            backgroundColor: "white",
            elevation: 6,
            borderRadius: 10,
            shadowColor: "black",
            gap: 5,
        }
})