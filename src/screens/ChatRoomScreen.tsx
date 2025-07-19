import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { getSocket } from '../utils/socket';
import { getRooms, createRoom as apiCreateRoom } from '../api/rooms';
import { getRoomMessages } from '../api/messages';
import { User, Room, Message, OnlineUser } from '../types';

import RoomList from '../components/RoomList';
import MessageInput from '../components/MessageInput';
import MessageList from '../components/MessageList';
import OnlineUsersList from '../components/OnlineUsersList';
import TypingIndicator from '../components/TypingIndicator';

interface ChatRoomScreenProps {
  user: User;
  onLogout: () => void;
}

const ChatRoomScreen: React.FC<ChatRoomScreenProps> = ({ user, onLogout }) => {
  const socket = useRef(getSocket()).current;

  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [showUsersList, setShowUsersList] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isRoomListVisible, setIsRoomListVisible] = useState(true);

  useEffect(() => {
    if (user && !socket.connected) {
      socket.connect(); 
    }

    socket.on('connect', () => {
      setConnectionStatus('connected');
      console.log('Socket Connected');
      if (currentRoom) {
        socket.emit('join-room', {
          roomId: currentRoom._id,
          username: user.username,
          userId: user.userId,
        });
      }
    });

    socket.on('disconnect', (reason) => {
      setConnectionStatus('disconnected');
      console.log('Socket Disconnected:', reason);
    });

    socket.on('connect_error', (err) => {
      setConnectionStatus('disconnected');
      console.error('Socket Connection Error:', err.message);
      Alert.alert("Connection Error", "Could not connect to the chat server. Please check your network or server status.");
    });

    loadRooms();

    socket.on('chat-message', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    socket.on('online-users', (users: OnlineUser[]) => {
      setOnlineUsers(users);
    });

    socket.on('typing', ({ typingUsers: receivedTypingUsers }: { typingUsers: string[] }) => {
      setTypingUsers(receivedTypingUsers.filter(username => username !== user.username));
    });

    socket.on('user-joined', ({ username }: { username: string }) => {
      console.log(`${username} joined the room`);
    });

    socket.on('user-left', ({ username }: { username: string }) => {
      console.log(`${username} left the room`);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.off('chat-message');
      socket.off('online-users');
      socket.off('typing');
      socket.off('user-joined');
      socket.off('user-left');
      socket.disconnect();
    };
  }, [user.username, user.userId, currentRoom]); 

  const loadRooms = async () => {
    try {
      const roomsData = await getRooms();
      setRooms(roomsData);

      if (roomsData.length > 0 && !currentRoom) {
        joinRoom(roomsData[0]);
      }
    } catch (error: any) {
      console.error('Error loading rooms:', error.message);
      Alert.alert("Error", `Failed to load chat rooms: ${error.message}`);
    }
  };

  const joinRoom = async (room: Room) => {
    if (!socket.connected) {
      Alert.alert("Connection Status", "Not connected to chat server. Please wait or check connection.");
      return;
    }

    if (currentRoom?._id === room._id) {
      setIsRoomListVisible(false);
      return;
    }

    setCurrentRoom(room);
    setMessages([]);
    setOnlineUsers([]);
    setTypingUsers([]);

    socket.emit('join-room', {
      roomId: room._id,
      username: user.username, 
      userId: user.userId,    
    });

    try {
      const messagesData = await getRoomMessages(room._id);
      setMessages(messagesData);
    } catch (error: any) {
      console.error('Error loading messages:', error.message);
      Alert.alert("Error", `Failed to load messages for room ${room.name}: ${error.message}`);
    }
    setIsRoomListVisible(false);
  };

  const sendMessage = (message: string) => {
    if (!socket.connected || !currentRoom || !message.trim()) {
      Alert.alert("Error", "Cannot send message. Not connected or no room selected.");
      return;
    }

    socket.emit('chat-message', {
      roomId: currentRoom._id,
      message: message.trim(),
      username: user.username, 
      userId: user.userId,     
    });
  };

  const handleTyping = (isTyping: boolean) => {
    if (!socket.connected || !currentRoom) return;

    if (isTyping) {
      socket.emit('typing', {
        roomId: currentRoom._id,
        username: user.username, 
        isTyping: true
      });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing', {
          roomId: currentRoom._id,
          username: user.username, 
          isTyping: false
        });
        typingTimeoutRef.current = null;
      }, 2000); 
    } else {
      socket.emit('typing', {
        roomId: currentRoom._id,
        username: user.username, 
        isTyping: false
      });
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
    }
  };

  const createRoom = async (roomName: string) => {
    try {
      const newRoom = await apiCreateRoom(roomName);
      setRooms(prev => [...prev, newRoom]);
      joinRoom(newRoom);
    } catch (error: any) {
      console.error('Error creating room:', error.message);
      Alert.alert("Error", `Failed to create room: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      {isRoomListVisible ? (
        <RoomList
          rooms={rooms}
          currentRoom={currentRoom}
          onRoomSelect={joinRoom}
          onCreateRoom={createRoom}
          user={user}
          onLogout={onLogout}
          connectionStatus={connectionStatus}
        />
      ) : (
        <View style={styles.chatMain}>
          <View style={styles.chatHeader}>
            <TouchableOpacity onPress={() => setIsRoomListVisible(true)} style={styles.backButton}>
              <Text style={styles.backButtonText}>{"< Rooms"}</Text>
            </TouchableOpacity>
            <View style={styles.roomInfo}>
              <Text style={styles.roomName}>{currentRoom?.name || 'Select a room'}</Text>
              <View style={styles.connectionStatusContainer}>
                <View style={[styles.statusDot, { backgroundColor: connectionStatus === 'connected' ? '#28a745' : connectionStatus === 'connecting' ? '#ffc107' : '#dc3545' }]}></View>
                <Text style={styles.connectionStatusText}>
                  {connectionStatus === 'connected' ? 'Connected' :
                   connectionStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.usersToggle}
              onPress={() => setShowUsersList(true)}
            >
              <Text style={styles.usersToggleText}>👥 Online ({onlineUsers.length})</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.chatBody}>
            <MessageList messages={messages} currentUser={user} />
            <TypingIndicator typingUsers={typingUsers} />
          </View>

          <MessageInput
            onSendMessage={sendMessage}
            onTyping={handleTyping}
            disabled={!currentRoom || connectionStatus !== 'connected'}
          />
        </View>
      )}

      <OnlineUsersList
        users={onlineUsers}
        onClose={() => setShowUsersList(false)}
        isVisible={showUsersList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  chatMain: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#3498db', 
    borderBottomWidth: 1,
    borderBottomColor: '#2980b9',
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  roomInfo: {
    alignItems: 'center',
    flex: 1, 
  },
  roomName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  connectionStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  connectionStatusText: {
    fontSize: 12,
    color: '#fff',
  },
  usersToggle: {
    padding: 5,
  },
  usersToggleText: {
    color: '#fff',
    fontSize: 16,
  },
  chatBody: {
    flex: 1,
    justifyContent: 'flex-end', 
  },
});

export default ChatRoomScreen;
