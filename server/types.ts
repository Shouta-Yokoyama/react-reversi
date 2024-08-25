export interface User {
  id: string;
  name: string;
  isReady: boolean;
}

export interface Chat {
  user: User;
  chat: string;
}

export interface Room {
  users: User[];
  chats: Chat[];
}

export interface Rooms {
  [roomName: string]: Room;
}
