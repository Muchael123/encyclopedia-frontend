import { Stack } from "expo-router";

export default function MyQuizLayout(){

    return(
        <Stack  initialRouteName="quiz">
            <Stack.Screen name="quiz" options={{ headerTitle: "My Quizzes" }} />
            <Stack.Screen name="[quizid]" options={{presentation: "modal"}} />
        </Stack>

    )
}