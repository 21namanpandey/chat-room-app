import React, { useEffect, useRef, useCallback } from 'react'; 
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { Message, User } from '../types';

interface MessageListProps {
  messages: Message[];
  currentUser: User;
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUser }) => {
  const flatListRef = useRef<FlatList<Message> | null>(null);

  const setFlatListRef = useCallback((node: FlatList<Message> | null) => {
    if (node) {
      flatListRef.current = node;
    }
  }, []); 

  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' +
             date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  const isConsecutiveMessage = (currentMsg: Message, prevMsg: Message | undefined) => {
    if (!prevMsg) return false;
    return prevMsg.username === currentMsg.username &&
           prevMsg.userId === currentMsg.userId &&
           (new Date(currentMsg.timestamp).getTime() - new Date(prevMsg.timestamp).getTime()) < 300000;
  };

  const renderMessage = ({ item: message, index }: { item: Message; index: number }) => {
    const isOwn = message.userId === currentUser.userId;
    const prevMsg = index > 0 ? messages[index - 1] : undefined;
    const consecutive = isConsecutiveMessage(message, prevMsg);

    return (
      <View style={[styles.messageContainer, isOwn ? styles.ownMessage : styles.otherMessage, consecutive && styles.consecutiveMessage]}>
        <View style={styles.messageContent}>
          {!isOwn && !consecutive && (
            <Text style={styles.messageAuthor}>{message.username}</Text>
          )}
          <View style={styles.messageBubble}>
            <Text style={styles.messageText}>{message.message}</Text>
            <Text style={styles.messageTime}>{formatTime(message.timestamp)}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.listContainer}>
      {messages.length === 0 ? (
        <View style={styles.noMessages}>
          <Text style={styles.welcomeMessageTitle}>Welcome to the chat! 👋</Text>
          <Text style={styles.welcomeMessageText}>Start a conversation by sending a message below.</Text>
        </View>
      ) : (
        <FlatList
          ref={setFlatListRef} // Use the callback ref here
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.flatListContent}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  flatListContent: {
    paddingBottom: 10, 
  },
  messageContainer: {
    marginVertical: 2,
    maxWidth: '80%',
  },
  ownMessage: {
    alignSelf: 'flex-end',
  },
  otherMessage: {
    alignSelf: 'flex-start',
  },
  consecutiveMessage: {
    marginTop: 1, 
  },
  messageContent: {
    flexDirection: 'column',
  },
  messageAuthor: {
    fontSize: 12,
    color: '#555',
    marginBottom: 2,
    marginLeft: 10, 
  },
  messageBubble: {
    padding: 10,
    borderRadius: 15,
    backgroundColor: '#e0e0e0',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
    flexShrink: 1, 
  },
  messageTime: {
    fontSize: 10,
    color: '#777',
    marginLeft: 8,
    alignSelf: 'flex-end',
  },
  noMessages: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeMessageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  welcomeMessageText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default MessageList;
