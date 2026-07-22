import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from './hooks/useTheme';
import { useTasks } from './hooks/useTasks';
import { Header } from './components/Header';
import { Statistics } from './components/Statistics';
import { SearchBar } from './components/SearchBar';
import { TaskInput } from './components/TaskInput';
import { FilterTabs } from './components/FilterTabs';
import { BulkActions } from './components/BulkActions';
import { TaskList } from './components/TaskList';
import { DeleteModal } from './components/DeleteModal';
import { ToastSnackbar } from './components/ToastSnackbar';
import { Footer } from './components/Footer';
import { parseTasksJSON } from './utils/helpers';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const {
    tasks,
    filteredAndSortedTasks,
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
    duplicateTask,
    togglePin,
    toggleFavorite,
    bulkComplete,
    bulkDelete,
    clearCompleted,
    importTasks,
    toastMessage,
    clearToast,
    showToast
  } = useTasks();

  const fileInputRef = useRef(null);
  const taskInputContainerRef = useRef(null);

  // Delete modal state
  const [deleteModalConfig, setDeleteModalConfig] = useState({
    isOpen: false,
    mode: 'single', // 'single' | 'bulk'
    targetId: null
  });

  // Global Keyboard Shortcuts (Delete key for deleting selected tasks)
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // Avoid triggering when user is typing in input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
        return;
      }

      if (e.key === 'Delete' && selectedTaskIds.length > 0) {
        e.preventDefault();
        setDeleteModalConfig({
          isOpen: true,
          mode: 'bulk',
          targetId: null
        });
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [selectedTaskIds]);

  // Request single delete
  const handleDeleteSingleRequest = (id) => {
    setDeleteModalConfig({
      isOpen: true,
      mode: 'single',
      targetId: id
    });
  };

  // Request bulk delete
  const handleDeleteBulkRequest = () => {
    if (selectedTaskIds.length === 0) return;
    setDeleteModalConfig({
      isOpen: true,
      mode: 'bulk',
      targetId: null
    });
  };

  // Confirm delete modal action
  const handleConfirmDeleteModal = () => {
    if (deleteModalConfig.mode === 'single' && deleteModalConfig.targetId) {
      deleteTask(deleteModalConfig.targetId);
    } else if (deleteModalConfig.mode === 'bulk') {
      bulkDelete();
    }
    setDeleteModalConfig({ isOpen: false, mode: 'single', targetId: null });
  };

  // Handle JSON Import file selection
  const handleFileImportChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        const result = parseTasksJSON(content);
        if (result.success) {
          importTasks(result.tasks);
        } else {
          showToast(`Import Failed: ${result.error}`);
        }
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  const handleFocusTaskInput = () => {
    const inputEl = taskInputContainerRef.current?.querySelector('input[type="text"]');
    if (inputEl) {
      inputEl.focus();
      inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const visibleTaskIds = filteredAndSortedTasks.map((t) => t.id);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 px-3 sm:px-6 py-4 flex flex-col items-center justify-between transition-colors duration-300 selection:bg-indigo-500 selection:text-white">
      {/* Hidden File Input for JSON import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileImportChange}
        accept=".json,application/json"
        className="hidden"
      />

      <div className="w-full max-w-4xl flex flex-col flex-1">
        {/* Header Section */}
        <Header
          theme={theme}
          toggleTheme={toggleTheme}
          tasks={tasks}
          onImportClick={() => fileInputRef.current?.click()}
        />

        {/* Statistics Dashboard */}
        <Statistics stats={stats} />

        {/* Search Bar */}
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Task Input Section */}
        <div ref={taskInputContainerRef}>
          <TaskInput onAddTask={addTask} existingTasks={tasks} />
        </div>

        {/* Filter Tabs */}
        <FilterTabs
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          tasks={tasks}
        />

        {/* Bulk Actions & Sort Controls Bar */}
        <BulkActions
          totalVisibleTasks={filteredAndSortedTasks.length}
          selectedTaskIds={selectedTaskIds}
          onSelectAll={selectAll}
          onDeselectAll={deselectAll}
          onBulkComplete={bulkComplete}
          onBulkDeleteRequest={handleDeleteBulkRequest}
          onClearCompleted={clearCompleted}
          sortOption={sortOption}
          setSortOption={setSortOption}
          visibleTaskIds={visibleTaskIds}
        />

        {/* Main Task List */}
        <TaskList
          tasks={filteredAndSortedTasks}
          searchQuery={searchQuery}
          selectedTaskIds={selectedTaskIds}
          onToggleSelect={toggleSelectTask}
          onToggleComplete={toggleComplete}
          onEditTask={editTask}
          onDeleteRequest={handleDeleteSingleRequest}
          onDuplicate={duplicateTask}
          onTogglePin={togglePin}
          onToggleFavorite={toggleFavorite}
          onShowToast={showToast}
          onCreateFirstTask={handleFocusTaskInput}
        />

        {/* Footer */}
        <Footer totalTasks={stats.total} completedTasks={stats.completed} />
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={deleteModalConfig.isOpen}
        onClose={() => setDeleteModalConfig({ isOpen: false, mode: 'single', targetId: null })}
        onConfirm={handleConfirmDeleteModal}
        count={deleteModalConfig.mode === 'bulk' ? selectedTaskIds.length : 1}
      />

      {/* Notification Toast Snackbar */}
      <ToastSnackbar toast={toastMessage} onClose={clearToast} />
    </div>
  );
}
