"use client";
import React, { createContext, useEffect } from "react";
import { io, Socket } from "socket.io-client";

// Define the type of socket context
type SocketContextType = {
  socket: Socket;
};

// Create a typed context
export const SocketContext = createContext<SocketContextType | undefined>(
  undefined
);

// Initialize socket with environment variable
const socket = io(process.env.NEXT_PUBLIC_API_URL as string, {
  withCredentials: true,
  transports: ["websocket"], // Optional but more stable on Render
}); // Make sure VITE_BASE_URL is defined

// Define props type for the provider
type Props = {
  children: React.ReactNode;
};

const SocketProvider: React.FC<Props> = ({ children }) => {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });
  }, []);

  // const sendMessage=(eventName,message)=>{
  //   socket.emit(eventName,callback);
  // }

  // const receiveMessage=(eventName,callback)=>{
  //   socket.on(eventName, callback);
  // }

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
