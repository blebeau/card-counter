import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  TextInput,
} from "react-native";
import socket from "../utils/socket";
import { styles } from "../utils/styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { deckArray } from "../utils/deck";
import { Card, Player, SplitHand, TableType } from "../types/types";
import InsuranceModal from "../components/InsuranceModal";

const Table = ({ route, navigation }: any) => {
  const [user, setUser] = useState("");
  const { name, id } = route.params;

  const [table, setTable] = useState<TableType>();
  const [activePlayer, setActivePlayer] = useState<Player[]>([]);
  const [playing, setPlaying] = useState<boolean>(false);
  const [insurance, setInsurance] = useState<boolean>(false);
  const [split, setSplit] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);
  const [bet, setBet] = useState<number>(50);

  const getUsername = async () => {
    try {
      const value = await AsyncStorage.getItem("username");
      if (value !== null) {
        setUser(value);
      }
    } catch (e) {
      console.error("Error while loading username!");
    }
  };

  const hit = () => {
    if (user) {
      socket.emit("hit", {
        room_id: id,
        user: activePlayer[0].playerName,
      });
    }
  };

  const doubleDown = async () => {
    if (user) {
      await socket.emit("hit", {
        room_id: id,
        user,
      });

      stay(true);
    }
  };

  const stay = (doubleDown?: boolean) => {
    if (user) {
      socket.emit("stay", {
        room_id: id,
        user,
        doubleDown: doubleDown,
      });
    }
  };

  const startGame = async () => {
    setPlaying(true);
    const userData = table?.players.find(
      (player: Player) => player.playerName === user
    );
    if (userData) {
      setPlaying(true);
    } else
      socket.emit("startGame", {
        room_id: id,
        user,
        table: table,
      });
    socket.on("gameStarted", (tableData: TableType) => {
      const getActivePlayer = tableData.players.filter(
        (p: Player) => p.activePlayer
      );
      setActivePlayer(getActivePlayer);
      setTable(tableData);
    });
  };

  const reset = () => {
    socket.emit("reset", {
      room_id: id,
    });
  };

  const splitHand = () => {
    socket.emit("split", {
      tableId: id,
      user,
    });
  };

  const setBetValue = (value: string) => {
    const intValue = parseInt(value);

    setBet(intValue);
  };

  useLayoutEffect(() => {
    navigation.setOptions({ title: name });
    socket.emit("findTable", id);
    socket.on("foundTable", (tableData: TableType) => {
      setTable(tableData);
      setCount(tableData.count);
    });
  }, []);

  useEffect(() => {
    getUsername();
    socket.on("foundTable", (tableData: TableType) => {
      setTable(tableData);
      setActivePlayer(tableData.players.filter((p: Player) => p.activePlayer));
    });
    socket.on("dealerPlay", (dealer: Player[]) => {
      if (dealer[0].score < 17 && dealer[0].activePlayer) {
        socket.emit("dealerHit", {
          room_id: id,
        });
      } else {
        reset();
      }
    });
    socket.on("offerInsurance", () => {
      setInsurance(true);
    });
    socket.on("canSplit", () => {
      setSplit(true);
    });
  }, [socket]);
  return (
    <View style={inlineStyles.container}>
      <View style={inlineStyles.gameDetailContainer}>
        <View style={inlineStyles.gameDetail}>
          <Text>Count: {count}</Text>
          <View
            style={{
              flexDirection: "row",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <Text>Bet: </Text>
            <TextInput
              style={inlineStyles.textInput}
              onChangeText={(text) => {
                const intValue = parseInt(text);

                setBet(intValue);
              }}
              value={bet?.toString()}
            />
          </View>
        </View>

        <View style={inlineStyles.table}>
          {table?.players &&
            table?.players.length > 0 &&
            table?.players.map((player: Player, index: number) => {
              return (
                <View
                  style={
                    player.playerName === "dealer"
                      ? inlineStyles.dealer
                      : inlineStyles.activePlayer
                  }
                  key={`${player.playerName}-${index}`}
                >
                  <Text>{player.score}</Text>
                  <Text>{player.playerName}</Text>
                  {player.playerName !== "dealer" && (
                    <Text>Chips: {player.chips}</Text>
                  )}
                  <View style={inlineStyles.player}>
                    {player.playerName !== "dealer" &&
                    player.splitHands.length > 0
                      ? player.splitHands.map((hand: SplitHand) => {
                          return hand.hand.map((card: Card, index: number) => {
                            const cardFinder = deckArray.find(
                              (x) => x.card === card.card
                            );
                            return (
                              <View key={`${player.playerName} - ${index}`}>
                                <View key={card.card}>
                                  <Image
                                    source={cardFinder?.cardLink}
                                    style={inlineStyles.image}
                                  />
                                </View>
                              </View>
                            );
                          });
                        })
                      : player.hand.map((card: Card, index: number) => {
                          const cardFinder = deckArray.find(
                            (x) => x.card === card.card
                          );
                          if (
                            index === 0 &&
                            activePlayer.length > 0 &&
                            player.playerName === "dealer" &&
                            activePlayer[0].playerName !== "dealer"
                          ) {
                            return (
                              <View key="back-of-card">
                                <Image
                                  source={require("../utils/PNG-cards/backOfCard.png")}
                                  style={inlineStyles.image}
                                />
                              </View>
                            );
                          }
                          return (
                            <View key={card.card}>
                              <Image
                                source={cardFinder?.cardLink}
                                style={inlineStyles.image}
                              />
                            </View>
                          );
                        })}
                  </View>
                </View>
              );
            })}
        </View>
      </View>

      {!playing ? (
        <View style={[styles.playerOptionsConatainer]}>
          <Pressable style={inlineStyles.gameButtons} onPress={startGame}>
            <Text>Join Game</Text>
          </Pressable>
        </View>
      ) : (
        <View style={[styles.playerOptionsConatainer]}>
          <Pressable
            style={[inlineStyles.gameButtons, { backgroundColor: "#228B22" }]}
            onPress={hit}
          >
            <Text>Hit</Text>
          </Pressable>
          <Pressable
            style={[inlineStyles.gameButtons, { backgroundColor: "#6495ED" }]}
            onPress={() => stay()}
          >
            <Text>Stay</Text>
          </Pressable>
          <Pressable
            style={[inlineStyles.gameButtons, { backgroundColor: "#EEE8AA" }]}
            onPress={doubleDown}
          >
            <Text>Double Down</Text>
          </Pressable>
          <Pressable
            disabled={insurance}
            style={
              insurance
                ? [inlineStyles.gameButtons, { backgroundColor: "#FF6347" }]
                : inlineStyles.disabledGameButtons
            }
            onPress={doubleDown}
          >
            <Text>Insurance</Text>
          </Pressable>
          <Pressable
            disabled={!activePlayer[0]?.canSplit}
            style={
              activePlayer[0]?.canSplit
                ? [inlineStyles.gameButtons, { backgroundColor: "#DDA0DD" }]
                : inlineStyles.disabledGameButtons
            }
            onPress={splitHand}
          >
            <Text>Split</Text>
          </Pressable>
        </View>
      )}
      {insurance && (
        <InsuranceModal
          setVisible={setInsurance}
          betAmount={bet}
          user={user}
          id={id}
          socket={socket}
        />
      )}
    </View>
  );
};

export default Table;

const inlineStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  image: {
    width: 40,
    height: 60,
    margin: 5,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  activePlayer: {
    justifyContent: "center",
    alignItems: "center",
  },
  otherPlayers: {
    justifyContent: "center",
    alignItems: "center",
  },
  dealer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  player: {
    width: 80,
    height: 100,
    flexDirection: "row",
    justifyContent: "center",
  },
  table: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    flex: 4,
  },
  gameDetailContainer: {
    flexDirection: "row-reverse",
    width: "100%",
    height: "90%",
  },
  gameDetail: {
    flex: 1,
    width: "20%",
    height: "100%",
    justifyContent: "flex-start",
  },
  gameButtons: {
    width: "15%",
    backgroundColor: "green",
    borderRadius: 3,
    margin: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledGameButtons: {
    width: "15%",
    backgroundColor: "grey",
    opacity: 0.5,
    borderRadius: 3,
    margin: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    backgroundColor: "lightgrey",
    borderColor: "black",
    width: 100,
    height: 25,
    borderWidth: 1,
    padding: 5,
  },
});
