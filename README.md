# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Локальный запуск

Требования: установленный [Bun](https://bun.sh/).

```bash
# 1. Установка зависимостей
bun install

# 2. Переменные окружения
cp .env.example .env
# при необходимости поправьте VITE_GREEN_API_URL в .env

# 3. Запуск dev-сервера
bun run dev

# 4. Проверка типов и production-сборка
bun run build

# 5. Предпросмотр production-сборки
bun run preview

# 6. Линтер
bun run lint
```
