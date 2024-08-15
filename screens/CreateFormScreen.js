import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, Picker, Keyboard } from 'react-native';
import { useDispatch } from 'react-redux';
import { Formik, FieldArray } from 'formik';
import * as Yup from 'yup';
import { addForm } from '../slices/formsSlice';

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
      {({ handleChange, handleBlur, handleSubmit, values, setFieldValue, touched, errors }) => (
        <View style={styles.outerContainer}>
          <View style={styles.container}>
            <Text style={styles.label}>Name of Form:</Text>
            <TextInput
              style={styles.input}
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
                  {values.fields.map((field, index) => (
                    <View key={index} style={styles.fieldGroup}>
                      <View style={styles.fieldContainer}>
                        <Picker
                          selectedValue={field.type}
                          style={styles.smallPicker}
                          onValueChange={(itemValue) => setFieldValue(`fields[${index}].type`, itemValue)}
                        >
                          <Picker.Item label="Text" value="text" />
                          <Picker.Item label="Number" value="number" />
                        </Picker>
                        <TextInput
                          style={styles.input}
                          placeholder={field.type === 'number' ? 'Write your number' : 'Write your text'}
                          onChangeText={(value) => setFieldValue(`fields[${index}].value`, value)}
                          onBlur={handleBlur(`fields[${index}].value`)}
                          value={field.value}
                          onSubmitEditing={() => Keyboard.dismiss()} 
                          returnKeyType="done" 
                        />
                        <Button title="Remove" onPress={() => remove(index)} style={styles.button} />
                      </View>
                      {touched.fields && touched.fields[index] && errors.fields && errors.fields[index]?.value ? (
                        <Text style={styles.error}>{errors.fields[index].value}</Text>
                      ) : null}
                    </View>
                  ))}

                  <Button
                    title="+ Add New Field"
                    onPress={() => push({ type: 'text', value: '' })}
                  />
                </>
              )}
            />

            <View style={styles.spacer} />

            <Button title="Submit" onPress={handleSubmit} />
          </View>
        </View>
      )}
    </Formik>
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
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8, 
    flex: 1,
    marginRight:10,
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
    height: 50,
    width: '30%',
    marginRight: 10,
  },
  button: {
    marginLeft: 10,  
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

