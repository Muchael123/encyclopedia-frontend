import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";

export default function Icon(props: {
    name: React.ComponentProps<typeof Ionicons>['name'];
    color: string;
    onPress?: () => void;
  }) {
    return (
        <Pressable>
            <Ionicons size={28}  {...props} />
        </Pressable>
    )
  }