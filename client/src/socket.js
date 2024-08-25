"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = require("socket.io-client");
// Socket.IOクライアントの初期化
const socket = (0, socket_io_client_1.io)('http://localhost:3001'); // サーバーのURL
exports.default = socket;
