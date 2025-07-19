import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { OnlineUser } from '../types';

interface OnlineUsersListProps {
  users: OnlineUser[];
  onClose: () => void;
  isVisible: boolean;
}

const OnlineUsersList: React.FC<OnlineUsersListProps> = ({ users, onClose, isVisible }) => {
  const getAvatarColor = (username: string) => {
    const colors = ['#007bff', '#28a745', '#dc3545', '#ffc107', '#17a2b8', '#6f42c1', '#e83e8c', '#fd7e14'];
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const renderUserItem = ({ item: user }: { item: OnlineUser }) => (
    <View style={styles.userItem}>
      <View
        style={[styles.userAvatar, { backgroundColor: getAvatarColor(user.username) }]}
      >
        <Text style={styles.userAvatarText}>{user.username.charAt(0).toUpperCase()}</Text>
      </View>
      <Text style={styles.userName}>{user.username}</Text>
      <View style={styles.onlineIndicator}></View>
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.panel}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>👥 Online Users ({users.length})</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.usersList}>
            {users.length > 0 ? (
              <FlatList
                data={users}
                renderItem={renderUserItem}
                keyExtractor={(item) => item.userId}
                contentContainerStyle={styles.flatListContent}
              />
            ) : (
              <View style={styles.noUsers}>
                <Text style={styles.emptyIcon}>👤</Text>
                <Text style={styles.emptyText}>No users online</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  panel: {
    width: '80%',
    height: '70%',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
  },
  usersList: {
    flex: 1,
    padding: 10,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  userAvatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userName: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  onlineIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#28a745',
    marginLeft: 5,
  },
  noUsers: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 50,
    color: '#ccc',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});

export default OnlineUsersList;