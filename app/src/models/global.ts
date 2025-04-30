// 全局共享数据示例
import api from '@/services/api';
import { useRequest } from '@umijs/max';
import { useEffect, useState } from 'react';

// 定义用户接口
interface User {
  id: number;
  username: string;
  phoneNumber: string;
  avatarUrl: string;
  isDevMode: boolean;
  // 其他属性...
}

const useUser = () => {
  const [user, setUser] = useState<User | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  const { run: requestUserInfo } = useRequest(api.user.getUserProfile, {
    manual: false,
    onSuccess: (response) => {
      setUser(response);
      setIsLoading(false);
    },
    onError: (error) => {
      setIsLoading(false);
    },
  });

  const { run: switchUserMode } = useRequest(api.user.postUserSwitchMode, {
    manual: true,
    onSuccess: (response) => {
      setUser({ ...user, isDevMode: !user?.isDevMode });
    }
  });

  const refreshUser = async () => {
    await requestUserInfo();
  };

  const switchUser = async () => {
    // 直接调用API切换身份
    await switchUserMode();
  };

  return {
    user,
    isLoading,
    switchUserMode,
    refreshUser,
    switchUser,
  };
};

export default useUser;
