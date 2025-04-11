import Colors from "@/constants/Colors";
import { BACKEND_URL } from "@/constants/urls";
import { useAuthStore } from "@/store/authStore";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Button, Modal, Pressable, StyleSheet, Text, Touchable, TouchableOpacity, View } from "react-native";
type ModalProps = {topicid: string, topicname: string | undefined, visible: boolean, handleClose: () => void}


export default function GenQuizModal({topicid, topicname, visible, handleClose}:ModalProps) {
    const [noofoptions, setNoOfOptions] = useState<number>(3);
    const [noquiz, setNoQuiz] = useState<number>(5);
    const token = useAuthStore((state) => state.token);
    const [loading, setLoading] = useState<boolean>(false);

    const handlesubmit = async () => {
        if (!topicid) return;
        try {
            setLoading(true);
            const res = await fetch(`${BACKEND_URL}user/genquiz`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    noofoptions,
                    noquiz,
                    topicid,
                }),
            });
            const data = await res.json();
            console.log("Quiz data", data);
            if (!res.ok) {
                console.log("Error getting quiz", data);
                Alert.alert("Error", data.error || data?.errors?.join(",") || data.message || "Error getting quiz");
                return;
            }
            console.log("Quiz generated successfully", data);
            Alert.alert("Success", "Quiz generated successfully");
           
            router.push({
                pathname: `/(tabs)/(myquiz)/[quizid]`,
                params:{quizid: data.id, topicname}

            });
            handleClose();
        } catch (err) {
            console.error("Error getting quiz", err);
            Alert.alert("Error", "Error getting quiz");
        } finally {
            setLoading(false);
        }
    }
    return (
        <Modal
            animationType="slide"
            statusBarTranslucent={true}
            visible={visible}
            onRequestClose={() => {
                // Handle modal close
                handleClose();
            }}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Generate a {topicname} Quiz</Text>
                    <Text style={styles.modalDescription}>Select the number of questions and options</Text>
                  <View style={{flexDirection: "row", justifyContent: "space-between", width: "100%", gap: 10}}>
                  {[2,3,4].map((item) => (
                    
                    <Pressable key={item} onPress={() => setNoOfOptions(item)} style={{paddingVertical: 10, backgroundColor: noofoptions === item ? "purple" : "white", borderRadius: 5, borderWidth: StyleSheet.hairlineWidth,borderColor: Colors.purple, flex:1}}>
                        <Text style={{color: noofoptions === item ? "white" : "black", width:"100%", textAlign: "center"}}>{item} Options</Text>
                    </Pressable>
                ))}
                  </View>
                    <Text style={{marginVertical: 10}}>Number of Questions</Text>
                    <View style={{flexDirection: "row", justifyContent: "space-between", width: "100%", gap: 10}}>
                    {[4,5,6,7,8].map((item) => (
                        <Pressable key={item} onPress={() => setNoQuiz(item)} style={{padding: 10, backgroundColor: noquiz === item ? "purple" : "white",  borderRadius: 5, borderWidth: StyleSheet.hairlineWidth,borderColor: Colors.purple, flex:1, paddingVertical:5}}>
                            <Text style={{color: noquiz === item ? "white" : "black"}}>{item}</Text>
                        </Pressable>
                    ))}
                    </View>

                   <View style={{flexDirection: "row", justifyContent: "space-between", width: "100%", gap: 10, marginTop: 20}}>
                   <TouchableOpacity 
                    disabled={loading}
                    style={{backgroundColor: loading ? Colors.gray : Colors.purple, justifyContent: "center", alignItems: "center", flex: 1, borderRadius: 5, }}
                     onPress={handlesubmit} >
                        <Text style={{color: "white", padding: 10, textAlign: "center", flexDirection: "row", alignItems: "center"}}>{loading ? <Text><ActivityIndicator size={"small"} color={Colors.lightGray} />Generating...</Text> : "Generate Quiz"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                    disabled={loading}
                    style={{backgroundColor: Colors.danger, justifyContent: "center", alignItems: "center", flex: 1, borderRadius: 5}} 
                    onPress={handleClose}>
                        <Text style={{color: "white", padding: 10, textAlign: "center"}}>Cancel</Text>
                    </TouchableOpacity>
                     </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: "80%",
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
    },
    modalDescription: {
        marginVertical: 10,
        textAlign: "center",
    },
});