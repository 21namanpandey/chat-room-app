
export interface User {
    userId: string;
username: string;
token: string;
}

export interface Room {
_id: string;
name: string;
createdAt: string;
}

export interface Message {
_id: string;
roomId: string;
message: string;
username: string;
userId: string;
timestamp: string;
}

export interface OnlineUser {
username: string;
userId: string;
socketId?: string;
}