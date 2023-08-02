import React, { useEffect, useState } from 'react';
import { Button, View, Text, Image, TextInput, FlatList, TouchableOpacity, StyleSheet, ImageBackground, ScrollViewComponent, SafeAreaView, Settings } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerItem, DrawerItemList, DrawerContentScrollView } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { ScrollView, Switch } from 'react-native-gesture-handler';


function Home({ navigation }) {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [updatedText, setUpdatedText] = useState('');

  useEffect(() => {
    loadTasks();
  }, []);

  // set data
  const saveTasks = async (tasks) => {
    try {
      const tasksJSON = JSON.stringify(tasks);
      await AsyncStorage.setItem('tasks', tasksJSON);
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  // get data
  const loadTasks = async () => {
    try {
      const tasksJSON = await AsyncStorage.getItem('tasks');
      if (tasksJSON) {
        setTasks(JSON.parse(tasksJSON));
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const handleAddTask = () => {
    if (task.trim() === '') return;

    // uniq id 
    const newTask = {
      id: Date.now(),
      text: task,
    };


    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    setTask('');
  };

  // edit 
  const handleEdit = (taskId) => {
    setEditingTaskId(taskId);
    const taskToEdit = tasks.find((task) => task.id === taskId);
    setUpdatedText(taskToEdit.text);
  };

  // update task
  const handleUpdate = () => {
    if (updatedText.trim() === '') return;
    const updatedTasks = tasks.map((taskItem) => {
      if (taskItem.id === editingTaskId) {
        return { ...taskItem, text: updatedText };
      }
      return taskItem;
    });
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    setEditingTaskId(null);
  };

  // Remove task
  const handleRemoveTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const renderTask = ({ item }) => (
    <View style={styles.taskContainer}>
      {editingTaskId === item.id ? (
        <TextInput
          style={styles.editInput}
          value={updatedText}
          onChangeText={(text) => setUpdatedText(text)}
          autoFocus
          onBlur={handleUpdate}
        />
      ) : (
        <Text style={styles.taskText}>{item.text}</Text>
      )}

      <View style={styles.buttonsContainer}>

        {/* Edit text then update text */}
        {editingTaskId === item.id ? (
          <TouchableOpacity
            style={styles.updateButton}
            onPress={handleUpdate}
          >
            <Text style={styles.updateButtonText}>Update</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEdit(item.id)}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveTask(item.id)}
        >
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={task}
        onChangeText={(text) => setTask(text)}
        placeholder="Enter a new task"
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
        <Text style={styles.addButtonText}>Add Task</Text>
      </TouchableOpacity>

      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id.toString()}
        style={styles.taskList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  imgContainer: {
    flex: 1
  },
  textContainer: {
    alignItems: 'center'
  },
  profileContainer: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    top: 40
  },
  image: {
    width: 110,
    height: 100,
    borderRadius: 55,
    borderColor: 'black',
    borderWidth: 3
  },

  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  addButton: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
  },
  taskText: {
    flex: 1,
  },
  editButton: {
    backgroundColor: 'orange',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 10,
    bottom:5
  },
  editButtonText: {
    color: 'white',
  },
  editInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 5,
    borderRadius: 5,
    marginRight: 10,
  },
  updateButton: {
    backgroundColor: 'green',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 10,
    bottom:'10%'
  },
  updateButtonText: {
    color: 'white',
  },
  removeButton: {
    backgroundColor: 'red',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  removeButtonText: {
    color: 'white',
  },
  taskList: {
    flex: 1,
  },
  
});


export default Home;