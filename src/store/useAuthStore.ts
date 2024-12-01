import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  username: string;
  nickname?: string;
  email?: string;
  phone?: string;
  department?: string;
  position?: string;
  role: 'admin' | 'user';
}

interface AuthStore {
  user: User | null;
  login: (username: string, password: string, role: 'admin' | 'user') => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      login: async (username, password, role) => {
        // 模拟登录API调用
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (username === 'admin' && password === 'admin' && role === 'admin') {
          set({ 
            user: { 
              id: '1', 
              username: 'admin',
              nickname: '管理员',
              email: 'admin@example.com',
              phone: '13800138000',
              department: '技术部',
              position: '系统管理员',
              role: 'admin' 
            } 
          });
          return true;
        } else if (username === 'user' && password === 'user' && role === 'user') {
          set({ 
            user: { 
              id: '2', 
              username: 'user',
              nickname: '测试用户',
              email: 'user@example.com',
              phone: '13800138001',
              department: '产品部',
              position: '产品经理',
              role: 'user' 
            } 
          });
          return true;
        }
        return false;
      },
      logout: () => {
        set({ user: null });
      },
      updateProfile: async (data) => {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 确保不能修改用户名和角色
        const { username, role, ...updatableData } = data;
        
        set((state) => ({
          user: state.user ? {
            ...state.user,
            ...updatableData
          } : null
        }));
      },
    }),
    {
      name: 'auth-storage',
      // 添加版本控制，当存储结构改变时可以重置存储
      version: 1,
      // 可选：迁移函数，用于处理版本更新
      migrate: (persistedState: any, version: number) => {
        return persistedState;
      },
    }
  )
); 