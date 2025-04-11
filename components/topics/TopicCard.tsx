import { TopicType } from "@/app/(tabs)/(home)/[subjectid]";
import Colors from "@/constants/Colors";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
type Props = {
    topic: TopicType;
    setTopicId: (topicid: string) => void;
}
export default function TopicCard({ topic, setTopicId }: Props){
    const [viewmore, setViewMore] = useState(false);
    console.log("TopicCard", topic);
    return (
         <View style={styles.container}>
            <Text style={{fontSize: 20, fontWeight: "bold", color: Colors.purple, letterSpacing: 4}}>{topic.name}</Text>
            <Text style={{fontSize: 14, color: Colors.gray}}>
                {viewmore ? topic.objectives : topic.objectives.slice(0, 50) + "..."}
            </Text>
            <Pressable onPress={() => setViewMore(!viewmore)}>
                <Text style={{fontSize: 14, color: Colors.purple, textDecorationLine: "underline", textDecorationStyle: "solid"}}>{viewmore ? "View Less" : "View More"}</Text>
            </Pressable>
            <View style={styles.actions}>
                <TouchableOpacity style={styles.actionbtn} onPress={() => {
  console.log("Clicked topic", topic._id); // Debug
  setTopicId(topic._id);
}} >
                    <Text style={{fontSize: 14, color: Colors.white}}>Test Myself</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionbtn, {backgroundColor: Colors.lightGray}]}>
                    <Text style={{fontSize: 14, color: Colors.white}}>Ask a Question</Text>
                </TouchableOpacity>
            </View>
         </View>
    )
} const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        elevation: 5,
        borderRadius: 10,
        width: "100%",
        gap: 2,
        padding: 10,
        marginBottom: 10,
    },
    actions:{flexDirection: "row", gap: 10, marginTop: 10, justifyContent: "space-between", alignItems: "center"},
    actionbtn: {
        paddingVertical: 10,
        backgroundColor: Colors.purple,
        borderRadius: 10,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 8,
    }
})