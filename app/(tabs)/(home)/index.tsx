import Colors from '@/constants/Colors';
import { useAuthStore } from '@/store/authStore';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View,  Animated, useAnimatedValue, Dimensions, Alert } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { BACKEND_URL } from '@/constants/urls';
import Grades from '@/components/index/Grades';
export default function TabOneScreen() {
  const user = useAuthStore((state) => state.user);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);

  if (!user) {
    return <Redirect href="/(auth)" />;
  }
  const fadeAnim = useAnimatedValue(0);
  const fromTop = useAnimatedValue(-100);

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  //fetch user data
  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}user/${user.id}`);
      if (!response.ok) {
        Alert.alert("Error",'Failed to fetch user data');
        return;
      }
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  const Top = () => {
    Animated.timing(fromTop, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    fadeIn();
    Top();
  }, []);

  return (
    <View style={styles.container}>
        <Animated.View
      style={[
        styles.headCard,
        { opacity: fadeAnim, transform: [{ translateY: fromTop }] },
      ]}
    >
      <View style={styles.greetView}>
      <Text style={styles.greetTxt}>Hello {user.username},</Text>
      <Text style={styles.greetTxt2}>Nice to See You</Text>
      </View>
      <View style={styles.pointview}>
         <View>
         <Text style={styles.pointtxt}>  <MaterialCommunityIcons name="progress-star" size={24} color={Colors.white} /> Current Points</Text>
         <Text style={[styles.pointtxt, {fontSize:26}]}>200 points</Text>
         </View>
         <View>
          <Text style={styles.pointtxt}><FontAwesome6 name="ranking-star" size={24} color={Colors.white} /> Your Rank </Text>
          <Text style={[styles.pointtxt, {fontSize:26}]}>20/40</Text>
      </View>
      </View>
      </Animated.View>
      <Grades />
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  headCard: {
    backgroundColor: Colors.purple,
    borderRadius: 20,
    padding: 20,
    width: Dimensions.get("screen").width * 0.9,
    height: Dimensions.get("screen").height * 0.3,
    marginTop: 20,
    flexDirection: "column",
    justifyContent: "space-around",
    elevation: 20,
    shadowColor: Colors.purple,
  },
  greetView: {
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  greetTxt: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.white,
  },
  greetTxt2: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.white,
  },
  pointtxt:{
    color: Colors.white,
    fontSize: 16,
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
  },
  pointview: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
  }
});
