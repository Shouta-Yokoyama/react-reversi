import React, { useEffect, useState } from "react";
import Grid from "./components/Grid";
import InputBox from "./components/InputBox";
import { BoardContext } from "./contexts/BoardContext";
import socket from "./socket";
import { SquareProps } from "./types";
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
  const [gameBoard, setGameBoard] = useState<number[][]>([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, -1, 0, 0, 0],
    [0, 0, 0, -1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const [firstTurnPlayer, setFirstTurnPlayer] = useState<string>("");
  const [myDisk, setMyDisk] = useState<number>();
  const [currentTurnPlayer, setCurrentTurnPlayer] = useState<string>();
  // const [me, setMe] = useState<User>({id:"",name:"",isReady:isReady});

  //接続のセットアップ関係
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

    //ゲームスタートイベント
    socket.on("startGame", (firstTurnPlayer: string) => {
      setIsGameStarted(true);
      setFirstTurnPlayer(firstTurnPlayer);
      setCurrentTurnPlayer(firstTurnPlayer);
      if (userName === firstTurnPlayer) {
        setMyDisk(1);
      } else {
        setMyDisk(-1);
      }
    });

    //ボード変更イベント ＊インターフェースを共通化すべき？
    socket.on(
      "changeBoard",
      (boardState: {
        board: number[][];
        firstTurnPlayer: string;
        secondTurnPlayer: string;
        currentTurnPlayer: string;
      }) => {
        setGameBoard(boardState.board);
        setCurrentTurnPlayer(boardState.currentTurnPlayer);
      }
    );
    //ゲーム終了イベント
    socket.on("endGame", (userName: string) => {
      setIsGameStarted(false);
      setIsReady(false);
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
  //////////
  //各種関数
  //////////

  //マスをクリックしたときの処理
  const handleSquareClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    buttonProps: SquareProps
  ) => {
    console.log("handleOnClick!", buttonProps);
    const posX = buttonProps.posX;
    const posY = buttonProps.posY;
    socket.emit("boardClick", roomName, userName, posX, posY);
  };

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

  //チャット送信処理
  const sendChatText = () => {
    if (chatText !== "") {
      socket.emit("sendChatText", { roomName, userName, chatText });
    }
  };

  return (
    <div className="bg-[#282c34] text-white">
      <h1 className="text-5xl p-6">Chat Prototype</h1>
      {!isJoined ? (
        <div className="flex">
            <label className="text-3xl px-4 py-2">
              room name :
              <InputBox
                state={roomName}
                setFn={setRoomName}
                placeholder={"Enter room name"}
              />
            </label>
            <label className="text-3xl px-4 py-2">
              user name :
              <InputBox
                state={userName}
                setFn={setUserName}
                placeholder={"Enter your name"}
              />
            </label>
          <button
            onClick={joinRoom}
            className="bg-gray-800 hover:bg-gray-700 text-white rounded px-4 py-2"
          >
            Join Room
          </button>
        </div>
      ) : isGameStarted ? (
        <div>
          <h2>Game is in progress...</h2>
          <div>{currentTurnPlayer}さんのターン</div>
          <div>あなたの駒：{myDisk === 1 ? "黒" : "白"}</div>
          <BoardContext.Provider
            value={{ handleClick: handleSquareClick, boardState: gameBoard }}
          >
            <Grid />
          </BoardContext.Provider>
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
          <InputBox
            state={chatText}
            setFn={setChatText}
            placeholder={"Enter your chat"}
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
