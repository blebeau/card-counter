import { View, Text, TextInput, Pressable } from "react-native";
import React, { useState } from "react";
// import socket from "../utils/socket";
import { styles } from "../utils/styles";
// import socket from "../utils/socket";
import { Player, TableType } from "../types/types";

type InsuranceModal = {
  setVisible: any;
  betAmount: number;
  user: string;
  id: string;
  socket: any;
};

const InsuranceModal = ({
  setVisible,
  betAmount,
  user,
  id,
  socket,
}: InsuranceModal) => {
  const closeModal = () => setVisible(false);
  const [insuranceAmount, setInsuranceAmount] = useState<number>(0);
  const [error, setError] = useState<boolean>(false);

  const updateKeysWithInputHandler = (val: string) => {
    const keyInt = parseInt(val);
    if (keyInt > betAmount / 2) {
      setError(true);
    } else {
      setError(false);
    }

    setInsuranceAmount(keyInt);
  };

  const confirmInsurance = (user: string, amount: number, id: string) => {
    socket.emit("insurance", user, amount || 0, id);

    closeModal();
  };
  return (
    <View
      style={{
        width: "80%",
        borderTopColor: "#ddd",
        borderTopWidth: 1,
        elevation: 1,
        height: "80%",
        backgroundColor: "#fff",
        position: "absolute",
        bottom: 0,
        zIndex: 10,
        padding: 15,
        marginLeft: "10%",
        marginRight: "10%",
        marginBottom: "5%",
        justifyContent: "center",
      }}
    >
      <Text style={styles.modalsubheading}>Add Insurance</Text>
      <View style={{ padding: 10 }}>
        <Text>
          Insurance pays 2:1 if the dealer has blackjack. The maximum insurance
          amount is half of your current wager.
        </Text>
      </View>

      {error && (
        <Text style={{ color: "red" }}>
          The maximum value of your Insurance is your bet value. Please correct
          insurance amount.
        </Text>
      )}
      <View
        style={{
          marginTop: 10,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TextInput
          keyboardType="numeric"
          style={{
            backgroundColor: "lightgrey",
            borderColor: "black",
            width: 100,
            height: 25,
            borderWidth: 1,
            margin: 5,
            padding: 3,
          }}
          onChange={(event) =>
            updateKeysWithInputHandler(event.nativeEvent.text)
          }
        />
        <Pressable
          style={styles.modalbutton}
          onPress={() => confirmInsurance(user, insuranceAmount, id)}
        >
          <Text style={styles.modaltext}>Confirm Insurance</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default InsuranceModal;
