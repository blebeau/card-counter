import { View, Text, Pressable } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { styles } from "../utils/styles";

const TableComponent = ({ item }: any) => {
  const navigation = useNavigation<any>();
  //   const [messages, setMessages] = useState<any>({});

  //   useLayoutEffect(() => {
  //     setMessages(item.messages[item.messages.length - 1]);
  //   }, []);

  const handleNavigation = () => {
    navigation.navigate("Table", {
      id: item.id,
      name: item.name,
    });
  };

  return (
    <Pressable style={styles.cchat} onPress={handleNavigation}>
      <Ionicons
        name="person-circle-outline"
        size={45}
        color="black"
        style={styles.cavatar}
      />

      <View style={styles.crightContainer}>
        <View>
          <Text style={styles.cusername}>{item.name}</Text>
        </View>
      </View>
    </Pressable>
  );
};

export default TableComponent;
