import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";

export default function AnswerQuiz(){
    const navigation = useNavigation();
    const {quizid, topicname} = useLocalSearchParams();
    console.log("quizid", quizid);
    console.log("topicname", topicname);
    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            title: `${topicname} Quiz`,
            headerTitleStyle: {
                fontSize: 20,
                fontWeight: "bold",
            },
            
        });
    }
    , []);
    return(
       <View>
            <Text>Answer Quiz</Text>
            <Text>Answer Quiz</Text>
       </View>
    )
}