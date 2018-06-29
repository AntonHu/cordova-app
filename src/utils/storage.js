/**
 * 存储数据到sessionStorage
 * @param name
 * @param value
 */
export const setSessionStorage = (name, value) => {
  localStorage.setItem(name, value);
};

/**
 * 从sessionStorage获取数据
 * @param name
 * @param value
 */
export const getSessionStorage = name => {
  return localStorage.getItem(name);
};

/**
 * 从sessionStorage删除保存的数据
 * @param name
 * @param value
 */
export const deleteSessionStorage = name => {
  localStorage.removeItem(name);
};
