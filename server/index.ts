import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { addUserToRoom, createRoom, getAllRoom, getRoom, removeUserFromRoom } from './rooms';
//import cors from "cors";
//const cors = require("cors");

const app = express();
const server = createServer(app);

// Socket.IOの設定とCORS許可
const io:Server = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // 許可するオリジン
    methods: ["GET", "POST"], // 許可するメソッド
  },
});

// Socket.IOの接続イベント
io.on("connection", (socket: Socket) => {
  console.log("A user connected", socket.id);

  // ルームへの参加イベント
  socket.on("joinRoom", (data: { roomName:string, userName: string }) => {
    const { roomName, userName } = data;
    // ルームが存在しない場合は作成
    createRoom(roomName);

    // ルームにユーザーを追加
    const user = { id: socket.id, name: userName, isReady: false };
    addUserToRoom(roomName, user);

    // socket.io機能のroomにroomNameで登録　＊多重登録になってるかも？
    socket.join(roomName);
    
    console.log(`User ${userName} (ID: ${socket.id}) joined room: ${roomName}`);
    
    const allRoom = getAllRoom();
    console.log(`all Room: ${allRoom}`);

    // ルーム内のユーザーリストを更新
    const room = getRoom(roomName);

    // ルーム内のユーザーリストを送信
    if (room) {
      console.log(`Room ${roomName} users:`, room.users);
      io.to(roomName).emit("updateUsers", room.users);
    }
  });

  // ルームから退出
  socket.on("leaveRoom", (roomName: string) => {
    removeUserFromRoom(roomName, socket.id);
    socket.leave(roomName);

    console.log(`User ${socket.id} left room: ${roomName}`);

    // ルーム内のユーザーリストを更新
    const allRoom = getAllRoom();
    console.log(`all Room: ${allRoom}`);
    const room = getRoom(roomName);
    if (room) {
      io.to(roomName).emit("updateUsers", room.users);
    }
  });

  socket.on("toggleReady", ({ roomName, userName}) => {
    const room = getRoom(roomName);
    if (room){
      const user = room.users.find(user => user.id == socket.id);
      if(user){
        user.isReady = !user.isReady;
        io.to(roomName).emit("updateUsers", room.users);

        const allReady = room.users.every(user => user.isReady);
        if(allReady){
          //ゲーム開始の記述
          io.to(roomName).emit("startGame");
          console.log("room「"+roomName+"」is started game");
          //ゲームロジックをここに
          setTimeout(()=>{
            room.users.forEach((elem) => elem.isReady = false);
            console.log(`Room ${roomName} users:`, room.users);
            io.to(roomName).emit("endGame", room.users);
          }, 3000);
        } 
      }
    }
  });

  //チャット送受信
  socket.on("sendChatText", ({roomName, userName, chatText}) => {
    //roomにチャットのテキストを保存
    const room = getRoom(roomName);
    // ＊自分自身の情報が含まれるUser型の送信でうまく行かないので、保留
    // if(room){ 
    //   const data = {userName:user,chat:chatText};
    //   room.chats.push(data);
    // }

    //クライアントには差分だけ送る
    io.to(roomName).emit("getChat",userName,chatText);
  });

  // 接続解除イベント
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);

    // ルームからユーザーを削除
    for (const roomName in getRoom) {
      if (getRoom(roomName)) {
        removeUserFromRoom(roomName, socket.id);
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
