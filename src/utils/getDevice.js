
export const getDeviceWidth = () => {
  return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
};

export const getDeviceHeight = () => {
  return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
};

export const px = (size) => {
  return size * getDeviceWidth() / UI_PAGE_WIDTH;
};

export const UI_PAGE_WIDTH = 750;
