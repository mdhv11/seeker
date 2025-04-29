export const saveToLocal = (key, value) =>
    localStorage.setItem(key, JSON.stringify(value));
  
  export const loadFromLocal = (key, fallback = null) => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  };
  