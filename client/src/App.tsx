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
    <div className="min-h-screen p-6 dark:bg-gray-900 dark:text-gray-100">
      <h1 className="text-5xl p-6 text-center font-bold">Chat Prototype</h1>
      {!isJoined ? (
        <div className="flex flex-col space-y-4">
            <label className="text-2xl">
              room name :
              <InputBox
                state={roomName}
                setFn={setRoomName}
                placeholder={"Enter room name"}
              />
            </label>
            <label className="text-2xl">
              user name :
              <InputBox
                state={userName}
                setFn={setUserName}
                placeholder={"Enter your name"}
              />
            </label>
          <button
            onClick={joinRoom}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold rounded px-4 py-2 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            Join Room
          </button>
        </div>
      ) : isGameStarted ? (
        <div>
          <h2 className="text-2xl mb-2">Game is in progress...</h2>
          <div>{currentTurnPlayer}さんのターン</div>
          <div>あなたの駒：{myDisk === 1 ? "黒" : "白"}</div>
          <BoardContext.Provider
            value={{ handleClick: handleSquareClick, boardState: gameBoard }}
          >
            <Grid />
          </BoardContext.Provider>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-lg">Joined room: {roomName}</p>
          <button onClick={leaveRoom} className="bg-red-500 text-white px-4 py-2 rounded">Leave Room</button>
          <h2 className="text-xl font-semibold">Users in Room:</h2>
          <ul className="space-y-2">
            {users.map((user) => (
              <li key={user.id} className="dark:bg-gray-800 p-2 rounded">
                {user.name} {user.isReady ? "(Ready)" : "(Not Ready)"}
              </li>
            ))}
          </ul>
          <h2 className="text-xl font-semibold">Chat</h2>
          <InputBox
            state={chatText}
            setFn={setChatText}
            placeholder={"Enter your chat"}
          />
          <button onClick={sendChatText} className="bg-green-500 text-white px-4 py-2 rounded">send</button>
          <button onClick={toggleReady} className="bg-yellow-500 text-white px-4 py-2 rounded">
            {isReady ? "Cancel Ready" : "Ready"}
          </button>
          <ul className="space-y-2 mt-4">
            {chatLog.map((log) => (
              <li key={log.id} className="dark:bg-gray-800 p-2 rounded">
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
