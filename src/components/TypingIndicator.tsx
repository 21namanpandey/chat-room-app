import React, { useRef, useEffect } from 'react'; 
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';

interface TypingIndicatorProps {
  typingUsers: string[];
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ typingUsers }) => {
  if (typingUsers.length === 0) return null;

  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  const animateDot = (dot: Animated.Value, delay: number) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(dot, {
          toValue: 1,
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: true,
          delay: delay,
        }),
        Animated.timing(dot, {
          toValue: 0,
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.delay(600 - delay), 
      ])
    ).start();
  };

  useEffect(() => {
    animateDot(dot1, 0);
    animateDot(dot2, 100);
    animateDot(dot3, 200);
  }, []);

  const getTypingText = () => {
    if (typingUsers.length === 1) {
      return `${typingUsers[0]} is typing`;
    } else if (typingUsers.length === 2) {
      return `${typingUsers[0]} and ${typingUsers[1]} are typing`;
    } else {
      return `${typingUsers.length} people are typing`;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.typingContent}>
        <Text style={styles.typingAvatar}>✏️</Text>
        <Text style={styles.typingText}>{getTypingText()}</Text>
        <View style={styles.typingDots}>
          <Animated.View style={[styles.dot, { opacity: dot1 }]} />
          <Animated.View style={[styles.dot, { opacity: dot2 }]} />
          <Animated.View style={[styles.dot, { opacity: dot3 }]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#e0e0e0',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    alignSelf: 'flex-start', 
    borderRadius: 20,
    marginHorizontal: 10,
    marginBottom: 5,
  },
  typingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingAvatar: {
    fontSize: 18,
    marginRight: 8,
  },
  typingText: {
    fontSize: 14,
    color: '#555',
    fontStyle: 'italic',
  },
  typingDots: {
    flexDirection: 'row',
    marginLeft: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#555',
    marginHorizontal: 2,
  },
});

export default TypingIndicator;
