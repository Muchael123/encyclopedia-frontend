import { Stack } from "expo-router";

export default function HomeLayout(){

    return(
        <Stack  initialRouteName="index">
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="[subjectid]" options={{presentation: "modal"}} />
        </Stack>

    )
}