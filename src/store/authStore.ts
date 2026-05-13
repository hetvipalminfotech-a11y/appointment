import { storage } from './mmkv';
import { User } from './types';

export const login = (phone: string) => {
  const user: User = { phone };
  storage.set('currentUser', JSON.stringify(user));
  console.log("mmkv keys", storage.getAllKeys());
  console.log("saved user", storage.getString('currentUser'));

};

export const logout = () => {
  storage.remove('currentUser');
};
export const clearStorage = () => {
  storage.clearAll();

  console.log('All MMKV storage cleared');
  console.log('Remaining keys', storage.getAllKeys());
};
export const getCurrentUser = (): User | null => {
  const userStr = storage.getString('currentUser');
  if (userStr) {
    return JSON.parse(userStr) as User;
  }
  return null;
};
