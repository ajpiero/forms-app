import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { useSelector } from 'react-redux';

export default function ViewFormsScreen({ navigation }) {
  const forms = useSelector((state) => state.forms.list);

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <FlatList
          data={forms}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.formContainer}
              onPress={() => navigation.navigate('FormDetail', { form: item })}
            >
              <Text style={styles.formName}>{item.formName}</Text>
            </TouchableOpacity>
          )}
        />
        <View style={styles.spacer} />
        <Button title="Back to Home" onPress={() => navigation.navigate('Home')} />
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
    padding: 16,
  },
  formContainer: {
    marginBottom: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  formName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  spacer: {
    height: 20,
  },
});
