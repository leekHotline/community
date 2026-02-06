# 前端和后端信息透明,通过D:\develop\shared\community-docs对接接口，共享信息

## 示例 AGENTS.md 文件
**使用pnpm作为node包管理工具**

关键词解释:

**nextjs 是基于react的全栈框架 服务器端渲染**

app目录下page.tsx是主页面 app目录下新建的文件夹的page.tsx是文件夹名称路由页面

app目录下api目录下routes.ts是后端接口 api目录下新建的文件夹是模块化接口

**honojs是express风格的后端接口框架** 中间件如鉴权/日志可以指定挂载全局或者指定路由组 对于路由拆分和中间件复用很方便

**tailwindcss是开箱即用的css库**，不用写css文件，直接在class里面拼简短的模块化样式

**farmer-motion是基于react的动画库**,入场动画，交错动画，过渡动画，悬浮缩放动画，弹出动画等

**gasp主要做基于鼠标滚动的滚动动画**

**shadcn/ui 是基于react的ui组件模板**，直接把代码拷贝到项目根目录，不要和其它库操控同一dom元素容易报错或者效果异常

**vitest是基于js/ts的测试框架**，想pytest一样可以写测试用例

**supabase是云端数据库**，相较于neon，supabase自带auth认证和ui面板数据可视化

**vercel的ai-sdk兼容各家llm的接口**，流式响应，工具调用封装顺滑

## 开发环境提示
- 使用pnpm管理包依赖，vitest测试,typescript编写接口,

- 使用 `pnpm dlx turbo run where community` 直接跳转到目标包，而不是使用 `ls` 扫描。

- 运行 `pnpm install --filter community` 将包添加到工作区，以便 Vite、ESLint 和 TypeScript 可以识别它。

- 使用 `pnpm create vite@latest community -- --template react-ts` 创建一个新的 React + Vite 包，并启用 TypeScript 检查。

- 检查每个包的 package.json 文件中的 name 字段，确认名称是否正确——跳过顶层包。

## 测试说明

- 在 .github/workflows 文件夹中找到 CI 计划。

- 运行 `pnpm turbo run test --filter community` 运行该包定义的所有检查。

- 在包根目录下，可以直接运行 `pnpm test`。提交应该通过所有测试后再合并。

- 要专注于某个步骤，请添加 Vitest 模式：`pnpm vitest run -t "<测试名称>"`。

- 修复所有测试或类型错误，直到整个测试套件都通过为止。

- 移动文件或更改导入后，运行 `pnpm lint --filter <项目名称>` 以确保 ESLint 和 TypeScript 规则仍然有效。

- 为更改的代码添加或更新测试，即使没有人要求。

## PR 说明

- 标题格式：[<项目名称>] <标题>

- 提交之前，务必运行 `pnpm lint` 和 `pnpm test`。