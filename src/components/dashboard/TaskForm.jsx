// TaskForm.jsx - Update the form submission
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/Select';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '../ui/Form';

// Get API URL from your environment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const TaskForm = ({ onSubmit, onCancel, initialData }) => {
  const form = useForm({
    defaultValues: initialData || {
      title: '',
      description: '',
      category: 'personal',
      priority: 'medium',
      due_date: '',
    },
  });

  const handleSubmit = async (data) => {
    // Format the data according to the API's expected structure
    const formattedData = {
      title: data.title,
      description: data.description || "",
      category: data.category,
      priority: data.priority,
      due_date: data.due_date ? new Date(data.due_date).toISOString() : null,
      completed: false
    };

    await onSubmit(formattedData);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          name="title"
          rules={{ required: "Title is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="title">Title</FormLabel>
              <FormControl>
                <Input id="title" placeholder="Enter task title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="description">Description</FormLabel>
              <FormControl>
                <Textarea id="description" placeholder="Enter task description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="category">Category</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="work">Work</SelectItem>
                    <SelectItem value="shopping">Shopping</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="priority">Priority</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="due_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="due_date">Due Date</FormLabel>
              <FormControl>
                <Input id="due_date" type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? 'Update Task' : 'Create Task'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default TaskForm;

// Dashboard.jsx - Update the handleCreateTask function
const handleCreateTask = async (taskData) => {
  try {
    const response = await fetch('http://localhost:8000/api/tasks', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to create task');
    }

    const newTask = await response.json();
    setTasks([...tasks, newTask]);
    setIsFormOpen(false);
    toast({
      title: "Success",
      description: "Task created successfully!",
    });
  } catch (error) {
    console.error('Error creating task:', error);
    toast({
      title: "Error",
      description: error.message || "Failed to create task. Please try again.",
      variant: "destructive",
    });
  }
};