import Colors from "@/constants/Colors";
import { BACKEND_URL } from "@/constants/urls";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from "react-native";
import GradesList from "./GradesList";
import Units from "./Units";

export type Grade = {
    _id: string;
    name: string;
}
export default function Grades(){
    const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
    const [grades, setGrades] = useState<Grade[]>([])
    const [gradeLoading, setGradeLoading] = useState(true);
    const [empty, setEmpty] = useState<boolean>(false) ;
    const [error, setError] = useState<string | null>(null)

    const   handleSelected = (gradeid: string) => {
        setSelectedGrade(gradeid);
    }

    const token = useAuthStore((state) => state.token);

    const fetchGrades = async () => {
        console.log("Fetching grades");
        try{
            setGradeLoading(true);
            const res = await fetch(`${BACKEND_URL}user/grades`, {
                method: "Get",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`, 
                },
            })
            const data = await res.json();
            console.log("Grades", data);
            if(!res.ok){
                console.log("Error getting grades", data);
                Alert.alert("Error", data.error || data?.errors?.join(",") || data.message ||  "Error getting grades");
                return;
            }
            if(data.grades.length === 0){
                setEmpty(true);
                setGrades([]);
                return;
            }
            setEmpty(false);
            setError(null);
            setGrades(data.grades);

        } catch(err){
            console.error("Error getting grades", err);
            Alert.alert("Error", "Error getting grades");
            setError("Error getting grades");
            setGrades([]);
            return;
        }
        finally{
            setGradeLoading(false);
        }
    }


    useEffect(() => {
        fetchGrades();
    }
    , [])

    if (gradeLoading) {
        return (
          <View style={styles.container}>
            <ActivityIndicator size="large" color={Colors.purple} />
          </View>
        )
      }
    return(
        <View style={{flex: 1}}>
            <Text style={{fontSize: 20, fontWeight: "bold"}}>Grades</Text>
            <View style={styles.container}>
            {error ? (
        <View>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable onPress={fetchGrades}>
            <Text style={styles.errorText}>Try again</Text>
          </Pressable>
        </View>
        
      ) : empty ? (
        <View style={styles.Empty}>
          <Text style={styles.emptyText}>No level of education Yet available.</Text>
          <Pressable onPress={fetchGrades}>
            <Text style={styles.emptyText}>Try again</Text>
          </Pressable>
        </View>
      ) : (
        <View style={{width: "100%"}}>
        <GradesList
          pressed={handleSelected}
          selected={selectedGrade}
          grades={grades || []}
          getgrades={fetchGrades}
          loading={gradeLoading}
        />
        <Units grade={grades.find(g => g._id === selectedGrade)?.name} token={token} id={selectedGrade} />
        </View>
      )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        gap: 10,
        marginTop: 16,
      },
      errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
      },
      emptyText: {
        fontSize: 16,
        textAlign: 'center',
      },
      Empty: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20,
      },
})