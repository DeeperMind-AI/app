export interface ChatUser {
    image?: string;
    name: string;
    message: string;
    time: string;
    color: string;
}

export interface ChatMessage {
    welcome?:boolean,
    align?: string;
    name?: string;
    message: string;
    time: string;
}
