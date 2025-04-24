// 全局共享数据示例
import api from '@/services/api';
import { useRequest } from '@umijs/max';
import { useState } from 'react';

const useUser = () => {

  const [user, setUser] = useState<any>();

  const { run: requestUserInfo } = useRequest(api.user.getUserProfile, {
    manual: true,
    onSuccess: (data) => {
      setUser(data);
    },
  });

  const refreshUser = async () => {
    await requestUserInfo();
  };

  return {
    user,
    refreshUser,
  };
};

export default useUser;
