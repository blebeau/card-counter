import React, { useState, useLayoutEffect, useEffect } from "react";
import { View, Text, Pressable, SafeAreaView, FlatList } from "react-native";
import { Feather } from "@expo/vector-icons";
import Modal from "../components/Modal";
import ChatComponent from "../components/ChatComponent";
import socket from "../utils/socket";
import { styles } from "../utils/styles";
import TableComponent from "../components/TableComponent";

// screen with chats
const Chat = () => {
  const [visible, setVisible] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [tables, setTables] = useState([]);

  useLayoutEffect(() => {
    function fetchGroups() {
      fetch("http://10.0.2.2:4000/api/rooms")
        .then((res) => res.json())
        .then((data) => setTables(data))
        .catch((err) => console.error(err));
    }
    function fetchTables() {
      fetch("http://10.0.2.2:4000/api/tables")
        .then((res) => res.json())
        .then((data) => setTables(data))
        .catch((err) => console.error(err));
    }
    fetchGroups();
    fetchTables();
  }, []);

  useEffect(() => {
    socket.on("roomsList", (rooms: any) => {
      setRooms(rooms);
    });
  }, [socket]);

  useEffect(() => {
    socket.on("tableList", (tables: any) => {
      setTables(tables);
    });
  }, [socket]);

  const handleCreateGroup = () => setVisible(true);
  return (
    <SafeAreaView style={styles.chatscreen}>
      <View style={styles.chattopContainer}>
        <View style={styles.chatheader}>
          <Text style={styles.chatheading}>Chats</Text>
          <Pressable onPress={handleCreateGroup}>
            <Feather name="edit" size={24} color="green" />
          </Pressable>
        </View>
      </View>

      <View style={styles.chatlistContainer}>
        {/* <View style={{ height: "50%" }}>
          {rooms.length > 0 ? (
            <FlatList
              data={rooms}
              renderItem={({ item }) => <ChatComponent item={item} />}
              keyExtractor={(item: any) => item.id}
            />
          ) : (
            <View style={styles.chatemptyContainer}>
              <Text style={styles.chatemptyText}>No rooms created!</Text>
              <Text>Click the icon above to create a Chat room</Text>
            </View>
          )}
        </View> */}

        <View style={{ height: "50%" }}>
          <Text>Tables</Text>
          {tables.length > 0 ? (
            <FlatList
              data={tables}
              renderItem={({ item }) => <TableComponent item={item} />}
              keyExtractor={(item: any) => item.id}
            />
          ) : (
            <View style={styles.chatemptyContainer}>
              <Text style={styles.chatemptyText}>No tables created!</Text>
              <Text>Click the icon above to create a Table</Text>
            </View>
          )}
        </View>
      </View>
      {visible ? <Modal setVisible={setVisible} /> : ""}
    </SafeAreaView>
  );
};

export default Chat;
