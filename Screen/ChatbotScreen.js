import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import axios from "axios";
import CustomHeaderCalendar from "../components/customHeaderCalendar";

const ChatBotScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Xin chào! Tôi là chatbot. Hãy hỏi tôi bất kỳ điều gì.",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Trạng thái loading
  const scrollViewRef = useRef(null);

  // Xử lý khi gửi tin nhắn
  const handleSend = async () => {
    if (input.trim() === "") return;

    // Thêm tin nhắn của người dùng vào danh sách
    const userMessage = { id: Date.now(), text: input, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    setInput(""); // Xóa input sau khi gửi

    try {
      // Gửi tin nhắn của người dùng đến server
      await axios.post("http://192.168.1.71:3000/send-message", {
        prompt: input,
      });

      // Nhận phản hồi từ server
      const response = await axios.get("http://192.168.1.71:3000/get-response");
      const botReply = response.data.reply;

      // Thêm phản hồi của bot vào danh sách tin nhắn
      const botMessage = { id: Date.now() + 1, text: botReply, sender: "bot" };
      setMessages((prevMessages) => [...prevMessages, botMessage]);

      // Cuộn xuống cuối danh sách tin nhắn sau khi thêm tin nhắn mới
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error("Error while sending or receiving message:", error);
      // Thêm thông báo lỗi vào danh sách tin nhắn
      const errorMessage = {
        id: Date.now() + 2,
        text: "Xin lỗi, tôi không thể trả lời ngay bây giờ. Hãy thử lại sau.",
        sender: "bot",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <CustomHeaderCalendar
        title="Bảng công"
        statusAction={1}
        handleBack={() => navigation.goBack()}
      />
      <ScrollView
        style={styles.messagesContainer}
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageBubble,
              message.sender === "user"
                ? styles.userMessage
                : styles.botMessage,
            ]}
          >
            <Text
              style={
                message.sender === "user"
                  ? styles.messageTextUser
                  : styles.messageTextBot
              }
            >
              {message.text}
            </Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={input}
          onChangeText={setInput}
          placeholder="Nhập tin nhắn..."
        />
        <TouchableOpacity
          disabled={isLoading} // Không cho gửi khi đang loading
          style={styles.sendButton}
          onPress={handleSend}
        >
          <Text style={styles.sendButtonText}>
            {isLoading ? "Đang gửi..." : "Gửi"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  messagesContainer: {
    flex: 1,
    padding: 0,
  },
  messageBubble: {
    marginVertical: 10,
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 10,
    maxWidth: "80%",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#0078fe",
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  messageTextBot: {
    color: "black",
  },
  messageTextUser: {
    color: "white",
  },
  inputContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 25,
    paddingHorizontal: 15,
  },
  textInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#0078fe",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ChatBotScreen;
