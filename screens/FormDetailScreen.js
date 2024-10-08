import React from 'react';
import { View, Text, StyleSheet, Button, Platform, Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function FormDetailScreen({ route, navigation }) {
  const { form } = route.params;

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <Text style={styles.formName}>{form.formName}</Text>
        {form.fields.map((field, index) => (
          <View key={index} style={styles.fieldContainer}>
            <Text style={styles.fieldTitle}>{field.title}:</Text>
            <Text style={styles.fieldValue}>{field.value}</Text>
          </View>
        ))}
        <View style={styles.spacer} />
        <Button title="Back to Forms" onPress={() => navigation.goBack()} />
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
    width: Platform.OS === 'web' ? '30%' : '90%',
    padding: 16,
  },
  formName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  fieldContainer: {
    marginBottom: 12,
  },
  fieldTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  fieldValue: {
    fontSize: 16,
  },
  spacer: {
    height: 20,
  },
});
