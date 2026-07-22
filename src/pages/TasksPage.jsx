import React from 'react';
import { SearchBar } from '../components/SearchBar';
import { TaskInput } from '../components/TaskInput';
import { FilterTabs } from '../components/FilterTabs';
import { BulkActions } from '../components/BulkActions';
import { ViewToggle } from '../components/ui/ViewToggle';
import { TaskList } from '../components/TaskList';
import { KanbanView } from '../components/tasks/KanbanView';
import { CalendarView } from '../components/tasks/CalendarView';
import { GridView } from '../components/tasks/GridView';

export function TasksPage({
  tasks,
  filteredAndSortedTasks,
  dynamicCategories,
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
  moveTask,
  showToast,
  handleDeleteSingleRequest,
  handleDeleteBulkRequest,
  handleFocusTaskInput,
  taskInputContainerRef
}) {
  const visibleTaskIds = filteredAndSortedTasks.map((t) => t.id);

  return (
    <div className="w-full space-y-6">
      {/* View Switcher Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
            Tasks Workspace
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
            Manage your project backlog and interactive view modes
          </p>
        </div>

        <ViewToggle activeView={activeView} setActiveView={setActiveView} />
      </div>

      {/* Search Bar */}
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

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

      {/* Bulk Actions Bar */}
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

      {/* Active Workspace View Rendering */}
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

      {activeView === 'calendar' && (
        <CalendarView
          tasks={filteredAndSortedTasks}
          onToggleComplete={toggleComplete}
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

      {activeView === 'list' && (
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
    </div>
  );
}
