import { FlatList, Pressable, StyleSheet, Text, View,RefreshControl, Alert, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import Colors from '@/constants/Colors'
import { useRouter } from 'expo-router'
import { BACKEND_URL } from '@/constants/urls'

interface UnitsProps {
  id: string | null,
  token: string | null
  grade: string | undefined
}
export type Subject = {
  _id: string;
  name: string;
  description: string;
}
export default function Units({id, token, grade}: UnitsProps) {
  const [units, setUnits] = useState<Subject[] >()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()
  useEffect(() => {
    fetchData();
  }, [id])
  const fetchData = async () => {
    if (!id) return;
    try{
      setLoading(true);
      console.log("Fetching units...", id, token);
     const res = await fetch(`${BACKEND_URL}user/subjects/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      })
      const data = await res.json();
      console.log("Units", data.subjects);
      if(!res.ok){
        console.log("Error getting units", data);
        Alert.alert("Error", data.error || data?.errors?.join(",") || data.message ||  "Error getting units");
       
      }
      setUnits(data.subjects);

    } catch(err){
      console.error("Error getting units", err);
      Alert.alert("Error", "Error getting units");
      setError("Error getting units");
     
    }
    finally{
      setLoading(false);
    }
  };
  if(loading) {
    return (
      <View>
        <ActivityIndicator size="large" color={Colors.purple} />
        <Text style={styles.text}>Loading...</Text>
      </View>
    )
  }else{
    console.log("Units...", units);
  }
  return (
        <FlatList
          data={units}
          keyExtractor={(item) => item._id}
          numColumns={2}
          columnWrapperStyle={{justifyContent: 'space-between'}}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={fetchData}
              tintColor={Colors.purple}
            />
          }
          contentContainerStyle={styles.container}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                router.push({pathname:`/(tabs)/(home)/[subjectid]`,
                  params: {subjectid: item._id, gradeid: id, name: item.name, grade: grade},
                } )
              }}
              style={styles.unit}
            >
                <Text style={styles.text}>{item.name}</Text>
            </Pressable>
          )}
        />
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop:16,
    gap: 16,
    paddingBottom: 150,
    paddingHorizontal: 16,
  },
  text: {
    textAlign: 'center',
    color: Colors.white,
    fontSize: 12,
  },
  unit: {
    padding: 24,
    flex: 1,
    maxWidth: '48%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    flexDirection: 'row',
    backgroundColor: Colors.lightGray,
    borderWidth: 1,
  }
 
  
})