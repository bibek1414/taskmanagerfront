import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/Card";
import { Button } from "../ui/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/Table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/DropdownMenu";
import { Badge } from "../ui/Badge";
import { MoreVertical, Edit, Trash2, CheckCircle, Circle } from 'lucide-react';
import TaskForm from './TaskForm';

const TaskList = ({ tasks = [], onUpdateTask, onDeleteTask }) => {
  const [editingTask, setEditingTask] = useState(null);

  const getPriorityColor = (priority) => {
    const colors = {
      low: "bg-blue-100 text-blue-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-red-100 text-red-800"
    };
    return colors[priority] || colors.medium;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStatusToggle = (task) => {
    onUpdateTask(task.id, {
      ...task,
      completed: !task.completed
    });
  };

  const handleEdit = (task) => {
    setEditingTask(task);
  };

  const handleEditSubmit = (taskData) => {
    onUpdateTask(editingTask.id, taskData);
    setEditingTask(null);
  };

  if (editingTask) {
    return (
      <TaskForm
        initialData={editingTask}
        onSubmit={handleEditSubmit}
        onCancel={() => setEditingTask(null)}
      />
    );
  }

  if (!tasks.length) {
    return (
      <Card className="mt-6">
        <CardContent className="p-6 text-center text-gray-500">
          No tasks found. Create a new task to get started!
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Status</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleStatusToggle(task)}
                  >
                    {task.completed ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400" />
                    )}
                  </Button>
                </TableCell>
                <TableCell className={task.completed ? 'line-through text-gray-500' : ''}>
                  <div className="font-medium">{task.title}</div>
                  {task.description && (
                    <div className="text-sm text-gray-500">{task.description}</div>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{task.category}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(task.due_date)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(task)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDeleteTask(task.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

TaskList.propTypes = {
  tasks: PropTypes.array.isRequired,
  onUpdateTask: PropTypes.func.isRequired,
  onDeleteTask: PropTypes.func.isRequired,
};

export default TaskList;