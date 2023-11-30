import { View, Text, TextInput, Pressable } from "react-native";
import React, { useState } from "react";
// import socket from "../utils/socket";
import { styles } from "../utils/styles";
import socket from "../utils/socket";
import { Player, TableType } from "../types/types";

type InsuranceModal = {
  setVisible: any;
  betAmount: number;
  user: string;
  id: string;
};

const InsuranceModal = ({
  setVisible,
  betAmount,
  user,
  id,
}: InsuranceModal) => {
  const closeModal = () => setVisible(false);
  const [insuranceAmount, setInsuranceAmount] = useState<number>(0);
  const [error, setError] = useState<boolean>(false);

  const chooseInsurance = () => {
    socket.emit("insurance", user, insuranceAmount, id);

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

          if (intValue > betAmount / 2) {
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
        <Pressable style={styles.modalbutton} onPress={() => chooseInsurance()}>
          <Text style={styles.modaltext}>YES</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default InsuranceModal;
