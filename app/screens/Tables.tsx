import React, { useState, useLayoutEffect, useEffect } from "react";
import { View, Text, Pressable, SafeAreaView, FlatList } from "react-native";
import { Feather } from "@expo/vector-icons";
import Modal from "../components/Modal";
import socket from "../utils/socket";
import { styles } from "../utils/styles";
import TableComponent from "../components/TableComponent";
import { TableType } from "../types/types";

// screen with chats
const Tables = () => {
  const [visible, setVisible] = useState(false);
  const [tables, setTables] = useState<TableType[]>([]);

  useLayoutEffect(() => {
    function fetchTables() {
      fetch("http://10.0.2.2:4000/api/tables")
        .then((res) => res.json())
        .then((data) => setTables(data))
        .catch((err) => console.error(err));
    }
    fetchTables();
  }, []);

  useEffect(() => {
    socket.on("tableList", (tables: TableType[]) => {
      setTables(tables);
    });
  }, [socket]);

  const handleCreateGroup = () => setVisible(true);
  return (
    <SafeAreaView style={styles.chatscreen}>
      <View style={styles.chattopContainer}>
        <View style={styles.chatheader}>
          <Text style={styles.chatheading}>Tables</Text>
          <Pressable onPress={handleCreateGroup}>
            <Feather name="edit" size={24} color="green" />
          </Pressable>
        </View>
      </View>

      <View style={styles.chatlistContainer}>
        <View style={{ height: "50%" }}>
          {tables.length > 0 ? (
            <FlatList
              data={tables}
              renderItem={({ item }) => <TableComponent item={item} />}
              keyExtractor={(item: TableType) => item.id}
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

export default Tables;
