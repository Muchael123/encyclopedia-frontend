import { Pressable, StyleSheet, Text, View,Animated, FlatList, RefreshControl } from "react-native";
import { Grade } from "./Grades";
import Colors from "@/constants/Colors";
import { useEffect, useRef, useState } from "react";

interface GradeProps {
    pressed: (gradeid: string) => void; 
    selected: string | null;
    grades: Grade[];
    getgrades: () => void;
    loading: boolean;

}
export default function GradesList({pressed, selected, grades, getgrades, loading}: GradeProps) {
    const Appear = useRef(new Animated.Value(0)).current; 
  const MyscrollViewRef = useRef<FlatList>(null);

  const fadeIn = () => {
    Animated.timing(Appear, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const handleScroll = (index: number) => {
    MyscrollViewRef.current?.scrollToIndex({
      index: index < 1 ? 0 : index - 1,
      animated: true,
    });
  };
  useEffect(() => {
    fadeIn();
  }, []);



    return (
        <View style={styles.units}>
             <FlatList
        data={grades} 
        horizontal={true}
        ref={MyscrollViewRef}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={getgrades}
            tintColor={Colors.purple}
          />
        }
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <Pressable
            onPress={() => {
              pressed(item._id);
              handleScroll(index);
            }}
          >
            <Animated.View
              style={[
                styles.sub,
                {
                  opacity: Appear,
                  transform: [
                    {
                      translateX: Appear.interpolate({
                        inputRange: [0, 1],
                        outputRange: [index * 100, 0],
                      }),
                    },
                  ],
                },
                { backgroundColor: selected === item._id ? 'white' : Colors.purple },
              ]}
            >
              <Text
                style={[
                  styles.text,
                  { color: selected === item._id ? Colors.purple : 'white' },
                ]}
              >
                {item.name}
              </Text>
            </Animated.View>
          </Pressable>
        )}
        keyExtractor={(item) => item._id} 
        contentContainerStyle={{ padding: 4, gap: 20 }}
      />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexWrap: 'wrap',
        flexDirection: 'row',
      },
      text: {
        fontSize: 20,
        fontWeight: 'bold',
      },
      units: {
        marginTop: 20,
      },
      sub: {
        padding: 20,
        borderRadius: 28,
        borderWidth: 1,
        borderColor: Colors.purple,
      },
})