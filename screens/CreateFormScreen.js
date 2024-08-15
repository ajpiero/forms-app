import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, Keyboard, Dimensions, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { Formik, FieldArray } from 'formik';
import * as Yup from 'yup';
import { addForm } from '../slices/formsSlice';
import { Picker } from '@react-native-picker/picker';
import { useDragAndDrop } from '@formkit/drag-and-drop/react';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const validateFieldValue = (value, type) => {
  if (type === 'number') {
    return /^-?\d+(\.\d+)?$/.test(value) ? true : 'Field must contain a valid number.';
  } else if (type === 'text') {
    return /^[a-zA-Z0-9]+$/.test(value) && /[a-zA-Z]/.test(value)
      ? true
      : 'Field must contain letters and can include numbers, but not just numbers.';
  }
  return true;
};

const validationSchema = Yup.object().shape({
  formName: Yup.string().required('Form name is required'),
  fields: Yup.array().of(
    Yup.object().shape({
      title: Yup.string().required('Title is required'),
      type: Yup.string().required('Type is required'),
      value: Yup.string()
        .required('Value is required')
        .test('validate-field-value', function (value) {
          const { type } = this.parent;
          const validationMessage = validateFieldValue(value, type);
          return validationMessage === true ? true : this.createError({ message: validationMessage });
        }),
    })
  ),
});

export default function CreateFormScreen({ navigation }) {
  const dispatch = useDispatch();

  return (
    <Formik
      initialValues={{ formName: '', fields: [] }}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        dispatch(addForm(values));
        navigation.navigate('Home');
        resetForm();
      }}
    >
      {({ handleChange, handleBlur, handleSubmit, values, setFieldValue, touched, errors }) => {
        const [parentRef, fieldOrder, setFieldOrder] = useDragAndDrop(
          values.fields.map((_, index) => index), 
          {
            draggable: (el) => el.id !== 'no-drag',
            handle: '.handle', 
          }
        );

        return (
          <View style={styles.outerContainer}>
            <ScrollView style={styles.container}>
              <Text style={styles.label}>Name of Form:</Text>
              <TextInput
                style={styles.formNameInput}
                onChangeText={handleChange('formName')}
                onBlur={handleBlur('formName')}
                value={values.formName}
                onSubmitEditing={() => Keyboard.dismiss()} 
                returnKeyType="done" 
              />
              {touched.formName && errors.formName ? (
                <Text style={styles.error}>{errors.formName}</Text>
              ) : null}

              <FieldArray
                name="fields"
                render={({ push, remove }) => (
                  <>
                    <View ref={parentRef}>
                      {fieldOrder.map((index) => (
                        <View key={index} style={styles.fieldGroup}>
                          <View style={styles.fieldContainer}>
                            <TouchableOpacity style={styles.handle} activeOpacity={0.7}>
                              <Text style={styles.handleText}>≡</Text>
                            </TouchableOpacity>
                            <Picker
                              selectedValue={values.fields[index].type}
                              style={styles.smallPicker}
                              onValueChange={(itemValue) => setFieldValue(`fields[${index}].type`, itemValue)}
                            >
                              <Picker.Item label="Text" value="text" />
                              <Picker.Item label="Number" value="number" />
                            </Picker>

                            <TextInput
                              style={styles.titleInput}
                              placeholder="Title"
                              onChangeText={(value) => setFieldValue(`fields[${index}].title`, value)}
                              onBlur={handleBlur(`fields[${index}].title`)}
                              value={values.fields[index].title}
                            />

                            <TextInput
                              style={styles.input}
                              placeholder={values.fields[index].type === 'number' ? 'Write total' : 'Write text'}
                              onChangeText={(value) => setFieldValue(`fields[${index}].value`, value)}
                              onBlur={handleBlur(`fields[${index}].value`)}
                              value={values.fields[index].value}
                              onSubmitEditing={() => Keyboard.dismiss()} 
                              returnKeyType="done" 
                            />

                            <Button title="Remove" onPress={() => {
                              remove(index);
                              setFieldOrder(fieldOrder.filter(i => i !== index));
                            }} style={styles.button} />
                          </View>
                          {/* Error messages */}
                          {touched.fields && touched.fields[index] && errors.fields && errors.fields[index] && (
                            <View>
                              {errors.fields[index].type && <Text style={styles.error}>{errors.fields[index].type}</Text>}
                              {errors.fields[index].title && <Text style={styles.error}>{errors.fields[index].title}</Text>}
                              {errors.fields[index].value && <Text style={styles.error}>{errors.fields[index].value}</Text>}
                            </View>
                          )}
                        </View>
                      ))}
                    </View>

                    <Button
                      title="+ Add New Field"
                      onPress={() => {
                        const newField = { title: '', type: 'text', value: '' };
                        push(newField);
                        setFieldOrder([...fieldOrder, values.fields.length]); 
                      }}
                    />
                  </>
                )}
              />

              <View style={styles.spacer} />

              <Button title="Submit" onPress={handleSubmit} />
            </ScrollView>
          </View>
        );
      }}
    </Formik>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  container: {
    width: Platform.OS === 'web' ? '40%' : '90%',
    padding: 16,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  formNameInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    flex: 1,
  },
  titleInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    flex: 1,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  smallPicker: {
    height: Platform.OS === 'web' ? 50 : 40,
    width: Platform.OS === 'web' ? '20%' : '30%',
    marginRight: 10,
  },
  button: {
    flex: 0.2,
  },
  handle: {
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: 'transparent',
    borderRadius: 4,
  },
  handleText: {
    fontSize: 20,
    color: '#333',
  },
  error: {
    fontSize: 12,
    color: 'red',
    marginTop: 4,
  },
  spacer: {
    height: 20,
  },
});
