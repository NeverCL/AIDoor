import { defineConfig } from "@umijs/max";

export default defineConfig({
  access: {},
  model: {},
  initialState: {},
  request: {},
  icons: {},
  npmClient: "pnpm",
  tailwindcss: {},
  metas: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
    },
  ],
  plugins: ['@umijs/max-plugin-openapi'],
  openAPI: [
    {
      requestLibPath: "import { request } from '@umijs/max'",
      schemaPath: 'https://gw.alipayobjects.com/os/antfincdn/CA1dOm%2631B/openapi.json',
      projectName: 'api',
    },
  ],
});
