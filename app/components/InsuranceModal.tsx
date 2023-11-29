import { View, Text, TextInput, Pressable } from "react-native";
import React, { useState } from "react";
// import socket from "../utils/socket";
import { styles } from "../utils/styles";
import socket from "../utils/socket";
import { Player } from "../types/types";

type InsuranceModal = {
  setVisible: any;
  betAmount: number;
  player: Player;
};

const InsuranceModal = ({ setVisible, betAmount, player }: InsuranceModal) => {
  const closeModal = () => setVisible(false);
  const [insuranceAmount, setInsuranceAmount] = useState<number>(0);
  const [error, setError] = useState<boolean>(false);

  const chooseInsurance = (getInsurance: boolean) => {
    socket.emit("insurance", player, getInsurance);

    closeModal();
  };

  return (
    <View style={styles.modalContainer}>
      <Text style={styles.modalsubheading}>
        Would you like to get Insurance?
      </Text>
      <TextInput
        style={{
          backgroundColor: "lightgrey",
          borderColor: "black",
          width: 100,
          height: 25,
          borderWidth: 1,
        }}
        onChangeText={(text) => {
          const intValue = parseInt(text);

          if (intValue > betAmount) {
            setError(true);
          } else {
            setError(false);
          }

          setInsuranceAmount(intValue);
        }}
        value={insuranceAmount.toString()}
      />
      {error && (
        <Text style={{ color: "red" }}>
          The maximum value of your Insurance is your bet value. Please correct
          insurance amount.
        </Text>
      )}
      <View style={styles.modalbuttonContainer}>
        <Pressable
          style={styles.modalbutton}
          onPress={() => chooseInsurance(true)}
        >
          <Text style={styles.modaltext}>YES</Text>
        </Pressable>
        <Pressable
          style={styles.modalbutton}
          onPress={() => chooseInsurance(false)}
        >
          <Text style={styles.modaltext}>NO</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default InsuranceModal;
