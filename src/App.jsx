import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from './hooks/useTheme';
import { useTasks } from './hooks/useTasks';
import { useCommandPalette } from './hooks/useCommandPalette';
import { Header } from './components/Header';
import { HeroDashboard } from './components/dashboard/HeroDashboard';
import { Statistics } from './components/Statistics';
import { SearchBar } from './components/SearchBar';
import { TaskInput } from './components/TaskInput';
import { FilterTabs } from './components/FilterTabs';
import { BulkActions } from './components/BulkActions';
import { ViewToggle } from './components/ui/ViewToggle';
import { TaskList } from './components/TaskList';
import { KanbanView } from './components/tasks/KanbanView';
import { GridView } from './components/tasks/GridView';
import { PomodoroWidget } from './components/dashboard/PomodoroWidget';
import { DeleteModal } from './components/DeleteModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { CommandPalette } from './components/common/CommandPalette';
import { ToastSnackbar } from './components/ToastSnackbar';
import { Footer } from './components/Footer';
import { parseTasksJSON, exportTasksToJSON } from './utils/helpers';
import { FiClock, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

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

  const { isOpen: isCommandPaletteOpen, open: openCommandPalette, close: closeCommandPalette } = useCommandPalette();
  const fileInputRef = useRef(null);
  const taskInputContainerRef = useRef(null);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [showFocusTimer, setShowFocusTimer] = useState(false);

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
        {/* Header Section with Command Palette & Shortcuts */}
        <Header
          theme={theme}
          toggleTheme={toggleTheme}
          tasks={tasks}
          onImportClick={() => fileInputRef.current?.click()}
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
          onOpenCommandPalette={openCommandPalette}
        />

        {/* Hero Banner: Greeting, Streak & Circular Progress Ring */}
        <HeroDashboard stats={stats} onOpenTaskModal={handleFocusTaskInput} />

        {/* Statistics Dashboard */}
        <Statistics stats={stats} />

        {/* Expandable Focus Timer Pill */}
        <div className="w-full mb-6">
          <button
            onClick={() => setShowFocusTimer(!showFocusTimer)}
            className="w-full glass-card px-5 py-3 rounded-2xl border border-indigo-500/20 flex items-center justify-between hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-all text-xs font-extrabold text-slate-800 dark:text-slate-100 shadow-xs cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <FiClock className="w-4 h-4 text-indigo-500" />
              <span>Pomodoro Focus Timer Sprints</span>
            </div>
            <div className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
              <span>{showFocusTimer ? 'Hide Focus Timer' : 'Show Focus Timer'}</span>
              {showFocusTimer ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
            </div>
          </button>

          <AnimatePresence>
            {showFocusTimer && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-3 overflow-hidden"
              >
                <PomodoroWidget />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Search Bar */}
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Task Input Section */}
        <div ref={taskInputContainerRef}>
          <TaskInput
            onAddTask={addTask}
            existingTasks={tasks}
            categories={dynamicCategories}
          />
        </div>

        {/* Filter Tabs */}
        <FilterTabs
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          tasks={tasks}
          dynamicCategories={dynamicCategories}
        />

        {/* Bulk Actions & View Switcher Bar */}
        <div className="w-full space-y-3 mb-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider">
              Workspace Task Board
            </span>
            <ViewToggle activeView={activeView} setActiveView={setActiveView} />
          </div>

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
        </div>

        {/* Main Task List rendering selected View (List, Kanban, Grid) */}
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

        {(activeView === 'list' || !['kanban', 'grid'].includes(activeView)) && (
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

      {/* Command Palette Overlay (Ctrl + K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={closeCommandPalette}
        onOpenTaskModal={handleFocusTaskInput}
        setActivePage={() => {}}
        toggleTheme={toggleTheme}
        theme={theme}
        onExport={() => exportTasksToJSON(tasks)}
        onImportClick={() => fileInputRef.current?.click()}
        onClearCompleted={clearCompleted}
      />

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
