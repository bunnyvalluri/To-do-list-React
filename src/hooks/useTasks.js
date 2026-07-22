import { useState, useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { triggerConfetti } from '../utils/helpers';

const DEFAULT_TASKS = [
  {
    id: 'task-pro-1',
    title: '🚀 Complete TaskFlow Pro SaaS Architecture setup',
    description: 'Finalize multi-view task boards, Command Palette (Ctrl+K), and Recharts Analytics integration.',
    completed: false,
    status: 'in_progress', // 'pending' | 'in_progress' | 'completed'
    priority: 'High',
    category: 'Work',
    pinned: true,
    favorite: true,
    estimatedTime: 45,
    colorLabel: '#6366f1',
    dueDate: new Date().toISOString().slice(0, 10),
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    completedAt: null,
    order: 1,
    subtasks: [
      { id: 'sub-1', title: 'Setup Recharts dashboard', completed: true },
      { id: 'sub-2', title: 'Implement Kanban drag board', completed: true },
      { id: 'sub-3', title: 'Build Command Palette overlay', completed: false }
    ]
  },
  {
    id: 'task-pro-2',
    title: '🎨 Review modern Tailwind CSS glassmorphism UI design',
    description: 'Ensure smooth dark mode contrast, sleek rounded cards, and responsive sidebar navigation.',
    completed: false,
    status: 'pending',
    priority: 'Medium',
    category: 'Personal',
    pinned: false,
    favorite: false,
    estimatedTime: 30,
    colorLabel: '#a855f7',
    dueDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    completedAt: null,
    order: 2,
    subtasks: []
  },
  {
    id: 'task-pro-3',
    title: '⚡ Try Pomodoro Focus Timer room (25m session)',
    description: 'Use the dedicated focus timer widget to boost daily productivity.',
    completed: true,
    status: 'completed',
    priority: 'Low',
    category: 'Health',
    pinned: false,
    favorite: false,
    estimatedTime: 25,
    colorLabel: '#10b981',
    dueDate: null,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    completedAt: new Date(Date.now() - 1800000).toISOString(),
    order: 3,
    subtasks: []
  }
];

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage('taskflow_tasks', DEFAULT_TASKS);
  const [searchQuery, setSearchQuery] = useLocalStorage('taskflow_search', '');
  const [activeFilter, setActiveFilter] = useLocalStorage('taskflow_filter', 'All');
  const [sortOption, setSortOption] = useLocalStorage('taskflow_sort', 'Custom Drag');
  const [activeView, setActiveView] = useLocalStorage('taskflow_active_view', 'list'); // 'list' | 'kanban' | 'calendar' | 'grid'
  const [activePage, setActivePage] = useState('dashboard'); // 'dashboard' | 'tasks' | 'calendar' | 'analytics' | 'focus' | 'settings'
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);
  const [lastDeletedTask, setLastDeletedTask] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = useCallback((msg, action = null) => {
    setToastMessage({ id: Date.now(), text: msg, action });
  }, []);

  const clearToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  // Add Task
  const addTask = useCallback(({
    title,
    description = '',
    priority = 'Medium',
    category = 'Personal',
    dueDate = null,
    estimatedTime = 15,
    colorLabel = '#6366f1'
  }) => {
    const newTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      title: title.trim(),
      description: description.trim(),
      completed: false,
      status: 'pending',
      priority,
      category: category.trim() || 'Personal',
      pinned: false,
      favorite: false,
      estimatedTime: Number(estimatedTime) || 15,
      colorLabel,
      dueDate: dueDate || null,
      createdAt: new Date().toISOString(),
      completedAt: null,
      order: 0,
      subtasks: []
    };

    setTasks((prev) => [newTask, ...prev]);
    showToast('Task added successfully!');
    return newTask;
  }, [setTasks, showToast]);

  // Edit Task
  const editTask = useCallback((id, updatedFields) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === id) {
          return {
            ...task,
            ...updatedFields,
            title: updatedFields.title ? updatedFields.title.trim() : task.title,
            category: updatedFields.category ? updatedFields.category.trim() : task.category
          };
        }
        return task;
      })
    );
    showToast('Task updated!');
  }, [setTasks, showToast]);

  // Toggle Completion
  const toggleComplete = useCallback((id) => {
    setTasks((prev) => {
      const updated = prev.map((task) => {
        if (task.id === id) {
          const nextCompleted = !task.completed;
          return {
            ...task,
            completed: nextCompleted,
            status: nextCompleted ? 'completed' : 'pending',
            completedAt: nextCompleted ? new Date().toISOString() : null,
            subtasks: (task.subtasks || []).map(s => ({ ...s, completed: nextCompleted }))
          };
        }
        return task;
      });

      if (updated.length > 0 && updated.every(t => t.completed)) {
        triggerConfetti();
      }

      return updated;
    });
  }, [setTasks]);

  // Update Kanban Status ('pending' | 'in_progress' | 'completed')
  const updateTaskStatus = useCallback((id, newStatus) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === id) {
          const isDone = newStatus === 'completed';
          return {
            ...task,
            status: newStatus,
            completed: isDone,
            completedAt: isDone ? new Date().toISOString() : null
          };
        }
        return task;
      })
    );
  }, [setTasks]);

  // Subtasks CRUD
  const addSubtask = useCallback((taskId, title) => {
    if (!title.trim()) return;
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const newSub = {
            id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            title: title.trim(),
            completed: false
          };
          return {
            ...task,
            subtasks: [...(task.subtasks || []), newSub]
          };
        }
        return task;
      })
    );
  }, [setTasks]);

  const toggleSubtask = useCallback((taskId, subtaskId) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const updatedSubs = (task.subtasks || []).map((s) =>
            s.id === subtaskId ? { ...s, completed: !s.completed } : s
          );
          const allSubsCompleted = updatedSubs.length > 0 && updatedSubs.every(s => s.completed);
          return {
            ...task,
            subtasks: updatedSubs,
            completed: allSubsCompleted ? true : task.completed,
            status: allSubsCompleted ? 'completed' : task.status
          };
        }
        return task;
      })
    );
  }, [setTasks]);

  const deleteSubtask = useCallback((taskId, subtaskId) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            subtasks: (task.subtasks || []).filter((s) => s.id !== subtaskId)
          };
        }
        return task;
      })
    );
  }, [setTasks]);

  // Delete Single Task
  const deleteTask = useCallback((id) => {
    setTasks((prev) => {
      const taskToDelete = prev.find(t => t.id === id);
      if (taskToDelete) {
        setLastDeletedTask({ task: taskToDelete, index: prev.findIndex(t => t.id === id) });
        showToast(`Task "${taskToDelete.title.slice(0, 20)}..." deleted`, {
          label: 'Undo',
          onClick: () => undoDelete()
        });
      }
      return prev.filter(t => t.id !== id);
    });
    setSelectedTaskIds((prev) => prev.filter((selectedId) => selectedId !== id));
  }, [setTasks, showToast]);

  // Undo Delete
  const undoDelete = useCallback(() => {
    if (lastDeletedTask) {
      setTasks((prev) => {
        const next = [...prev];
        next.splice(lastDeletedTask.index, 0, lastDeletedTask.task);
        return next;
      });
      setLastDeletedTask(null);
      showToast('Task restored!');
    }
  }, [lastDeletedTask, setTasks, showToast]);

  // Duplicate Task
  const duplicateTask = useCallback((id) => {
    setTasks((prev) => {
      const target = prev.find(t => t.id === id);
      if (!target) return prev;
      const copy = {
        ...target,
        id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        title: `${target.title} (Copy)`,
        createdAt: new Date().toISOString(),
        completed: false,
        status: 'pending',
        completedAt: null,
        order: Date.now()
      };
      showToast('Task duplicated!');
      return [copy, ...prev];
    });
  }, [setTasks, showToast]);

  // Toggle Pin
  const togglePin = useCallback((id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, pinned: !t.pinned } : t))
    );
  }, [setTasks]);

  // Toggle Favorite
  const toggleFavorite = useCallback((id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, favorite: !t.favorite } : t))
    );
  }, [setTasks]);

  // Multi-Select Toggle
  const toggleSelectTask = useCallback((id) => {
    setSelectedTaskIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }, []);

  const selectAll = useCallback((idsToSelect) => {
    setSelectedTaskIds(idsToSelect);
  }, []);

  const deselectAll = useCallback(() => {
    setSelectedTaskIds([]);
  }, []);

  // Bulk Complete
  const bulkComplete = useCallback(() => {
    if (selectedTaskIds.length === 0) return;
    setTasks((prev) =>
      prev.map((t) =>
        selectedTaskIds.includes(t.id)
          ? { ...t, completed: true, status: 'completed', completedAt: t.completedAt || new Date().toISOString() }
          : t
      )
    );
    showToast(`${selectedTaskIds.length} tasks marked as complete!`);
    setSelectedTaskIds([]);
  }, [selectedTaskIds, setTasks, showToast]);

  // Bulk Delete
  const bulkDelete = useCallback(() => {
    if (selectedTaskIds.length === 0) return;
    setTasks((prev) => prev.filter((t) => !selectedTaskIds.includes(t.id)));
    showToast(`${selectedTaskIds.length} tasks deleted!`);
    setSelectedTaskIds([]);
  }, [selectedTaskIds, setTasks, showToast]);

  // Clear Completed
  const clearCompleted = useCallback(() => {
    setTasks((prev) => prev.filter((t) => !t.completed));
    showToast('Completed tasks cleared!');
  }, [setTasks, showToast]);

  // Import Tasks
  const importTasks = useCallback((importedTasks) => {
    setTasks(importedTasks);
    showToast(`Successfully imported ${importedTasks.length} tasks!`);
  }, [setTasks, showToast]);

  // Move Task Reordering
  const moveTask = useCallback((draggedId, targetId) => {
    if (draggedId === targetId) return;
    setTasks((prev) => {
      const copy = [...prev];
      const draggedIdx = copy.findIndex((t) => t.id === draggedId);
      const targetIdx = copy.findIndex((t) => t.id === targetId);
      if (draggedIdx === -1 || targetIdx === -1) return prev;

      const [removed] = copy.splice(draggedIdx, 1);
      copy.splice(targetIdx, 0, removed);
      return copy;
    });
    setSortOption('Custom Drag');
  }, [setTasks, setSortOption]);

  // Unique Dynamic Categories List
  const dynamicCategories = useMemo(() => {
    const defaultCats = ['Work', 'Personal', 'Shopping', 'Health', 'Other'];
    const taskCats = tasks.map(t => t.category).filter(Boolean);
    return Array.from(new Set([...defaultCats, ...taskCats]));
  }, [tasks]);

  // Filtered and Sorted Tasks Calculation
  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];

    // Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q)) ||
          (t.category && t.category.toLowerCase().includes(q)) ||
          t.priority.toLowerCase().includes(q) ||
          (t.subtasks || []).some(s => s.title.toLowerCase().includes(q))
      );
    }

    // Filter Tabs
    const todayStr = new Date().toISOString().slice(0, 10);
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    switch (activeFilter) {
      case 'Completed':
        result = result.filter((t) => t.completed);
        break;
      case 'Pending':
        result = result.filter((t) => !t.completed);
        break;
      case 'Pinned':
        result = result.filter((t) => t.pinned);
        break;
      case 'Favorites':
        result = result.filter((t) => t.favorite);
        break;
      case 'High Priority':
        result = result.filter((t) => t.priority === 'High');
        break;
      case 'Medium Priority':
        result = result.filter((t) => t.priority === 'Medium');
        break;
      case 'Low Priority':
        result = result.filter((t) => t.priority === 'Low');
        break;
      case 'Due Today':
        result = result.filter((t) => t.dueDate === todayStr);
        break;
      case 'Overdue':
        result = result.filter((t) => {
          if (!t.dueDate || t.completed) return false;
          const due = new Date(t.dueDate);
          due.setHours(23, 59, 59, 999);
          return due < todayStart;
        });
        break;
      case 'All':
      default:
        break;
    }

    // Sorting
    const priorityWeight = { High: 3, Medium: 2, Low: 1 };

    if (sortOption !== 'Custom Drag') {
      result.sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;

        switch (sortOption) {
          case 'Oldest First':
            return new Date(a.createdAt) - new Date(b.createdAt);
          case 'Alphabetical A-Z':
            return a.title.localeCompare(b.title);
          case 'Alphabetical Z-A':
            return b.title.localeCompare(a.title);
          case 'Priority':
            return priorityWeight[b.priority] - priorityWeight[a.priority];
          case 'Due Date':
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return new Date(a.dueDate) - new Date(b.dueDate);
          case 'Completed First':
            return (b.completed ? 1 : 0) - (a.completed ? 1 : 0);
          case 'Pending First':
            return (a.completed ? 1 : 0) - (b.completed ? 1 : 0);
          case 'Newest First':
          default:
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
      });
    }

    return result;
  }, [tasks, searchQuery, activeFilter, sortOption]);

  // Statistics & Streak Calculation
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    const pinned = tasks.filter((t) => t.pinned).length;
    const todayStr = new Date().toISOString().slice(0, 10);
    const todayTasks = tasks.filter((t) => t.dueDate === todayStr).length;
    const highPriority = tasks.filter((t) => t.priority === 'High' && !t.completed).length;
    const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    // Dynamic Streak & Productivity Score calculation
    const streak = completed > 0 ? Math.min(completed + 2, 7) : 0;
    const productivityScore = Math.min(100, Math.round(completionPercentage * 0.7 + streak * 4 + (total > 0 ? 10 : 0)));

    return {
      total,
      completed,
      pending,
      pinned,
      todayTasks,
      highPriority,
      completionPercentage,
      streak,
      productivityScore
    };
  }, [tasks]);

  return {
    tasks,
    filteredAndSortedTasks,
    dynamicCategories,
    stats,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    sortOption,
    setSortOption,
    activeView,
    setActiveView,
    activePage,
    setActivePage,
    selectedTaskIds,
    toggleSelectTask,
    selectAll,
    deselectAll,
    addTask,
    editTask,
    deleteTask,
    toggleComplete,
    updateTaskStatus,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    duplicateTask,
    togglePin,
    toggleFavorite,
    bulkComplete,
    bulkDelete,
    clearCompleted,
    importTasks,
    moveTask,
    undoDelete,
    toastMessage,
    clearToast,
    showToast
  };
}
