import { createContext, useContext, useRef, useEffect } from "react";
import { useAppStore } from "@/store";
import { io } from "socket.io-client";

import { createChatSlice } from "@/store/slices/chat-slice";

import { HOST } from "@/utils/constants";

const SocketContext = createContext(null);
export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const { userInfo } = useAppStore();
  const socket = useRef();

  // useEffect(() => {
  //   if (userInfo) {
  //     socket.current = io(HOST, {
  //       withCredentials: true,
  //       query: { userId: userInfo.id },
  //     });

  //     socket.current.on("connect", () => {
  //       console.log("Connected to socket server");
  //     });
  //     return () => {
  //       socket.current.disconnect();
  //     };
  //   }
  // }, [userInfo]);

  useEffect(() => {
    console.log("Attempting socket connection, userId:", userInfo?.id);
    if (userInfo) {
      socket.current = io(HOST, {
        withCredentials: true,
        query: { userId: userInfo.id },
      });

      socket.current.on("connect", () => {
        console.log("Connected to socket server");
      });

      // Add error and connection handling
      socket.current.on("connect_error", (err) => {
        console.error("Socket connection error:", err);
      });

      socket.current.on("disconnect", () => {
        console.log("Disconnected from socket server");
      });

      const handleRecieveMessage = (message) => {
        const { selectedChatData, selectedChatType, addMessage } =
          useAppStore.getState();

        if (
          selectedChatType !== undefined &&
          (selectedChatData._id === message.sender._id ||
            selectedChatData._id === message.recipient.id)
        ) {
          console.log("message recieved", message);
          addMessage(message);
        }
      };

      socket.current.on("recieveMessage", handleRecieveMessage);
      return () => {
        socket.current.disconnect();
      };
    }
  }, [userInfo]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
