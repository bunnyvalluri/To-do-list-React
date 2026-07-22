/**
 * Validates task input title.
 * @param {string} title 
 * @param {Array} existingTasks 
 * @param {string|null} currentTaskId - ID of task being edited (to ignore self in duplicate check)
 * @returns {{ isValid: boolean, error: string|null, sanitized: string }}
 */
export const validateTaskInput = (title, existingTasks = [], currentTaskId = null) => {
  const sanitized = (title || '').trim();

  if (!sanitized) {
    return {
      isValid: false,
      error: 'Task description cannot be empty.',
      sanitized: ''
    };
  }

  if (sanitized.length > 200) {
    return {
      isValid: false,
      error: `Task title is too long (${sanitized.length}/200 characters).`,
      sanitized
    };
  }

  // Duplicate warning/check (case insensitive)
  const isDuplicate = existingTasks.some(
    (t) => t.id !== currentTaskId && t.title.trim().toLowerCase() === sanitized.toLowerCase()
  );

  if (isDuplicate) {
    return {
      isValid: true,
      error: null,
      warning: 'Note: A task with this title already exists.',
      sanitized
    };
  }

  return {
    isValid: true,
    error: null,
    sanitized
  };
};
