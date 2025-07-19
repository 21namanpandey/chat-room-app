import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, Button } from 'react-native';
import { Room, User } from '../types';

interface RoomListProps {
  rooms: Room[];
  currentRoom: Room | null;
  onRoomSelect: (room: Room) => void;
  onCreateRoom: (name: string) => void;
  user: User;
  onLogout: () => void;
  connectionStatus: 'connecting' | 'connected' | 'disconnected';
}

const RoomList: React.FC<RoomListProps> = ({
  rooms,
  currentRoom,
  onRoomSelect,
  onCreateRoom,
  user,
  onLogout,
  connectionStatus
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');

  const handleCreateRoom = () => {
    if (newRoomName.trim() && newRoomName.trim().length <= 30) {
      onCreateRoom(newRoomName.trim());
      setNewRoomName('');
      setShowCreateForm(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return '#28a745'; 
      case 'connecting': return '#ffc107'; 
      case 'disconnected': return '#dc3545'; 
      default: return '#6c757d'; 
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected': return '🟢 Online';
      case 'connecting': return '🟡 Connecting';
      case 'disconnected': return '🔴 Offline';
      default: return '⚪ Unknown';
    }
  };

  const renderRoomItem = ({ item: room }: { item: Room }) => (
    <TouchableOpacity
      key={room._id}
      style={[styles.roomItem, currentRoom?._id === room._id && styles.activeRoomItem]}
      onPress={() => onRoomSelect(room)}
    >
      <Text style={[styles.roomName, currentRoom?._id === room._id && styles.activeRoomName]}>#{room.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.sidebar}>
      <View style={styles.sidebarHeader}>
        <Text style={styles.sidebarTitle}>💬 Chat Rooms</Text>
        <TouchableOpacity
          style={styles.createRoomBtn}
          onPress={() => setShowCreateForm(true)}
        >
          <Text style={styles.createRoomBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showCreateForm}
        onRequestClose={() => setShowCreateForm(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.createRoomForm}>
            <Text style={styles.formTitle}>Create New Room</Text>
            <TextInput
              style={styles.formInput}
              value={newRoomName}
              onChangeText={setNewRoomName}
              placeholder="Enter room name..."
              maxLength={30}
            />
            <View style={styles.formActions}>
              <Button title="Cancel" onPress={() => { setShowCreateForm(false); setNewRoomName(''); }} color="#dc3545" />
              <Button title="Create" onPress={handleCreateRoom} disabled={!newRoomName.trim()} />
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.roomsList}>
        {rooms.length === 0 ? (
          <View style={styles.noRooms}>
            <Text style={styles.noRoomsText}>No rooms available</Text>
          </View>
        ) : (
          <FlatList
            data={rooms}
            renderItem={renderRoomItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.flatListContent}
          />
        )}
      </View>

      <View style={styles.sidebarFooter}>
        <View style={styles.userInfo}>
          <View style={styles.userDetails}>
            <View style={styles.userAvatar}>
              <Text style={styles.userAvatarText}>{user.username.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.userText}>
              <Text style={styles.usernameText}>{user.username}</Text>
              <Text style={[styles.statusText, { color: getStatusColor(connectionStatus) }]}>
                {getStatusText(connectionStatus)}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
            <Text style={styles.logoutBtnText}>🚪Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    width: '100%',
    height: '100%',
    backgroundColor: '#2c3e50', 
    paddingTop: 20,
    paddingBottom: 10,
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  sidebarTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ecf0f1', 
  },
  createRoomBtn: {
    backgroundColor: '#3498db',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createRoomBtnText: {
    color: '#fff',
    fontSize: 24,
    lineHeight: 24, 
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  createRoomForm: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  formInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  roomsList: {
    flex: 1,
    paddingHorizontal: 15,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  roomItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#34495e', 
  },
  activeRoomItem: {
    backgroundColor: '#2980b9', 
  },
  roomName: {
    color: '#ecf0f1',
    fontSize: 16,
    fontWeight: '500',
  },
  activeRoomName: {
    fontWeight: 'bold',
  },
  noRooms: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noRoomsText: {
    color: '#bdc3c7',
    fontSize: 16,
  },
  sidebarFooter: {
    borderTopWidth: 1,
    borderTopColor: '#34495e',
    paddingTop: 15,
    paddingHorizontal: 15,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#f39c12', 
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  userAvatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userText: {
    flexDirection: 'column',
  },
  usernameText: {
    color: '#ecf0f1',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  logoutBtn: {
    padding: 10,
    borderRadius: 5,
  },
  logoutBtnText: {
    fontSize: 24,
  },
});

export default RoomList;