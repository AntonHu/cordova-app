/**
 * 存储数据到sessionStorage
 * @param name
 * @param value
 */
export const setLocalStorage = (name, value) => {
  localStorage.setItem(name, value);
};

/**
 * 从sessionStorage获取数据
 * @param name
 * @param value
 */
export const getLocalStorage = name => {
  return localStorage.getItem(name);
};

/**
 * 从sessionStorage删除保存的数据
 * @param name
 * @param value
 */
export const deleteLocalStorage = name => {
  localStorage.removeItem(name);
};
