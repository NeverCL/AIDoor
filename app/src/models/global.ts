// 全局共享数据示例
import { useState } from 'react';

const useUser = () => {
  console.log('useUser');

  const [user, setUser] = useState<any>({
    isDev: false,
  });

  const refreshUser = async () => {
    // const res = await getUserInfo();

    // setUser({
    //   isDev: true,
    // });
  };

  return {
    user,
    refreshUser,
  };
};

export default useUser;
