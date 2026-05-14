import { storage } from './mmkv';
import { User } from './types';

export const login = (phone: string) => {
  const user: User = { phone };
  storage.set('currentUser', JSON.stringify(user));
};

export const logout = () => {
  storage.remove('currentUser');
};
export const getCurrentUser = (): User | null => {
  const userStr = storage.getString('currentUser');
  if (userStr) {
    return JSON.parse(userStr) as User;
  }
  return null;
};
