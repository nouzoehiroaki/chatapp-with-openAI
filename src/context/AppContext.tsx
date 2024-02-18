'use client';
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

import { auth } from '../../firebase';

type AppProviderProps = {
  children: ReactNode;
}
type AppContextType = {
  user: User | null;
  userId: string | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  selectedRoom: string | null;
  setSelectedRoom: React.Dispatch<React.SetStateAction<string | null>>;
  selectRoomName: string | null;
  setSelectRoomName: React.Dispatch<React.SetStateAction<string | null>>;

  isBlinking: boolean;
  setIsBlinking: React.Dispatch<React.SetStateAction<boolean>>;
};

const defalutContextData = {
  user: null,
  userId: null,
  setUser: () => { },
  selectedRoom: null,
  setSelectedRoom: () => { },
  selectRoomName: null,
  setSelectRoomName: () => { },

  isBlinking: false, // デフォルト値を追加
  setIsBlinking: () => { }, // デフォルトの更新関数を追加
};
const AppContext = createContext<AppContextType>(defalutContextData);

export function AppProvider({ children }: AppProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectRoomName, setSelectRoomName] = useState<string | null>(null);
  const [isBlinking, setIsBlinking] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (newUser) => {
      setUser(newUser);
      setUserId(newUser ? newUser.uid : null);
      if (!newUser) {
        router.push('/auth/login');
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);
  return <AppContext.Provider
    value={{
      user,
      userId,
      setUser,
      selectedRoom,
      setSelectedRoom,
      selectRoomName,
      setSelectRoomName,
      isBlinking,
      setIsBlinking,
    }}>
    {children}
  </AppContext.Provider>;
};
export function useAppContext() {
  return useContext(AppContext);
}