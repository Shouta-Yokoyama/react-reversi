"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUserFromRoom = exports.getRoom = exports.getAllRoom = exports.createRoom = exports.addUserToRoom = void 0;
// interface User {
//   id: string;
//   name: string;
//   isReady: boolean;
// }
// interface Room {
//   users: User[];
//   chats: Chat[];
// }
// // ルームの情報を保存
const rooms = {};
function createRoom(roomName) {
    if (!rooms[roomName]) {
        rooms[roomName] = { users: [], chats: [], boardState: undefined };
    }
}
exports.createRoom = createRoom;
function addUserToRoom(roomName, user) {
    if (rooms[roomName]) {
        rooms[roomName].users.push(user);
    }
}
exports.addUserToRoom = addUserToRoom;
function removeUserFromRoom(roomName, userId) {
    if (rooms[roomName]) {
        rooms[roomName].users = rooms[roomName].users.filter((user) => user.id !== userId);
        console.log(rooms[roomName].users);
        //ルームのユーザが0になったらルームを消す
        if (rooms[roomName].users.length === 0) {
            delete rooms[roomName];
            console.log(rooms);
        }
    }
}
exports.removeUserFromRoom = removeUserFromRoom;
function getRoom(roomName) {
    return rooms[roomName] || null;
}
exports.getRoom = getRoom;
function getAllRoom() {
    return Object.keys(rooms);
}
exports.getAllRoom = getAllRoom;
