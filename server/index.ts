import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { findSettablePlace, setDisk } from "./Reversi";
import {
  addUserToRoom,
  createRoom,
  getAllRoom,
  getRoom,
  removeUserFromRoom,
} from "./rooms";
import { User } from "./types";
//import cors from "cors";
//const cors = require("cors");

const app = express();
const server = createServer(app);

// Socket.IOの設定とCORS許可
const io: Server = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // 許可するオリジン
    methods: ["GET", "POST"], // 許可するメソッド
  },
});

// Socket.IOの接続イベント
io.on("connection", (socket: Socket) => {
  console.log("A user connected", socket.id);

  //socket.ioのイベントリスナーはこのインデントに

  // ルームへの参加イベント
  socket.on("joinRoom", (data: { roomName: string; userName: string }) => {
    const { roomName, userName } = data;
    // ルームが存在しない場合は作成
    createRoom(roomName);

    // ルームにユーザーを追加
    const user: User = { id: socket.id, name: userName, isReady: false };
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

  //readyを押したときイベント
  socket.on("toggleReady", ({ roomName, userName }) => {
    const room = getRoom(roomName);
    if (room) {
      const user = room.users.find((user) => user.id == socket.id);
      if (user) {
        user.isReady = !user.isReady;
        io.to(roomName).emit("updateUsers", room.users);

        const allReady = room.users.every((user) => user.isReady);
        if (allReady && room.users.length !== 1) {
          //ゲーム開始の記述
          const firstTurnPlayer: string =
            room.users[Math.floor(Math.random() * 2)].name;
          const secondTurnPlayer: string = room.users.filter(
            (user) => user.name !== firstTurnPlayer
          )[0].name;
          room.boardState = {
            board: [
              [0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 1, -1, 0, 0, 0],
              [0, 0, 0, -1, 1, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0],
            ],
            firstTurnPlayer: firstTurnPlayer,
            secondTurnPlayer: secondTurnPlayer,
            currentTurnPlayer: firstTurnPlayer,
          };
          io.to(roomName).emit("startGame", room.boardState.firstTurnPlayer);
          console.log("room「" + roomName + "」is started game");
          //仮置きのゲームロジック、3秒後にendGameイベントを送信
          // setTimeout(()=>{
          //   room.users.forEach((elem) => elem.isReady = false);
          //   console.log(`Room ${roomName} users:`, room.users);
          //   io.to(roomName).emit("endGame", room.users);
          // }, 3000);
        }
      }
    }
  });

  //ボードクリックしたときイベント
  socket.on(
    "boardClick",
    (roomName: string, userName: string, posX: number, posY: number) => {
      //console.log(`getBoardClick! roomName:${roomName} userName:${userName} posX:${posX} posY:${posY}`);
      const room = getRoom(roomName);
      if (room && room.boardState) {
        //イベント主がcurrentTurnPlayerなら処理、そうでなければ一切処理しない
        if (userName === room.boardState.currentTurnPlayer) {
          let result: number[][] | undefined = undefined;
          //イベント主の駒の色を判別　先行なら黒
          let diskColor: number;
          let nextTurnPlayer: string;
          if (userName === room.boardState.firstTurnPlayer) {
            diskColor = 1;
            nextTurnPlayer = room.boardState.secondTurnPlayer;
          } else {
            diskColor = -1;
            nextTurnPlayer = room.boardState.firstTurnPlayer;
          }
          result = setDisk(diskColor, posX, posY, room.boardState.board);
          //console.log(`result ${result}`);
          //setDisk()のreturnで置けたか判断
          if (result !== undefined) {
            //ルームのボード情報を更新
            room.boardState.board = result;

            //勝敗判定
            let blackCount: number = 0;
            let whiteCount: number = 0;
            for (const row of room.boardState.board) {
              for (const num of row) {
                if (num === 1) {
                  blackCount++;
                }
                if (num === -1) {
                  whiteCount++;
                }
              }
            }

            //黒+白=>64 or (黒or白) == 0のときゲーム終了
            if (
              blackCount + whiteCount >= 64 ||
              blackCount === 0 ||
              whiteCount === 0
            ) {
              //isReadyを初期化してupdateUsersを配信
              room.users.map((user) => (user.isReady = false));
              io.to(roomName).emit("updateUsers", room.users);
              //endGameイベントに勝者の名前をつけて配信、メッセージも配信
              if (blackCount > whiteCount) {
                io.to(roomName).emit(
                  "endGame",
                  room.boardState.firstTurnPlayer
                );
                io.to(roomName).emit(
                  "getChat",
                  "System",
                  `黒${blackCount}枚 vs 白${whiteCount}枚で、${room.boardState.firstTurnPlayer}さんの勝利！`
                );
              } else if (blackCount < whiteCount) {
                io.to(roomName).emit(
                  "endGame",
                  room.boardState.secondTurnPlayer
                );
                io.to(roomName).emit(
                  "getChat",
                  "System",
                  `黒${blackCount}枚 vs 白${whiteCount}枚で、${room.boardState.secondTurnPlayer}さんの勝利！`
                );
              } else {
                io.to(roomName).emit(
                  "endGame",
                  room.boardState.secondTurnPlayer
                );
                io.to(roomName).emit(
                  "getChat",
                  "System",
                  `黒${blackCount}枚 vs 白${whiteCount}枚で、引き分け！`
                );
              }
            }

            if (room.boardState.board)
              if (
                findSettablePlace(diskColor * -1, room.boardState.board)
                  .length !== 0
              ) {
                //置ける場所があるなら置ける側を変える
                room.boardState.currentTurnPlayer = nextTurnPlayer;
              }

            io.to(roomName).emit("changeBoard", room.boardState);
          }
        }
      }
    }
  );

  //チャット送受信
  socket.on("sendChatText", ({ roomName, userName, chatText }) => {
    //roomにチャットのテキストを保存
    // ＊自分自身の情報が含まれるUser型の送信でうまく行かないので、保留
    //const room = getRoom(roomName);
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
