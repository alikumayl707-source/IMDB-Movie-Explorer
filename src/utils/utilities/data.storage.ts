export const setDataStorage = (key: string, value: string) => {
  sessionStorage.setItem(key, value);
};

export const getDataStorage = (key: string) : string | null => {
  return sessionStorage.getItem(key);
};

export const clearDataStorage = () => {
  sessionStorage.clear();
};


