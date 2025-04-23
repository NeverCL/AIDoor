import { defineConfig } from "@umijs/max";

export default defineConfig({
  plugins: ['@umijs/max-plugin-openapi'],
  openAPI: [
    {
      requestLibPath: "import { request } from '@umijs/max'",
      schemaPath: 'http://localhost:5000/openapi/v1.json',
      projectName: 'api',
    },
  ]
});
