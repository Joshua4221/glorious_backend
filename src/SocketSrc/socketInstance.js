import http from "http";
import { Server } from "socket.io";
import { EmitServices } from "../serviceSrc/SocketServices/socketServices.js";

export function createSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    socket.on("connected", () => {
      console.log("connected to my system");

      // this is to connect to my system

      socket.emit("connected-user", "connected");
    });

    socket.on("connect-to-services", async () => {
      await EmitServices();
    });
  });
  // Add your socket event handlers here (explained later)

  return io;
}
