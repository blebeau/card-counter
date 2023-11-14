import { View, Text, TextInput, Pressable, Switch } from "react-native";
import React, { useState } from "react";
import socket from "../utils/socket";
import { styles } from "../utils/styles";

const Modal = ({ setVisible }: any) => {
  const closeModal = () => setVisible(false);
  const [groupName, setGroupName] = useState("");

  const handleCreateTable = () => {
    socket.emit("createTable", groupName);
    closeModal();
  };
  return (
    <View style={styles.modalContainer}>
      <Text style={styles.modalsubheading}>Enter your Table name</Text>
      <TextInput
        style={styles.modalinput}
        placeholder="Table name"
        onChangeText={(value) => setGroupName(value)}
      />
      <View style={styles.modalbuttonContainer}>
        <Pressable style={styles.modalbutton} onPress={handleCreateTable}>
          <Text style={styles.modaltext}>CREATE</Text>
        </Pressable>
        <Pressable
          style={[styles.modalbutton, { backgroundColor: "#E14D2A" }]}
          onPress={closeModal}
        >
          <Text style={styles.modaltext}>CANCEL</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Modal;
