import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
  _id: string;
  content: string;
  sender: string;
  receiver: string;
  receiverType: 'User' | 'Group';
  messageType: 'text' | 'image' | 'video' | 'audio' | 'document';
  status: 'sent' | 'delivered' | 'read';
  createdAt: string;
}

interface ChatState {
  messages: Message[];
  activeChat: string | null;
  activeChatType: 'User' | 'Group' | null;
}

const initialState: ChatState = {
  messages: [],
  activeChat: null,
  activeChatType: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    setActiveChat: (
      state,
      action: PayloadAction<{ id: string; type: 'User' | 'Group' }>
    ) => {
      state.activeChat = action.payload.id;
      state.activeChatType = action.payload.type;
    },
  },
});

export const { setMessages, addMessage, setActiveChat } = chatSlice.actions;
export default chatSlice.reducer; 