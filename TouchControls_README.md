# TouchControls 插件使用說明

## 概述

`TouchControls.js` 是一個為 RPG Maker MV 遊戲開發的移動端觸控控制系統插件。它提供了七個觸控按鈕，用於替代鍵盤輸入，讓玩家可以在手機和平板上輕鬆控制遊戲。

## 功能特性

### 七個觸控按鈕

| 按鈕名稱 | 遊戲功能 | 模擬鍵盤碼 | 視覺標籤 |
|---------|---------|----------|--------|
| **Up** | 向上移動 | 38 (↑) | ↑ |
| **Down** | 向下移動 | 40 (↓) | ↓ |
| **Left** | 向左移動 | 37 (←) | ← |
| **Right** | 向右移動 | 39 (→) | → |
| **OK** | 確認/互動 (Z 鍵) | 90 (Z) | 確認 |
| **Cancel** | 取消/選單 (X 鍵) | 88 (X) | 取消 |
| **Shift** | 快跑/特殊功能 | 16 (Shift) | 快跑 |

### 按鈕佈局

```
視窗底部佈局示意：

[方向十字鍵]                    [功能按鈕]
  ↑                          確認  取消
← ○ →                        
  ↓                           快跑
```

- **左下角**：方向十字鍵（十字鍵佈局）
- **右下角**：功能按鈕（OK, Cancel, Shift）

## 安裝步驟

1. **檔案位置確認**：確保 `TouchControls.js` 已放置在 `js/plugins/` 目錄中。

2. **插件註冊**：在 `js/plugins.js` 中已自動添加了以下條目：
   ```json
   {"name":"TouchControls","status":true,"description":"移動端觸控按鈕控制系統，提供七個觸控按鈕替代鍵盤輸入","parameters":{"Show Touch Controls":"true","Button Size":"60","Button Opacity":"0.7","Button Spacing":"5","Container Bottom Offset":"20","Container Left Offset":"20","Container Right Offset":"20"}}
   ```

3. **重新啟動遊戲**：刷新遊戲頁面，觸控按鈕應在遊戲啟動時自動出現。

## 參數配置

在 RPG Maker MV 編輯器中，可以通過「插件管理器」調整以下參數：

| 參數名稱 | 預設值 | 說明 |
|---------|--------|------|
| **Show Touch Controls** | true | 是否顯示觸控控制按鈕 |
| **Button Size** | 60 | 按鈕尺寸（像素） |
| **Button Opacity** | 0.7 | 按鈕透明度（0.0-1.0） |
| **Button Spacing** | 5 | 按鈕之間的間距（像素） |
| **Container Bottom Offset** | 20 | 容器距視窗底部的距離（像素） |
| **Container Left Offset** | 20 | 容器距視窗左側的距離（像素） |
| **Container Right Offset** | 20 | 容器距視窗右側的距離（像素） |

## API 使用

該插件暴露了全域物件 `TouchControls`，開發者可以使用以下方法動態控制觸控系統：

### 啟用觸控控制

```javascript
TouchControls.enable();
```

### 禁用觸控控制

```javascript
TouchControls.disable();
```

### 查詢啟用狀態

```javascript
if (TouchControls.isEnabled()) {
    console.log('觸控控制已啟用');
}
```

### 動態設定按鈕大小

```javascript
// 設定按鈕大小為 80 像素
TouchControls.setButtonSize(80);
```

### 動態設定按鈕透明度

```javascript
// 設定透明度為 0.9
TouchControls.setButtonOpacity(0.9);
```

## 工作原理

### 事件監聽機制

- **touchstart 事件**：當玩家按下觸控按鈕時
  - 調用 `Input.onKeyDown(keyCode)` 模擬鍵盤按下
  - 按鈕視覺狀態變化（顏色加深）

- **touchend 事件**：當玩家抬起手指時
  - 調用 `Input.onKeyUp(keyCode)` 模擬鍵盤抬起
  - 按鈕恢復原始視覺狀態

- **mousedown/mouseup 事件**：用於桌面瀏覽器調試

### 初始化過程

1. 遊戲啟動時，`SceneManager.initGraphics()` 被調用
2. 插件使用**別名（Alias）**機制覆寫此方法
3. 原始方法執行後，自動創建觸控按鈕容器
4. 按鈕與 RPG Maker MV 的 `Input` 類完全整合

