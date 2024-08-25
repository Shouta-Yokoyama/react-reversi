import { Room, Rooms, User } from "./types";

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

const rooms: Rooms = {};

function createRoom(roomName: string): void {
  if (!rooms[roomName]) {
    rooms[roomName] = { users: [], chats:[] };
  }
}

function addUserToRoom(roomName: string, user: User): void {
  if (rooms[roomName]) {
    rooms[roomName].users.push(user);
  }
}

function removeUserFromRoom(roomName: string, userId: string): void {
  if (rooms[roomName]) {
    rooms[roomName].users = rooms[roomName].users.filter(
      (user: User) => user.id !== userId
    );
    //ルームのユーザが0になったらルームを消す
    if(rooms[roomName].users.length === 0){
      delete rooms[roomName];
    }
  }
}

function getRoom(roomName: string): Room | null {
  return rooms[roomName] || null;
}

function getAllRoom(): string[] {
  return Object.keys(rooms);
}

export { addUserToRoom, createRoom, getAllRoom, getRoom, removeUserFromRoom };

