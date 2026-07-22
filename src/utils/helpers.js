import confetti from 'canvas-confetti';

/**
 * Formats a ISO date string or timestamp into a friendly human-readable format.
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const isTomorrow = date.toDateString() === tomorrow.toDateString();

  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (isToday) return `Today at ${timeStr}`;
  if (isYesterday) return `Yesterday at ${timeStr}`;
  if (isTomorrow) return `Tomorrow at ${timeStr}`;

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
};

/**
 * Formats due dates and returns status flags
 */
export const getDueDateInfo = (dueDateStr) => {
  if (!dueDateStr) return { formatted: null, isOverdue: false, isDueToday: false };

  const due = new Date(dueDateStr);
  due.setHours(23, 59, 59, 999);
  
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  const isDueToday = due >= todayStart && due <= todayEnd;
  const isOverdue = due < todayStart;

  const formatted = due.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

  return { formatted, isOverdue, isDueToday };
};

/**
 * Triggers confetti animation
 */
export const triggerConfetti = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#6366f1', '#a855f7', '#ec4899', '#10b981', '#f59e0b']
  });
};

/**
 * Exports tasks as a JSON file download
 */
export const exportTasksToJSON = (tasks) => {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tasks, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  const timestamp = new Date().toISOString().slice(0, 10);
  downloadAnchor.setAttribute('download', `taskflow-export-${timestamp}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};

/**
 * Imports tasks from JSON file string
 */
export const parseTasksJSON = (jsonString) => {
  try {
    const parsed = JSON.parse(jsonString);
    if (!Array.isArray(parsed)) throw new Error('Export file must contain an array of tasks.');
    
    // Basic task shape validation & migration
    const validatedTasks = parsed.filter(item => typeof item === 'object' && item !== null && typeof item.title === 'string').map(t => ({
      id: t.id || `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: t.title.trim().slice(0, 200),
      completed: Boolean(t.completed),
      priority: ['High', 'Medium', 'Low'].includes(t.priority) ? t.priority : 'Medium',
      category: t.category || 'Personal',
      pinned: Boolean(t.pinned),
      favorite: Boolean(t.favorite),
      dueDate: t.dueDate || null,
      createdAt: t.createdAt || new Date().toISOString(),
      completedAt: t.completedAt || null,
      order: typeof t.order === 'number' ? t.order : Date.now()
    }));

    return { success: true, tasks: validatedTasks };
  } catch (err) {
    return { success: false, error: err.message || 'Invalid JSON format.' };
  }
};

/**
 * Triggers document print
 */
export const printTaskList = () => {
  window.print();
};

/**
 * Copies text to clipboard with fallback
 */
export const copyToClipboard = async (text) => {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return true;
  } else {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    textArea.remove();
    return successful;
  }
};
