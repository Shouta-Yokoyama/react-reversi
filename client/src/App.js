"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const Grid_1 = __importDefault(require("./components/Grid"));
const BoardContext_1 = require("./contexts/BoardContext");
const socket_1 = __importDefault(require("./socket"));
// チャット表示のreactのkey操作用の変数
let nextChatLogId = 0;
const App = () => {
    const [roomName, setRoomName] = (0, react_1.useState)("");
    const [isJoined, setIsJoined] = (0, react_1.useState)(false);
    const [users, setUsers] = (0, react_1.useState)([]);
    const [userName, setUserName] = (0, react_1.useState)("");
    const [isReady, setIsReady] = (0, react_1.useState)(false);
    const [isGameStarted, setIsGameStarted] = (0, react_1.useState)(false);
    const [chatText, setChatText] = (0, react_1.useState)("");
    const [chatLog, setChatLog] = (0, react_1.useState)([]);
    const [gameBoard, setGameBoard] = (0, react_1.useState)([
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, -1, 0, 0, 0],
        [0, 0, 0, -1, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
    ]);
    const [firstTurnPlayer, setFirstTurnPlayer] = (0, react_1.useState)("");
    const [myDisk, setMyDisk] = (0, react_1.useState)();
    const [currentTurnPlayer, setCurrentTurnPlayer] = (0, react_1.useState)();
    // const [me, setMe] = useState<User>({id:"",name:"",isReady:isReady});
    //接続のセットアップ関係
    (0, react_1.useEffect)(() => {
        // 接続時のイベント処理
        socket_1.default.on("connect", () => {
            console.log("Connected to the server");
            // 管理用に自分自身の情報が入ったUser型を明示的にもつ
            // if(socket.id !== undefined){
            //   const id:string = socket.id;
            //   setMe({id: id, name: me.name, isReady: me.isReady});
            // }
        });
        // ルーム内のユーザーリストを更新
        socket_1.default.on("updateUsers", (userList) => {
            setUsers(userList);
        });
        // 切断時のイベント処理
        socket_1.default.on("disconnect", () => {
            console.log("Disconnected from the server");
        });
        //ゲームスタートイベント
        socket_1.default.on("startGame", (firstTurnPlayer) => {
            setIsGameStarted(true);
            setFirstTurnPlayer(firstTurnPlayer);
            setCurrentTurnPlayer(firstTurnPlayer);
            if (userName === firstTurnPlayer) {
                setMyDisk(1);
            }
            else {
                setMyDisk(-1);
            }
        });
        //ボード変更イベント ＊インターフェースを共通化すべき？
        socket_1.default.on("changeBoard", (boardState) => {
            setGameBoard(boardState.board);
            setCurrentTurnPlayer(boardState.currentTurnPlayer);
        });
        //ゲーム終了イベント
        socket_1.default.on("endGame", (userName) => {
            setIsGameStarted(false);
            setIsReady(false);
        });
        //イベント名に一考の余地あり
        socket_1.default.on("getChat", (userName, chatText) => {
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
            socket_1.default.off("connect");
            socket_1.default.off("updateUsers");
            socket_1.default.off("disconnect");
            socket_1.default.off("startGame");
            socket_1.default.off("endGame");
            socket_1.default.off("getChat");
        };
    });
    //////////
    //各種関数
    //////////
    //マスをクリックしたときの処理
    const handleSquareClick = (event, buttonProps) => {
        console.log("handleOnClick!", buttonProps);
        const posX = buttonProps.posX;
        const posY = buttonProps.posY;
        socket_1.default.emit("boardClick", roomName, userName, posX, posY);
    };
    // ルームに参加する処理
    const joinRoom = () => {
        if (roomName && userName) {
            socket_1.default.emit("joinRoom", { roomName, userName }); // サーバーにルーム参加を通知
            setIsJoined(true);
            // // 参加したタイミングで名前が決まるので、meを更新
            // setMe({id: me.id, name: userName, isReady: me.isReady});
        }
    };
    // ルームから退出する処理
    const leaveRoom = () => {
        if (isJoined) {
            socket_1.default.emit("leaveRoom", roomName); // サーバーにルーム退出を通知
            setIsJoined(false);
            setUsers([]); // ユーザーリストをクリア
        }
    };
    // readyが押されたときの処理
    const toggleReady = () => {
        setIsReady((prev) => !prev);
        socket_1.default.emit("toggleReady", { roomName, userName });
    };
    //チャット送信処理
    const sendChatText = () => {
        if (chatText !== "") {
            socket_1.default.emit("sendChatText", { roomName, userName, chatText });
        }
    };
    return (react_1.default.createElement("div", { className: "bg-[#282c34] text-white" },
        react_1.default.createElement("h1", { className: "text-5xl" }, "Chat Prototype"),
        !isJoined ? (react_1.default.createElement("div", null,
            react_1.default.createElement("p", { className: "text-3xl px-4 py-2" },
                "room name :",
                react_1.default.createElement("input", { type: "text", value: roomName, onChange: (e) => setRoomName((n) => e.target.value), placeholder: "Enter room name" })),
            react_1.default.createElement("p", { className: "text-3xl px-4 py-2" },
                "room name :",
                react_1.default.createElement("input", { type: "text", value: userName, onChange: (e) => setUserName((n) => e.target.value), placeholder: "Enter your name" })),
            react_1.default.createElement("button", { onClick: joinRoom, className: "bg-gray-800 hover:bg-gray-700 text-white rounded px-4 py-2" }, "Join Room"))) : isGameStarted ? (react_1.default.createElement("div", null,
            react_1.default.createElement("h2", null, "Game is in progress..."),
            react_1.default.createElement("div", null,
                currentTurnPlayer,
                "\u3055\u3093\u306E\u30BF\u30FC\u30F3"),
            react_1.default.createElement("div", null,
                "\u3042\u306A\u305F\u306E\u99D2\uFF1A",
                myDisk === 1 ? "黒" : "白"),
            react_1.default.createElement(BoardContext_1.BoardContext.Provider, { value: { handleClick: handleSquareClick, boardState: gameBoard } },
                react_1.default.createElement(Grid_1.default, null)))) : (react_1.default.createElement("div", null,
            react_1.default.createElement("p", null,
                "Joined room: ",
                roomName),
            react_1.default.createElement("button", { onClick: leaveRoom }, "Leave Room"),
            " ",
            react_1.default.createElement("h2", null, "Users in Room:"),
            react_1.default.createElement("ul", null, users.map((user) => (react_1.default.createElement("li", { key: user.id },
                user.name,
                " ",
                user.isReady ? "(Ready)" : "(Not Ready)")))),
            react_1.default.createElement("h2", null, "Chat"),
            react_1.default.createElement("input", { type: "text", value: chatText, onChange: (e) => setChatText(e.target.value), placeholder: "Enter your chat" }),
            react_1.default.createElement("button", { onClick: sendChatText }, "send"),
            react_1.default.createElement("button", { onClick: toggleReady }, isReady ? "Cancel Ready" : "Ready"),
            react_1.default.createElement("ul", null, chatLog.map((log) => (react_1.default.createElement("li", { key: log.id },
                log.userName,
                " : ",
                log.chatText))))))));
};
exports.default = App;
