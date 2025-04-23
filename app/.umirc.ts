import { defineConfig } from "@umijs/max";

export default defineConfig({
  access: {},
  model: {},
  initialState: {},
  request: {
    dataField: '',
  },
  icons: {},
  npmClient: "pnpm",
  tailwindcss: {},
  metas: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
    },
  ],
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true,
    },
  },
});
