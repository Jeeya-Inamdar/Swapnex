import { Server } from "socket.io";
import http from "http";
import express from "express";
import Message from "../models/messageModel.js";
import Conversation from "../models/conversationModel.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

export const getRecipientSocketId = (recipientId) => {
  return userSocketMap[recipientId];
};

const userSocketMap = {}; // userId -> socketId

io.on("connection", (socket) => {
  console.log("user connected", socket.id);
  const userId = socket.handshake.query.userId;

  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
  }

  // Broadcast online users list
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  /* ---------- Typing indicators ---------- */
  socket.on("typing", ({ conversationId, userId: recipientId }) => {
    const recipientSocketId = userSocketMap[recipientId];
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("typing", { conversationId });
    }
  });

  socket.on("stopTyping", ({ conversationId, userId: recipientId }) => {
    const recipientSocketId = userSocketMap[recipientId];
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("stopTyping", { conversationId });
    }
  });

  /* ---------- Mark messages as seen ---------- */
  socket.on("markMessagesAsSeen", async ({ conversationId, userId: targetUserId }) => {
    try {
      await Message.updateMany(
        { conversationId, seen: false },
        { $set: { seen: true } }
      );
      await Conversation.updateOne(
        { _id: conversationId },
        { $set: { "lastMessage.seen": true } }
      );
      const targetSocketId = userSocketMap[targetUserId];
      if (targetSocketId) {
        io.to(targetSocketId).emit("messagesSeen", { conversationId });
      }
    } catch (error) {
      console.error("markMessagesAsSeen error:", error);
    }
  });

  /* ---------- Disconnect ---------- */
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, server, app };
