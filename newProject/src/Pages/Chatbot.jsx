


import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Box, TextField, IconButton, Typography, Paper } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import "./Chatbot.css";

const API_URL = "https://5be8-27-107-27-130.ngrok-free.app/api/query"; // Your API endpoint

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  
  const handleSend = async () => {
    if (input.trim() === "") return;
  
    const userMessage = { text: input };
    setMessages([...messages, userMessage]);
    setInput("");
  
    try {
      const response = await axios.get(API_URL, { 
        params: { query: input }  // ✅ Correct way to send query params in GET request
      });
      console.log(response.data)
      const botMessage = { text: response.data.response, sender: "bot" }; 
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching bot response:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Sorry, I am having trouble responding.", sender: "bot" },
      ]);
    }
  };
  

  return (
    <Box
      className="chat-container"
      sx={{
        display: "flex",
        flexDirection: "column",
        maxHeight: "100vh",
        maxWidth: "100vw",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
      }}
    >
      <Paper
        elevation={5}
        className="chat-box"
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: "600px",
          height: "85vh",
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        {/* Header */}
        <Typography
          variant="h5"
          sx={{
            bgcolor: "primary.main",
            color: "white",
            padding: "16px",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Chatbot
        </Typography>

        {/* Messages */}
        <Box
          sx={{
            flex: 1,
            padding: "16px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            background: "#f9f9f9",
          }}
        >
          {messages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
              }}
            >
              <Paper
                sx={{
                  padding: "10px 15px",
                  bgcolor: msg.sender === "user" ? "#1976d2" : "#e0e0e0",
                  color: msg.sender === "user" ? "white" : "black",
                  borderRadius: "15px",
                  maxWidth: "70%",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Typography variant="body1">{msg.text}</Typography>
              </Paper>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>

        {/* Input Field */}
        <Box
          sx={{
            display: "flex",
            padding: "10px",
            borderTop: "1px solid #ccc",
            bgcolor: "white",
            boxShadow: "0px -2px 5px rgba(0, 0, 0, 0.1)",
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            sx={{
              borderRadius: "20px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
              },
            }}
          />
          <IconButton color="primary" onClick={handleSend} sx={{ marginLeft: "8px" }}>
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
};

export default Chatbot;
