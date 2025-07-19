import React, { useState, useRef } from 'react';
import { TextInput, TouchableOpacity, View, StyleSheet, Text } from 'react-native';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  onTyping: (isTyping: boolean) => void;
  disabled: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onTyping,
  disabled
}) => {
  const [message, setMessage] = useState('');
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSubmit = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
      onTyping(false);
    }
  };

  const handleInputChange = (value: string) => {
    setMessage(value);

    if (value.length > 0 && !disabled) {
      onTyping(true);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        onTyping(false);
      }, 1000); 
    } else {
      onTyping(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={message}
        onChangeText={handleInputChange}
        placeholder={disabled ? "Select a room to start chatting..." : "Type a message..."}
        placeholderTextColor="#999"
        editable={!disabled}
        maxLength={500}
        multiline={false} 
        onSubmitEditing={handleSubmit} 
        returnKeyType="send"
      />
      <TouchableOpacity
        style={[styles.sendButton, (disabled || !message.trim()) && styles.sendButtonDisabled]}
        onPress={handleSubmit}
        disabled={disabled || !message.trim()}
      >
        <Text style={styles.sendButtonText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  sendButton: {
    backgroundColor: '#007bff',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#a0c8ff',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MessageInput;