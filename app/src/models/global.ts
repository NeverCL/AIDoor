// 全局共享数据示例
import api from '@/services/api';
import { useRequest } from '@umijs/max';
import { useEffect, useState } from 'react';

const useUser = () => {

  const [user, setUser] = useState<any>();

  const [isLoading, setIsLoading] = useState(true);

  const { run: requestUserInfo } = useRequest(api.user.getUserProfile, {
    manual: true,
    onSuccess: (data) => {
      setUser(data);
      setIsLoading(false);
    },
  });

  const refreshUser = async () => {
    await requestUserInfo();
  };

  useEffect(() => {
    requestUserInfo();
  }, []);

  return {
    user,
    isLoading,
    refreshUser,
  };
};

export default useUser;