## 相容性

- **RPG Maker 版本**：v1.6.2 及以上
- **瀏覽器支援**：
  - Chrome/Chromium (推薦)
  - Firefox
  - Safari
  - Edge
- **設備支援**：
  - iOS 設備（iPhone, iPad）
  - Android 設備
  - 桌面瀏覽器（用於測試）

## 視覺設計

### 按鈕外觀

- **默認狀態**：半透明黑色背景（基於 `Button Opacity` 參數）
- **按下狀態**：藍色高亮（`rgba(100, 150, 200, 0.9)`）
- **邊框**：白色半透明邊框
- **圓角**：8px 圓角設計
- **字體**：白色粗體文字

### 響應式設計

- 使用 `position: fixed` 固定在視窗底部
- 靈活佈局適應不同螢幕尺寸
- 移動設備上自動優化觸控體驗

## 調試技巧

### 開啟瀏覽器開發者工具

在遊戲執行中按 **F12** 打開開發者工具，檢查以下內容：

1. **Console 標籤**：查看是否有 JavaScript 錯誤
2. **Elements 標籤**：檢查 `touch-controls-container` 元素是否存在
3. **Network 標籤**：確認 `TouchControls.js` 已正確加載

### 檢查按鈕是否工作

在 Console 中執行：

```javascript
// 檢查容器是否存在
console.log(document.getElementById('touch-controls-container'));

// 檢查按鈕元素
console.log(document.querySelectorAll('.touch-control-button'));

// 測試 API
console.log(TouchControls.isEnabled());
```

## 常見問題

### Q1: 按鈕在某些場景不顯示怎麼辦？

**A:** 檢查以下項目：
- 確認 `Show Touch Controls` 參數設置為 `true`
- 檢查 z-index 是否被其他元素覆蓋
- 打開開發者工具檢查按鈕容器的 CSS 樣式

### Q2: 按鈕按下沒有反應怎麼辦？

**A:** 這可能是 `Input` 類的問題：
- 確認 RPG Maker MV 核心檔案未被修改
- 檢查是否有其他插件覆寫了 `Input.onKeyDown/onKeyUp`
- 嘗試在遊戲選單中手動測試鍵盤輸入

### Q3: 如何在特定場景禁用觸控按鈕？

**A:** 使用 API 進行動態控制：

```javascript
// 在事件中禁用
TouchControls.disable();

// 在某個條件下重新啟用
if (someCondition) {
    TouchControls.enable();
}
```

### Q4: 如何調整按鈕大小和位置？

**A:** 修改 `js/plugins.js` 中的參數：

```json
"parameters":{
    "Button Size":"80",              // 改為 80 像素
    "Button Opacity":"0.5",          // 改為 0.5 透明度
    "Container Bottom Offset":"50",  // 改為距底部 50 像素
    ...
}
```

## 技術細節

### 使用的 RPG Maker MV API

- `PluginManager.parameters()`：讀取插件參數
- `SceneManager.initGraphics()`：初始化圖形（別名覆寫點）
- `Input.onKeyDown(keyCode)`：模擬鍵盤按下
- `Input.onKeyUp(keyCode)`：模擬鍵盤抬起

### 擴展點

開發者可以透過覆寫 `TouchControls` 物件來擴展功能：

```javascript
// 例：添加自訂按鈕
TouchControls.addCustomButton = function(id, label, keyCode) {
    // 實現自訂邏輯
};
```

## 更新日誌

### v1.0.0 (初始發佈)

- ✅ 實現七個基本觸控按鈕
- ✅ 方向十字鍵佈局
- ✅ 功能按鈕佈局
- ✅ 完整的事件監聽系統
- ✅ 參數化配置
- ✅ 公開 API 接口
- ✅ 桌面調試支援

## 授權

此插件為開源項目，可自由使用和修改。

## 技術支援

如遇到問題，請檢查以下項目：

1. RPG Maker MV 版本是否為 v1.6.2 或以上
2. `TouchControls.js` 是否正確放置在 `js/plugins/` 目錄
3. `js/plugins.js` 是否包含正確的插件註冊條目
4. 瀏覽器是否支援觸控事件
5. 是否有其他插件與本插件衝突

---

**最後更新**：2025 年 12 月 6 日
