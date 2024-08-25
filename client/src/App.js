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
    // const [me, setMe] = useState<User>({id:"",name:"",isReady:isReady});
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
        socket_1.default.on("startGame", () => {
            setIsGameStarted(true);
        });
        socket_1.default.on("endGame", (userList) => {
            setIsGameStarted(false);
            setUsers(userList);
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
    const sendChatText = () => {
        if (chatText !== "") {
            socket_1.default.emit("sendChatText", { roomName, userName, chatText });
        }
    };
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("h1", null, "Chat Prototype"),
        !isJoined ? (react_1.default.createElement("div", null,
            "room name :",
            react_1.default.createElement("input", { type: "text", value: roomName, onChange: (e) => setRoomName(e.target.value), placeholder: "Enter room name" }),
            "your name :",
            react_1.default.createElement("input", { type: "text", value: userName, onChange: (e) => setUserName(e.target.value), placeholder: "Enter your name" }),
            react_1.default.createElement("button", { onClick: joinRoom }, "Join Room"))) : isGameStarted ? (react_1.default.createElement("div", null,
            react_1.default.createElement("h2", null, "Game is in progress..."))) : (react_1.default.createElement("div", null,
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
