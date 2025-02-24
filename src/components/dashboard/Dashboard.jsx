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

  const fetchTasks = async (currentFilter) => {
    setLoading(true);
    try {
      let url = `http://localhost:8000/api/tasks?page=${pagination.page}&limit=${pagination.limit}`;
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
      const response = await fetch('http://localhost:8000/api/tasks', {
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
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      const response = await fetch(`http://localhost:8000/api/tasks/${taskId}`, {
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
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/tasks/${taskId}`, {
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
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Task Dashboard</CardTitle>
            <Button onClick={logout} variant="outline">Logout</Button>
          </div>
          <CardDescription>
            Welcome back, {user.email}! Manage your tasks and stay organized.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <p>Loading tasks...</p>
            </div>
          ) : (
            <>
              <div className="flex gap-4 mb-6">
                <Input
                  type="text"
                  placeholder="Category"
                  value={filter.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                />
                <Input
                  type="text"
                  placeholder="Priority"
                  value={filter.priority}
                  onChange={(e) => handleFilterChange('priority', e.target.value)}
                />
                <select
                  className="border rounded px-3 py-2"
                  value={filter.completed}
                  onChange={(e) => handleFilterChange('completed', e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="true">Completed</option>
                  <option value="false">Pending</option>
                </select>
                <Input
                  type="date"
                  value={filter.dueDate}
                  onChange={(e) => handleFilterChange('dueDate', e.target.value)}
                />
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
                <Button onClick={() => setIsFormOpen(true)}>Add New Task</Button>
              </div>

              {isFormOpen && (
                <TaskForm
                  onSubmit={handleCreateTask}
                  onCancel={() => setIsFormOpen(false)}
                />
              )}

              <TaskList
                tasks={tasks}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
              />

              <div className="flex justify-between items-center mt-4">
                <Button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>
                <span>Page {pagination.page}</span>
                <Button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page * pagination.limit >= pagination.total}
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;