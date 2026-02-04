<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Lucky Group - Group & Draw

這是一個基於 React、TypeScript 和 Vite 建構的現代前端專案。

View your app in AI Studio: https://ai.studio/apps/drive/1vTopwbD3cgI2Tc5xiTtbHxuHbyWlTuoX

## 功能特色

- ⚡️ **Vite**: 極速的開發伺服器與構建工具。
- 📘 **TypeScript**: 提供強型別檢查，提升開發體驗與代碼品質。
- 🎨 **Modern React**: 使用 React 19 與 Hooks。
- 🛠 **ESLint**: 代碼品質檢查。
- 🚀 **GitHub Actions**: 自動化測試與構建流程。

## 專案結構

- `src/`: 原始碼目錄
- `public/`: 靜態資源
- `.github/workflows/`: CI/CD 配置
- `.gitignore`: Git 忽略清單

## 開始使用

### 前置需求

確保您的電腦已安裝 [Node.js](https://nodejs.org/) (建議使用 v20 或更高版本)。

### 安裝依賴

```bash
npm install
```

### 設定環境變數

如果需要，請在根目錄建立 `.env` 檔案（參考 `.env.example`，如果有的話）。
本專案可能需要 `GEMINI_API_KEY`，請在 `.env.local` 中設定。

### 啟動開發伺服器

```bash
npm run dev
```

### 構建生產版本

```bash
npm run build
```
構建後的檔案將位於 `dist/` 目錄。

### 代碼檢查

```bash
npm run lint
```
