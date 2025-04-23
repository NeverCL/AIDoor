// 运行时配置

import { RequestConfig } from "@umijs/max";
import { Toast } from "antd-mobile";
// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{ name: string }> {
  return { name: '@umijs/max' };
}

// export const layout = () => {
//   return {
//     logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
//     menu: {
//       locale: false,
//     },
//   };
// };

const baseUrl = process.env.NODE_ENV === 'development' ? 'http://192.168.20.157:8000' : 'https://api.thedoorofai.com';

export const request: RequestConfig = {
  timeout: 3000,
  // other axios options you want
  errorConfig: {
    errorHandler() {
    },
    errorThrower() {
    }
  },
  requestInterceptors: [
    (config: any) => {
      const url = baseUrl + config.url;
      return { ...config, url };
    }
  ],
  responseInterceptors: [
    [
      (response) => { return response },

      (error) => {
        Toast.show(error.message);
        return Promise.reject(error);
      }
    ],
  ]
};