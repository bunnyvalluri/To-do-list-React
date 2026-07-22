import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from './hooks/useTheme';
import { useTasks } from './hooks/useTasks';
import { useCommandPalette } from './hooks/useCommandPalette';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Footer } from './components/Footer';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { TasksPage } from './pages/TasksPage';
import { CalendarPage } from './pages/CalendarPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { FocusPage } from './pages/FocusPage';
import { SettingsPage } from './pages/SettingsPage';

// Common Modals & Overlays
import { CommandPalette } from './components/common/CommandPalette';
import { TaskCreationModal } from './components/tasks/TaskCreationModal';
import { DeleteModal } from './components/DeleteModal';
import { ToastSnackbar } from './components/ToastSnackbar';
import { parseTasksJSON, exportTasksToJSON } from './utils/helpers';

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
    toastMessage,
    clearToast,
    showToast
  } = useTasks();

  const { isOpen: isCommandPaletteOpen, open: openCommandPalette, close: closeCommandPalette, toggle: toggleCommandPalette } = useCommandPalette();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const fileInputRef = useRef(null);
  const taskInputContainerRef = useRef(null);

  // Delete Modal state
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
    setActivePage('tasks');
    setTimeout(() => {
      const inputEl = taskInputContainerRef.current?.querySelector('input[type="text"]');
      if (inputEl) {
        inputEl.focus();
        inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex transition-colors duration-300 selection:bg-indigo-500 selection:text-white">
      {/* Hidden File Input for JSON import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileImportChange}
        accept=".json,application/json"
        className="hidden"
      />

      {/* Desktop Collapsible Sidebar */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        stats={stats}
        onOpenTaskModal={() => setIsTaskModalOpen(true)}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col items-center px-3 sm:px-8 py-4 overflow-y-auto max-w-full">
        <div className="w-full max-w-6xl flex flex-col flex-1">
          {/* Sticky Header */}
          <Header
            theme={theme}
            toggleTheme={toggleTheme}
            tasks={tasks}
            activePage={activePage}
            setActivePage={setActivePage}
            onOpenCommandPalette={openCommandPalette}
            onImportClick={() => fileInputRef.current?.click()}
          />

          {/* Active Page View */}
          <main className="flex-1 w-full">
            {activePage === 'dashboard' && (
              <DashboardPage
                stats={stats}
                tasks={tasks}
                onOpenTaskModal={() => setIsTaskModalOpen(true)}
                setActivePage={setActivePage}
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

            {activePage === 'tasks' && (
              <TasksPage
                tasks={tasks}
                filteredAndSortedTasks={filteredAndSortedTasks}
                dynamicCategories={dynamicCategories}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                sortOption={sortOption}
                setSortOption={setSortOption}
                activeView={activeView}
                setActiveView={setActiveView}
                selectedTaskIds={selectedTaskIds}
                toggleSelectTask={toggleSelectTask}
                selectAll={selectAll}
                deselectAll={deselectAll}
                addTask={addTask}
                editTask={editTask}
                deleteTask={deleteTask}
                toggleComplete={toggleComplete}
                updateTaskStatus={updateTaskStatus}
                addSubtask={addSubtask}
                toggleSubtask={toggleSubtask}
                deleteSubtask={deleteSubtask}
                duplicateTask={duplicateTask}
                togglePin={togglePin}
                toggleFavorite={toggleFavorite}
                bulkComplete={bulkComplete}
                bulkDelete={bulkDelete}
                clearCompleted={clearCompleted}
                moveTask={moveTask}
                showToast={showToast}
                handleDeleteSingleRequest={handleDeleteSingleRequest}
                handleDeleteBulkRequest={handleDeleteBulkRequest}
                handleFocusTaskInput={handleFocusTaskInput}
                taskInputContainerRef={taskInputContainerRef}
              />
            )}

            {activePage === 'calendar' && (
              <CalendarPage tasks={tasks} toggleComplete={toggleComplete} />
            )}

            {activePage === 'analytics' && (
              <AnalyticsPage tasks={tasks} stats={stats} />
            )}

            {activePage === 'focus' && (
              <FocusPage />
            )}

            {activePage === 'settings' && (
              <SettingsPage
                theme={theme}
                toggleTheme={toggleTheme}
                tasks={tasks}
                onImportClick={() => fileInputRef.current?.click()}
                onClearCompleted={clearCompleted}
                showToast={showToast}
              />
            )}
          </main>

          {/* Minimal SaaS Footer */}
          <Footer totalTasks={stats.total} completedTasks={stats.completed} />
        </div>
      </div>

      {/* Global Command Palette Overlay (Ctrl + K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={closeCommandPalette}
        onOpenTaskModal={() => setIsTaskModalOpen(true)}
        setActivePage={setActivePage}
        toggleTheme={toggleTheme}
        theme={theme}
        onExport={() => exportTasksToJSON(tasks)}
        onImportClick={() => fileInputRef.current?.click()}
        onClearCompleted={clearCompleted}
      />

      {/* Task Creation Modal */}
      <TaskCreationModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onAddTask={addTask}
        categories={dynamicCategories}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={deleteModalConfig.isOpen}
        onClose={() => setDeleteModalConfig({ isOpen: false, mode: 'single', targetId: null })}
        onConfirm={handleConfirmDeleteModal}
        count={deleteModalConfig.mode === 'bulk' ? selectedTaskIds.length : 1}
      />

      {/* Toast Notifications Snackbar */}
      <ToastSnackbar toast={toastMessage} onClose={clearToast} />
    </div>
  );
}
