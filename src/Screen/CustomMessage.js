import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Message } from 'react-native-gifted-chat';

const CustomMessage = (props) => {
  const { currentMessage, position } = props;
console.log("psoition",position)
console.log("cureentmeaage",currentMessage)
  
return (
    <View>
      <Message {...props} />
      {position === 'right' && (
        <View style={styles.tickContainer}>
          <Text style={styles.tick}>
            {currentMessage.status === 'delivered' ? '✓✓' : '✓'}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tickContainer: {
    alignSelf: 'flex-end',
    marginRight: 10,
    marginTop: -10,
  },
  tick: {
    fontSize: 12,
    color: 'gray',
  },
});

export default CustomMessage;
