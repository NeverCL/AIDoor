import { defineConfig } from "@umijs/max";

export default defineConfig({
  access: {},
  model: {},
  initialState: {},
  request: {},
  routes: [
    {
      path: "/",
      redirect: "/home",
    },
    {
      component: '@/layouts/home',
      routes: [
        {
          name: "首页",
          path: "/home",
          component: "./Home",
        },
        {
          name: "首页",
          path: "/find",
          component: "./Home",
        },
      ]
    },
    {
      name: "首页",
      path: "/my",
      component: "./My",
    },
    // {
    //   name: "权限演示",
    //   path: "/access",
    //   component: "./Access",
    // },
    // {
    //   name: " CRUD 示例",
    //   path: "/table",
    //   component: "./Table",
    // },
  ],
  icons: {

  },
  npmClient: "pnpm",
  tailwindcss: {},
  metas: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
    },
  ],
});
