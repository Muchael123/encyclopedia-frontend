import Colors from '@/constants/Colors';
import { useAuthStore } from '@/store/authStore';
import { StyleSheet,Text, TouchableOpacity, View } from 'react-native';

export default function TabTwoScreen() {
  const {logout} = useAuthStore((state) => state);
  const handlelogout = () => {
    logout();
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutbtn} onPress={handlelogout}>
        <Text style={styles.title}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    width: "100%",
    textAlign: "center",
    color: Colors.white
  },
  logoutbtn: {
    backgroundColor: Colors.purple,
    padding: 10,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
  },
});
