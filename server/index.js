"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const rooms_1 = require("./rooms");
//import cors from "cors";
//const cors = require("cors");
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
// Socket.IOの設定とCORS許可
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:3000", // 許可するオリジン
        methods: ["GET", "POST"], // 許可するメソッド
    },
});
// Socket.IOの接続イベント
io.on("connection", (socket) => {
    console.log("A user connected", socket.id);
    // ルームへの参加イベント
    socket.on("joinRoom", (data) => {
        const { roomName, userName } = data;
        // ルームが存在しない場合は作成
        (0, rooms_1.createRoom)(roomName);
        // ルームにユーザーを追加
        const user = { id: socket.id, name: userName, isReady: false };
        (0, rooms_1.addUserToRoom)(roomName, user);
        // socket.io機能のroomにroomNameで登録　＊多重登録になってるかも？
        socket.join(roomName);
        console.log(`User ${userName} (ID: ${socket.id}) joined room: ${roomName}`);
        const allRoom = (0, rooms_1.getAllRoom)();
        console.log(`all Room: ${allRoom}`);
        // ルーム内のユーザーリストを更新
        const room = (0, rooms_1.getRoom)(roomName);
        // ルーム内のユーザーリストを送信
        if (room) {
            console.log(`Room ${roomName} users:`, room.users);
            io.to(roomName).emit("updateUsers", room.users);
        }
    });
    // ルームから退出
    socket.on("leaveRoom", (roomName) => {
        (0, rooms_1.removeUserFromRoom)(roomName, socket.id);
        socket.leave(roomName);
        console.log(`User ${socket.id} left room: ${roomName}`);
        // ルーム内のユーザーリストを更新
        const allRoom = (0, rooms_1.getAllRoom)();
        console.log(`all Room: ${allRoom}`);
        const room = (0, rooms_1.getRoom)(roomName);
        if (room) {
            io.to(roomName).emit("updateUsers", room.users);
        }
    });
    socket.on("toggleReady", ({ roomName, userName }) => {
        const room = (0, rooms_1.getRoom)(roomName);
        if (room) {
            const user = room.users.find(user => user.id == socket.id);
            if (user) {
                user.isReady = !user.isReady;
                io.to(roomName).emit("updateUsers", room.users);
                const allReady = room.users.every(user => user.isReady);
                if (allReady) {
                    //ゲーム開始の記述
                    io.to(roomName).emit("startGame");
                    console.log("room「" + roomName + "」is started game");
                    //ゲームロジックをここに
                    setTimeout(() => {
                        room.users.forEach((elem) => elem.isReady = false);
                        console.log(`Room ${roomName} users:`, room.users);
                        io.to(roomName).emit("endGame", room.users);
                    }, 3000);
                }
            }
        }
    });
    //チャット送受信
    socket.on("sendChatText", ({ roomName, userName, chatText }) => {
        //roomにチャットのテキストを保存
        const room = (0, rooms_1.getRoom)(roomName);
        // ＊自分自身の情報が含まれるUser型の送信でうまく行かないので、保留
        // if(room){ 
        //   const data = {userName:user,chat:chatText};
        //   room.chats.push(data);
        // }
        //クライアントには差分だけ送る
        io.to(roomName).emit("getChat", userName, chatText);
    });
    // 接続解除イベント
    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id);
        // ルームからユーザーを削除
        for (const roomName in rooms_1.getRoom) {
            if ((0, rooms_1.getRoom)(roomName)) {
                (0, rooms_1.removeUserFromRoom)(roomName, socket.id);
            }
        }
    });
});
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
