import GenQuizModal from "@/components/topics/GenQuizModal";
import TopicCard from "@/components/topics/TopicCard";
import Colors from "@/constants/Colors";
import { BACKEND_URL } from "@/constants/urls";
import { useAuthStore } from "@/store/authStore";
import { useNavigation, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
export type TopicType = {
    _id: string;
    objectives: string
    name: string;
    gradeid: string;
}

export default function Topics(){
    const {subjectid, gradeid, name,grade} = useLocalSearchParams();
     const token = useAuthStore((state) => state.token);
     const [loading, setLoading] = useState(true);
     const [topics, setTopics] = useState<TopicType[] >();
     const [topicId, setTopicId] = useState<string | null>(null);
     const navigation = useNavigation()
        const [error, setError] = useState<string | null>(null);
    const fetchTopics = async () => {
        console.log("Fetching topics...", subjectid, gradeid);
        try{
            const res = await fetch(`${BACKEND_URL}user/topics/${subjectid}/${gradeid}`, {
                method: "Get",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`, 
                },
            })
            const data = await res.json();
            if(data?.Topics?.length === 0){
                setError("No topics found");
                return;
            }
            setError(null);
            if(!res.ok){
                console.log("Error getting topics", data);
                setError(data.error || data?.errors?.join(",") || data.message ||  "Error getting topics");
                Alert.alert("Error", data.error || data?.errors?.join(",") || data.message ||  "Error getting topics");
                return;
            }
            console.log("Topics fetched successfully", data.Topics);
            setTopics(data.Topics);
            setError(null);
        } catch(err){
            console.error("Error getting topics", err);
            setError("Error getting topics");
            
            Alert.alert("Error", "Error getting topics");
            
        }
        finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        navigation.setOptions({
            title: `${grade} ${name} topics`,
        })
    }, [grade, name])
    useEffect(() => {
        { subjectid && gradeid && fetchTopics()}
    }
    , [subjectid, gradeid])

    if(loading) {
        return (
          <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
            <ActivityIndicator size={40} color={Colors.purple} />
            <Text style={styles.text}>Loading...</Text>
          </View>
        )
    }
    if(error) {
        return (
          <View>
            <Text style={styles.text}>{error}</Text>
            <Pressable onPress={fetchTopics}>
                <Text style={{color: "blue"}}>Retry</Text>
            </Pressable>
          </View>
        )
    }
    return(
        <View style={styles.container}>
          <FlatList 
        data={topics}

        ListEmptyComponent={() => (
            <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
            <Text style={styles.emptyText}>No topics found</Text>
            </View>
        )}
        ListHeaderComponent={() => (
            <View style={{padding: 10}}>
            <Text style={styles.text}>Topics</Text>
            </View>
        )}
        numColumns={1}
        keyExtractor={(item, index) => `${item._id}-${index}`}
        alwaysBounceVertical={false}
         refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={fetchTopics}
                tintColor={Colors.purple}
              />
            }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 10, gap: 10 }}
        style={{ flex: 1, paddingBottom: 100 }}
        renderItem={({ item }) => (
           <TopicCard setTopicId={setTopicId} topic={item}  />
            
        )
        }
        />
        {topicId && <GenQuizModal topicid={topicId} topicname={topics?.find(t => t._id === topicId)?.name || ""} visible={typeof topicId === "string"} handleClose={()=> setTopicId(null)}  />} 
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
      },
      text: {
        fontSize: 20,
        fontWeight: "bold",
      },
      errorText: {
        color: "red",
        fontSize: 20,
      },
      emptyText: {
        color: "blue",
        fontSize: 20,
      },
})