import { io, Socket } from 'socket.io-client';

// Socket.IOクライアントの初期化
const socket: Socket = io('http://localhost:3001'); // サーバーのURL

export default socket;
