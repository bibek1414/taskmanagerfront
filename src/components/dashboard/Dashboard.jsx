import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useToast } from "../ui/use-toast";
import debounce from 'lodash/debounce';
import api from '../../services/api';
import { Calendar, Filter, Plus, LogOut } from 'lucide-react';

// Get API URL from your environment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filter, setFilter] = useState({
    category: '',
    priority: '',
    completed: '',
    dueDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const { toast } = useToast();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const fetchTasks = async (currentFilter) => {
    setLoading(true);
    try {
      let url = `${API_URL}/api/tasks?page=${pagination.page}&limit=${pagination.limit}`;
      if (currentFilter.category) url += `&category=${currentFilter.category}`;
      if (currentFilter.priority) url += `&priority=${currentFilter.priority}`;
      if (currentFilter.completed) url += `&completed=${currentFilter.completed === 'true'}`;
      if (currentFilter.dueDate) url += `&due_date=${currentFilter.dueDate}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }

      const data = await response.json();
      setTasks(data.tasks);
      setPagination(prev => ({ ...prev, total: data.total }));
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: "Error",
        description: "Failed to fetch tasks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Create a debounced version of fetchTasks
  const debouncedFetchTasks = useCallback(
    debounce((currentFilter) => {
      fetchTasks(currentFilter);
    }, 500),
    []
  );

  // Separate useEffect for pagination
  useEffect(() => {
    fetchTasks(filter);
  }, [pagination.page]);

  // Separate useEffect for filters
  useEffect(() => {
    debouncedFetchTasks(filter);
    return () => debouncedFetchTasks.cancel();
  }, [filter]);

  const handleFilterChange = (name, value) => {
    setFilter(prev => ({ ...prev, [name]: value }));
    // Reset to first page when filters change
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleCreateTask = async (taskData) => {
    try {
      const response = await fetch(`${API_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      const newTask = await response.json();
      setTasks(prev => [...prev, newTask]);
      setIsFormOpen(false);
      toast({
        title: "Success",
        description: "Task created successfully!",
      });
      fetchTasks(filter);
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      const updatedTask = await response.json();
      setTasks(prev => prev.map(task => 
        task.id === taskId ? updatedTask : task
      ));
      toast({
        title: "Success",
        description: "Task updated successfully!",
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      setTasks(prev => prev.filter(task => task.id !== taskId));
      toast({
        title: "Success",
        description: "Task deleted successfully!",
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const clearFilters = () => {
    setFilter({
      category: '',
      priority: '',
      completed: '',
      dueDate: '',
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <Card className="mb-8 border-none shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold">Task Manager</CardTitle>
              <CardDescription className="text-white opacity-90 mt-1">
                Welcome back! Organize your day efficiently.
              </CardDescription>
            </div>
            <Button onClick={logout} variant="outline" className="bg-white/20 text-white border-white/40 hover:bg-white/30">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <>
              <div className="p-6 bg-white">
                <div className="flex justify-between items-center mb-6">
                  <Button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)} 
                    variant="outline" 
                    className="border-dashed border-gray-300"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    {isFilterOpen ? "Hide Filters" : "Show Filters"}
                  </Button>
                  <Button onClick={() => setIsFormOpen(true)} className="bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="h-4 w-4 mr-2" />
                    New Task
                  </Button>
                </div>

                {isFilterOpen && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 mb-6 bg-gray-50 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <Input
                        type="text"
                        placeholder="Filter by category"
                        value={filter.category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className="bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                      <Input
                        type="text"
                        placeholder="Filter by priority"
                        value={filter.priority}
                        onChange={(e) => handleFilterChange('priority', e.target.value)}
                        className="bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        className="w-full border rounded px-3 py-2 bg-white"
                        value={filter.completed}
                        onChange={(e) => handleFilterChange('completed', e.target.value)}
                      >
                        <option value="">All Status</option>
                        <option value="true">Completed</option>
                        <option value="false">Pending</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                      <div className="relative">
                        <Input
                          type="date"
                          value={filter.dueDate}
                          onChange={(e) => handleFilterChange('dueDate', e.target.value)}
                          className="bg-white"
                        />
                        <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                    <div className="col-span-full flex justify-end">
                      <Button onClick={clearFilters} variant="outline" className="text-gray-600">
                        Clear All Filters
                      </Button>
                    </div>
                  </div>
                )}

                {isFormOpen && (
                  <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      {isFormOpen ? "Create New Task" : "Edit Task"}
                    </h3>
                    <TaskForm
                      onSubmit={handleCreateTask}
                      onCancel={() => setIsFormOpen(false)}
                    />
                  </div>
                )}

                <TaskList
                  tasks={tasks}
                  onUpdateTask={handleUpdateTask}
                  onDeleteTask={handleDeleteTask}
                />

                {tasks.length > 0 && (
                  <div className="flex justify-between items-center mt-6 px-4">
                    <Button
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                      disabled={pagination.page === 1}
                      variant="outline"
                      className="border-gray-300"
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-gray-500">
                      Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit) || 1}
                    </span>
                    <Button
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                      disabled={pagination.page * pagination.limit >= pagination.total}
                      variant="outline"
                      className="border-gray-300"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;