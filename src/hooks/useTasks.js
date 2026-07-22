import { useState, useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { triggerConfetti } from '../utils/helpers';

const DEFAULT_TASKS = [
  {
    id: 'task-demo-1',
    title: '🚀 Complete TaskFlow App setup & launch',
    completed: false,
    priority: 'High',
    category: 'Work',
    pinned: true,
    favorite: true,
    dueDate: new Date().toISOString().slice(0, 10),
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    completedAt: null,
    order: 1,
    subtasks: [
      { id: 'sub-1', title: 'Verify responsive layout', completed: true },
      { id: 'sub-2', title: 'Test LocalStorage persistence', completed: true },
      { id: 'sub-3', title: 'Deploy live project', completed: false }
    ]
  },
  {
    id: 'task-demo-2',
    title: '🎨 Review modern Tailwind CSS glassmorphism components',
    completed: false,
    priority: 'Medium',
    category: 'Personal',
    pinned: false,
    favorite: false,
    dueDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    completedAt: null,
    order: 2,
    subtasks: []
  },
  {
    id: 'task-demo-3',
    title: '⚡ Try drag & drop reordering and keyboard shortcuts',
    completed: true,
    priority: 'Low',
    category: 'Work',
    pinned: false,
    favorite: false,
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
  const addTask = useCallback(({ title, priority = 'Medium', category = 'Personal', dueDate = null }) => {
    const newTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      title: title.trim(),
      completed: false,
      priority,
      category: category.trim() || 'Personal',
      pinned: false,
      favorite: false,
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
            completed: allSubsCompleted ? true : task.completed
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
          ? { ...t, completed: true, completedAt: t.completedAt || new Date().toISOString() }
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

  // Dynamic Drag and Drop Task Reordering
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

  // Statistics Calculation
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    const pinned = tasks.filter((t) => t.pinned).length;
    const todayStr = new Date().toISOString().slice(0, 10);
    const todayTasks = tasks.filter((t) => t.dueDate === todayStr).length;
    const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      pending,
      pinned,
      todayTasks,
      completionPercentage
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
    selectedTaskIds,
    toggleSelectTask,
    selectAll,
    deselectAll,
    addTask,
    editTask,
    deleteTask,
    toggleComplete,
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
