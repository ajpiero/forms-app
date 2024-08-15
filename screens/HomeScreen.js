import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Form Creator</Text>
        <Text style={styles.subtitle}>A new way to create forms</Text>
        <Button
          title="Create New Form"
          onPress={() => navigation.navigate('CreateForm')}
        />
        <View style={styles.spacer} />
        <Button
          title="View All Forms"
          onPress={() => navigation.navigate('ViewForms')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    maxWidth: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginVertical: 8,
    textAlign: 'center',
  },
  spacer: {
    height: 20,
  },
});
