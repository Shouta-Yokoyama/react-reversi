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
  boardState: BoardState | undefined;
}

export interface Rooms {
  [roomName: string]: Room;
}

export interface BoardState {
  board: number[][];
  firstTurnPlayer: string;
  secondTurnPlayer: string;
  currentTurnPlayer: string;
}
