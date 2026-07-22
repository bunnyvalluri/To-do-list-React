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
import { KanbanView } from './components/tasks/KanbanView';
import { GridView } from './components/tasks/GridView';
import { DeleteModal } from './components/DeleteModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { ToastSnackbar } from './components/ToastSnackbar';
import { Footer } from './components/Footer';
import { parseTasksJSON } from './utils/helpers';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const {
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
    toastMessage,
    clearToast,
    showToast
  } = useTasks();

  const fileInputRef = useRef(null);
  const taskInputContainerRef = useRef(null);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Delete modal state
  const [deleteModalConfig, setDeleteModalConfig] = useState({
    isOpen: false,
    mode: 'single', // 'single' | 'bulk'
    targetId: null
  });

  // Global Keyboard Shortcuts (Delete key for deleting selected tasks)
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
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

  const handleDeleteSingleRequest = (id) => {
    setDeleteModalConfig({
      isOpen: true,
      mode: 'single',
      targetId: id
    });
  };

  const handleDeleteBulkRequest = () => {
    if (selectedTaskIds.length === 0) return;
    setDeleteModalConfig({
      isOpen: true,
      mode: 'bulk',
      targetId: null
    });
  };

  const handleConfirmDeleteModal = () => {
    if (deleteModalConfig.mode === 'single' && deleteModalConfig.targetId) {
      deleteTask(deleteModalConfig.targetId);
    } else if (deleteModalConfig.mode === 'bulk') {
      bulkDelete();
    }
    setDeleteModalConfig({ isOpen: false, mode: 'single', targetId: null });
  };

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
    e.target.value = '';
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
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
        />

        {/* Statistics Dashboard */}
        <Statistics stats={stats} />

        {/* Search Bar */}
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Task Input Section with Dynamic Categories */}
        <div ref={taskInputContainerRef}>
          <TaskInput
            onAddTask={addTask}
            existingTasks={tasks}
            categories={dynamicCategories}
          />
        </div>

        {/* Filter Tabs with Dynamic Categories */}
        <FilterTabs
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          tasks={tasks}
          dynamicCategories={dynamicCategories}
        />

        {/* Bulk Actions, View Switcher & Sort Controls Bar */}
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
          activeView={activeView}
          setActiveView={setActiveView}
          visibleTaskIds={visibleTaskIds}
        />

        {/* Workspace Views (List, Kanban, Grid) */}
        {activeView === 'kanban' && (
          <KanbanView
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
            onAddSubtask={addSubtask}
            onToggleSubtask={toggleSubtask}
            onDeleteSubtask={deleteSubtask}
            onMoveTask={moveTask}
            onUpdateTaskStatus={updateTaskStatus}
            onShowToast={showToast}
          />
        )}

        {activeView === 'grid' && (
          <GridView
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
            onAddSubtask={addSubtask}
            onToggleSubtask={toggleSubtask}
            onDeleteSubtask={deleteSubtask}
            onMoveTask={moveTask}
            onShowToast={showToast}
            onCreateFirstTask={handleFocusTaskInput}
          />
        )}

        {(activeView === 'list' || !activeView || activeView === 'calendar') && (
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
            onAddSubtask={addSubtask}
            onToggleSubtask={toggleSubtask}
            onDeleteSubtask={deleteSubtask}
            onMoveTask={moveTask}
            onShowToast={showToast}
            onCreateFirstTask={handleFocusTaskInput}
          />
        )}

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

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Notification Toast Snackbar */}
      <ToastSnackbar toast={toastMessage} onClose={clearToast} />
    </div>
  );
}
