# RPG Maker MV 遊戲專案指南

## 專案架構

這是一個使用 **RPG Maker MV** 引擎開發的視覺小說/AVG 遊戲，名為「少女莎草紙」。專案使用 JavaScript 作為腳本語言，並整合了 Steam API 和多個自定義插件系統。

### 核心引擎結構
- **引擎版本**: RPG Maker MV (v1.6.2)
- **渲染器**: PixiJS (含 pixi-tilemap, pixi-picture 擴展)
- **主要框架文件**: `js/rpg_*.js` (rpg_core.js, rpg_managers.js, rpg_objects.js, rpg_scenes.js, rpg_sprites.js, rpg_windows.js)
- **入口點**: `index.html` → `js/main.js` → `Scene_Boot`

### 目錄結構與用途
```
data/           遊戲數據文件 (JSON 格式)
├── System.json       系統設定、開關、變數定義
├── Map*.json         地圖數據和事件
├── Actors.json       角色定義
└── Items.json        道具定義

js/
├── libs/             第三方庫 (pixi.js, greenworks.js 等)
├── plugins/          插件系統 (見下方插件列表)
├── rpg_*.js          RPG Maker MV 核心框架
└── main.js           應用入口

audio/                音頻資源
├── bgm/              背景音樂
├── bgs/              環境音效
├── se/               音效
└── voice/            語音 (支援中文/日文)

img/                  圖像資源 (加密: .rpgmvp)
fonts/                字體文件
save/                 存檔目錄
```

## 關鍵插件系統

### 已啟用的核心插件 (按 `js/plugins.js` 載入順序)
1. **Community_Basic**: 基本參數設定 (解析度 1280×720)
2. **YEP_MessageCore + YEP_X_ExtMesPack1**: 訊息系統增強
3. **GALV_MessageStyles**: 訊息樣式自定義
4. **ChineseName**: 中文輸入支援
5. **UTA_CommonSave**: 共通存檔系統 (開關 181-240, 變數 53, 292-299 等跨存檔共享)
6. **Chimaki_AvgMenuBase**: AVG 風格選單系統
7. **STLLAw_VoiceSystem**: 語音播放系統
8. **OrangeGreenworks**: Steam 整合 (成就、雲端存檔)

### 插件配置修改
- 編輯 `js/plugins.js` 中的 `$plugins` 陣列
- 插件參數以 JSON 格式定義在 `parameters` 欄位
- 停用插件設置 `"status": false`

## 開發工作流程

### 本地測試
```bash
# 使用 http-server 啟動 (當前已運行)
http-server

# 或使用 Python 簡單伺服器
python -m http.server 8000
```
訪問 `http://localhost:8080` (或對應埠) 進行測試。

### 資源加密
- 圖像文件使用 `.rpgmvp` 加密格式
- 音頻文件使用 `.rpgmvo` 和 `.rpgmvm` 加密格式
- 加密金鑰在 `data/System.json` 的 `encryptionKey` 欄位

### Steam 整合
- Steam App ID: `1745260` (定義於 `steam_appid.txt`)
- Greenworks 插件處理成就系統
- 需要 `greenworks.js` 和對應平台的 `.node` 文件

## 遊戲數據結構

### 開關與變數系統 (`data/System.json`)
- **共通存檔開關**: 181-240, 334, 401-410, 420, 476
- **共通存檔變數**: 53, 292-299, 300, 371-399, 461-476
- **關鍵變數**:
  - 變數 1: 主線進度
  - 變數 2: 頁面編號
  - 變數 28: 遊戲版本 (1=R18, 2=配信版, 3=Steam版)
  - 變數 80: 多國語言

### 地圖系統 (`data/MapInfos.json`)
- 地圖按樓層和區域組織 (1F/2F, 室內/室外)
- 關鍵地圖: Map027 (1F), Map007 (2F), Map036 (起始位置)

## 編碼規範

### JavaScript 約定
- 使用 RPG Maker MV 的類別繼承模式 (原型鏈)
- 全域物件前綴: `$` (如 `$gameSystem`, `$gameVariables`)
- 插件命名空間: `PluginManager.parameters('插件名稱')`

### 多語言支援
- 主要支援: 繁體中文 (zh_TW), 日文, 英文
- 字體配置在 `fonts/` 和插件參數中
- 語音系統支援切換中文/日文聲優 (變數 52)

### 事件編碼慣例
- 使用開關控制劇情流程和 UI 狀態
- 變數用於數值計算和位置追蹤
- 避免修改核心引擎文件 (`rpg_*.js`)，使用插件擴展功能

## 常見任務

### 新增插件
1. 將 `.js` 文件放入 `js/plugins/`
2. 在 `js/plugins.js` 的 `$plugins` 陣列中註冊
3. 設定 `status: true` 並配置 `parameters`

### 修改遊戲內容
- **對話/劇情**: 編輯對應的 `data/Map*.json` 事件
- **UI 文字**: 修改 `data/System.json` 的 `terms` 欄位
- **角色/道具**: 編輯 `data/Actors.json` 或 `data/Items.json`

### 調試技巧
- 按 F8 開啟開發者工具
- 使用 `console.log()` 輸出調試訊息
- 檢查 `js/plugins/` 中的插件錯誤

## 注意事項

- **不要**直接修改 `data/` 下由 RPG Maker MV 編輯器生成的文件，除非了解其結構
- **不要**刪除 `greenworks` 相關文件 (Steam 版本依賴)
- 新增自訂功能優先使用插件系統而非修改核心文件
- 測試時確保 `save/` 目錄可寫入
- 版本號記錄在根目錄的 `Version *.txt` 文件中
