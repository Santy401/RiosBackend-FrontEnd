/**
 * Formats a date string into a consistent format
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date string (YYYY-MM-DD)
 */
export const formatDate = (date) => {
  if (!date) return '-';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-';
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Sorts an array of tasks by due date
 * @param {Array} tasks - Array of task objects
 * @param {string} direction - 'asc' for ascending, 'desc' for descending
 * @returns {Array} Sorted array of tasks
 */
export const sortTasksByDueDate = (tasks, direction = 'asc') => {
  if (!Array.isArray(tasks)) return [];
  
  return [...tasks].sort((a, b) => {
    const dateA = new Date(a.dueDate).getTime();
    const dateB = new Date(b.dueDate).getTime();
    
    if (isNaN(dateA)) return 1;  // Put invalid dates at the end
    if (isNaN(dateB)) return -1; // Put invalid dates at the end
    
    return direction === 'asc' ? dateA - dateB : dateB - dateA;
  });
};

/**
 * Checks if a date is valid
 * @param {string|Date} date - The date to validate
 * @returns {boolean} True if the date is valid
 */
export const isValidDate = (date) => {
  if (!date) return false;
  const d = new Date(date);
  return !isNaN(d.getTime());
};
