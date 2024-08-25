import React, { useEffect, useState } from "react";
import socket from "./socket";

interface User {
  id: string;
  name: string;
  isReady: boolean;
}

interface ChatLog {
  id: number;
  userName: string;
  chatText: string;
}
// チャット表示のreactのkey操作用の変数
let nextChatLogId = 0;

const App: React.FC = () => {
  const [roomName, setRoomName] = useState<string>("");
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const [userName, setUserName] = useState<string>("");
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [chatText, setChatText] = useState<string>("");
  const [chatLog, setChatLog] = useState<ChatLog[]>([]);
  // const [me, setMe] = useState<User>({id:"",name:"",isReady:isReady});
  useEffect(() => {
    // 接続時のイベント処理
    socket.on("connect", () => {
      console.log("Connected to the server");
      // 管理用に自分自身の情報が入ったUser型を明示的にもつ
      // if(socket.id !== undefined){
      //   const id:string = socket.id;
      //   setMe({id: id, name: me.name, isReady: me.isReady});
      // }
    });

    // ルーム内のユーザーリストを更新
    socket.on("updateUsers", (userList: User[]) => {
      setUsers(userList);
    });

    // 切断時のイベント処理
    socket.on("disconnect", () => {
      console.log("Disconnected from the server");
    });

    socket.on("startGame", () => {
      setIsGameStarted(true);
    });

    socket.on("endGame", (userList: User[]) => {
      setIsGameStarted(false);
      setUsers(userList);
    });

    //イベント名に一考の余地あり
    socket.on("getChat", (userName: string, chatText: string) => {
      //const chat = {userName:userName,chatText:chatText};
      //console.log(chat);
      setChatLog([
        ...chatLog,
        { id: nextChatLogId++, userName: userName, chatText: chatText },
      ]);
      console.log(chatLog);
      setChatText("");
    });

    return () => {
      // イベントのクリーンアップ
      socket.off("connect");
      socket.off("updateUsers");
      socket.off("disconnect");
      socket.off("startGame");
      socket.off("endGame");
      socket.off("getChat");
    };
  });

  // ルームに参加する処理
  const joinRoom = () => {
    if (roomName && userName) {
      socket.emit("joinRoom", { roomName, userName }); // サーバーにルーム参加を通知
      setIsJoined(true);
      // // 参加したタイミングで名前が決まるので、meを更新
      // setMe({id: me.id, name: userName, isReady: me.isReady});
    }
  };

  // ルームから退出する処理
  const leaveRoom = () => {
    if (isJoined) {
      socket.emit("leaveRoom", roomName); // サーバーにルーム退出を通知
      setIsJoined(false);
      setUsers([]); // ユーザーリストをクリア
    }
  };

  // readyが押されたときの処理
  const toggleReady = () => {
    setIsReady((prev) => !prev);
    socket.emit("toggleReady", { roomName, userName });
  };

  const sendChatText = () => {
    if (chatText !== "") {
      socket.emit("sendChatText", { roomName, userName, chatText });
    }
  };

  return (
    <div>
      <h1>Chat Prototype</h1>
      {!isJoined ? (
        <div>
          room name :
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Enter room name"
          />
          your name :
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your name"
          />
          <button onClick={joinRoom}>Join Room</button>
        </div>
      ) : isGameStarted ? (
        <div>
          <h2>Game is in progress...</h2>
        </div>
      ) : (
        <div>
          <p>Joined room: {roomName}</p>
          <button onClick={leaveRoom}>Leave Room</button>{" "}
          <h2>Users in Room:</h2>
          <ul>
            {users.map((user) => (
              <li key={user.id}>
                {user.name} {user.isReady ? "(Ready)" : "(Not Ready)"}
              </li>
            ))}
          </ul>
          <h2>Chat</h2>
          <input
            type="text"
            value={chatText}
            onChange={(e) => setChatText(e.target.value)}
            placeholder="Enter your chat"
          />
          <button onClick={sendChatText}>send</button>
          <button onClick={toggleReady}>
            {isReady ? "Cancel Ready" : "Ready"}
          </button>
          <ul>
            {chatLog.map((log) => (
              <li key={log.id}>
                {log.userName} : {log.chatText}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
