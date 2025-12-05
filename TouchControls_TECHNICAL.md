# TouchControls 插件 - 實現細節文檔

## 目錄

1. [架構設計](#架構設計)
2. [核心函數說明](#核心函數說明)
3. [事件流程](#事件流程)
4. [CSS 樣式系統](#css-樣式系統)
5. [擴展指南](#擴展指南)

---

## 架構設計

### 模組結構

```
TouchControls.js
├── 插件頭部文檔
│   ├── @plugindesc
│   ├── @param (7 個參數定義)
│   └── @help
├── IIFE (立即執行函式)
│   ├── 配置常數 (CONFIG, BUTTON_CONFIG)
│   ├── 核心函數
│   │   ├── initializeTouchControls()
│   │   ├── createControlsContainer()
│   │   ├── createDirectionButtons()
│   │   ├── createFunctionButtons()
│   │   ├── createButton()
│   │   ├── attachButtonEvents()
│   │   └── injectStyles()
│   ├── 別名覆寫
│   │   └── SceneManager.initGraphics
│   └── 公開 API (window.TouchControls)
```

### 設計模式

#### 1. **即時執行函式表達式 (IIFE)**

```javascript
(function() {
    // 私有作用域
    // 所有變數和函數都被限制在此作用域內
    // 避免污染全域命名空間
})();
```

**優點**：
- 變數隔離
- 避免命名衝突
- 符合 RPG Maker MV 插件最佳實踐

#### 2. **別名模式 (Alias)**

```javascript
const _SceneManager_initGraphics = SceneManager.initGraphics;
SceneManager.initGraphics = function() {
    _SceneManager_initGraphics.call(this);  // 調用原始方法
    initializeTouchControls();              // 執行自訂邏輯
};
```

**優點**：
- 保留原始功能
- 避免直接修改核心檔案
- 與其他插件相容

#### 3. **配置對象模式**

```javascript
const CONFIG = {
    enabled: true,
    buttonSize: 60,
    buttonOpacity: 0.7,
    // ...
};

const BUTTON_CONFIG = {
    up: { id: 'TC_Up', keyCode: 38, label: '↑' },
    // ...
};
```

**優點**：
- 集中管理配置
- 易於調整參數
- 易於擴展

---

## 核心函數說明

### 1. initializeTouchControls()

**作用**：初始化整個觸控控制系統

```javascript
function initializeTouchControls() {
    if (touchControlsInitialized || !CONFIG.enabled) return;

    const container = createControlsContainer();
    createDirectionButtons(container);
    createFunctionButtons(container);

    document.body.appendChild(container);
    touchControlsInitialized = true;
}
```

**執行流程**：
1. 檢查是否已初始化或已禁用
2. 創建容器元素
3. 創建方向按鈕
4. 創建功能按鈕
5. 將容器添加到 DOM
6. 標記為已初始化

**調用時機**：
- SceneManager 初始化圖形時自動調用
- 遊戲啟動後立即執行

### 2. createControlsContainer()

**作用**：創建觸控控制的主容器

```javascript
function createControlsContainer() {
    const container = document.createElement('div');
    container.id = 'touch-controls-container';
    
    const style = container.style;
    style.position = 'fixed';
    style.bottom = CONFIG.bottomOffset + 'px';
    style.left = CONFIG.leftOffset + 'px';
    style.right = CONFIG.rightOffset + 'px';
    style.display = 'flex';
    style.justifyContent = 'space-between';
    style.pointerEvents = 'auto';
    style.zIndex = '10000';
    
    injectStyles();
    return container;
}
```

**CSS 屬性說明**：

| 屬性 | 值 | 說明 |
|-----|-----|------|
| `position` | fixed | 固定在視窗 |
| `bottom` | 20px | 距底部距離 |
| `left` | 20px | 距左側距離 |
| `right` | 20px | 距右側距離 |
| `display` | flex | 彈性佈局 |
| `justifyContent` | space-between | 子元素兩端對齊 |
| `zIndex` | 10000 | 保持在最上層 |

### 3. createDirectionButtons()

**作用**：使用 CSS Grid 創建方向十字鍵

```javascript
function createDirectionButtons(container) {
    const directionGroup = document.createElement('div');
    directionGroup.className = 'touch-controls-group direction-group';
    
    // CSS Grid 佈局：3x3 網格
    // 按鍵位置：
    // [ 空  ↑  空 ]
    // [ ←  空  → ]
    // [ 空  ↓  空 ]
    
    style.display = 'grid';
    style.gridTemplateColumns = `${CONFIG.buttonSize}px ... ${CONFIG.buttonSize}px`;
    style.gridTemplateRows = `${CONFIG.buttonSize}px ... ${CONFIG.buttonSize}px`;
}
```

**Grid 佈局示例**：

```
Grid 網格 (3×3)：

Column: 1           2           3
Row 1:  [空]        [↑]         [空]
Row 2:  [←]         [空]        [→]
Row 3:  [空]        [↓]         [空]
```

**優點**：
- 精確的按鈕位置控制
- 十字鍵形狀自然呈現
- 中央空位防止誤觸

### 4. createFunctionButtons()

**作用**：創建功能按鈕佈局

```javascript
function createFunctionButtons(container) {
    const functionGroup = document.createElement('div');
    functionGroup.style.display = 'flex';
    functionGroup.style.flexDirection = 'column';
    
    // 上行：OK 和 Cancel
    const topRow = document.createElement('div');
    topRow.appendChild(okBtn);
    topRow.appendChild(cancelBtn);
    functionGroup.appendChild(topRow);
    
    // 下行：Shift (寬度 = 2個按鈕)
    shiftBtn.style.width = (CONFIG.buttonSize * 2 + CONFIG.buttonSpacing) + 'px';
    functionGroup.appendChild(shiftBtn);
}
```

**佈局結構**：

```
Flex 容器 (flexDirection: column)
├── topRow (flex)
│   ├── OK 按鈕
│   └── Cancel 按鈕
└── Shift 按鈕 (寬度加倍)
```

### 5. createButton()

**作用**：創建單個按鈕元素

```javascript
function createButton(config) {
    const button = document.createElement('button');
    button.id = config.id;
    button.textContent = config.label;
    
    // 設置 CSS 樣式
    button.style.width = CONFIG.buttonSize + 'px';
    button.style.height = CONFIG.buttonSize + 'px';
    button.style.backgroundColor = 'rgba(0, 0, 0, ' + CONFIG.buttonOpacity + ')';
    button.style.border = '2px solid rgba(255, 255, 255, 0.5)';
    button.style.borderRadius = '8px';
    
    attachButtonEvents(button, config);
    return button;
}
```

**樣式優先級**：

1. 內聯樣式 (JavaScript 設置) - 最高優先級
2. 全域樣式表 (injectStyles 創建的)
3. 瀏覽器預設樣式

### 6. attachButtonEvents()

**作用**：為按鈕綁定觸控和鼠標事件

```javascript
function attachButtonEvents(button, config) {
    if (button.dataset.eventsAttached) return;  // 防止重複綁定
    button.dataset.eventsAttached = 'true';

    // touchstart：按下
    button.addEventListener('touchstart', function(e) {
        e.preventDefault();
        Input.onKeyDown(config.keyCode);
        button.style.backgroundColor = 'rgba(100, 150, 200, 0.9)';
    });

    // touchend：抬起
    button.addEventListener('touchend', function(e) {
        e.preventDefault();
        Input.onKeyUp(config.keyCode);
        button.style.backgroundColor = 'rgba(0, 0, 0, ' + CONFIG.buttonOpacity + ')';
    });
}
```

**事件處理流程**：

```
觸控按鈕
  │
  ├─→ touchstart
  │   ├─ e.preventDefault()     (阻止瀏覽器預設行為)
  │   ├─ Input.onKeyDown(...)  (模擬按鍵)
  │   └─ 視覺反饋 (顏色變化)
  │
  └─→ touchend
      ├─ e.preventDefault()     (阻止瀏覽器預設行為)
      ├─ Input.onKeyUp(...)    (模擬按鍵釋放)
      └─ 恢復視覺狀態
```

### 7. injectStyles()

**作用**：注入全局 CSS 樣式表

```javascript
function injectStyles() {
    if (document.getElementById('touch-controls-style')) return;  // 避免重複注入

    const style = document.createElement('style');
    style.id = 'touch-controls-style';
    style.textContent = `
        .touch-control-button:active {
            background-color: rgba(100, 150, 200, 0.9) !important;
            transform: scale(0.95);
        }
        
        @media (max-width: 768px) {
            .touch-control-button {
                -webkit-touch-callout: none;
            }
        }
    `;
    document.head.appendChild(style);
}
```

**注入內容**：

| 樣式規則 | 作用 |
|---------|------|
| `.touch-control-button:active` | 按鈕被按下時的視覺反饋 |
| `transform: scale(0.95)` | 按鈕縮小效果 |
| `@media (max-width: 768px)` | 移動設備最佳化 |

---

## 事件流程

### 完整的按鈕交互流程

```
用戶按下按鈕
  │
  ├─→ touchstart 事件觸發
  │   ├─ 檢查 e 對象
  │   ├─ 執行 e.preventDefault()
  │   │   └─ 阻止頁面滾動、縮放等預設行為
  │   ├─ 調用 Input.onKeyDown(keyCode)
  │   │   └─ RPG Maker MV 更新鍵盤狀態
  │   ├─ 更新按鈕樣式 (視覺反饋)
  │   └─ 按鈕 CSS :active 偽類被激活
  │
  ├─→ 用戶手指在按鈕上
  │   └─ 多個 touchmove 事件（被阻止）
  │
  ├─→ 用戶抬起手指
  │   └─ touchend 事件觸發
  │       ├─ 執行 e.preventDefault()
  │       ├─ 調用 Input.onKeyUp(keyCode)
  │       │   └─ RPG Maker MV 清除鍵盤狀態
  │       └─ 恢復按鈕樣式
  │
  └─→ 遊戲邏輯響應
      └─ Input 類返回正確的鍵盤狀態
```

### Input 類集成

```javascript
// RPG Maker MV 的 Input 類會管理鍵盤狀態
// 我們的插件通過調用以下方法來模擬鍵盤輸入

Input.onKeyDown(keyCode);  // 模擬鍵盤按下
Input.onKeyUp(keyCode);    // 模擬鍵盤抬起

// Input 類會自動更新其內部狀態
// 遊戲邏輯可以通過以下方式查詢鍵盤狀態：
if (Input.isPressed('up')) {
    // 角色向上移動
}
```

---

## CSS 樣式系統

### 色彩方案

| 狀態 | RGB | 說明 |
|-----|-----|------|
| **默認** | rgba(0, 0, 0, 0.7) | 半透明黑色 |
| **按下** | rgba(100, 150, 200, 0.9) | 藍色高亮 |
| **邊框** | rgba(255, 255, 255, 0.5) | 白色半透明 |

### 響應式設計

#### 桌面模式（≥769px）
- 完整顯示所有按鈕
- 標準大小（預設 60px）
- 標準透明度

#### 移動模式（≤768px）
```css
@media (max-width: 768px) {
    .touch-control-button {
        -webkit-user-select: none;
        -webkit-touch-callout: none;
    }
}
```

**最佳化**：
- 禁用 iOS 長按菜單
- 禁用文本選擇
- 保證觸控響應性

---

## 擴展指南

### 方式 1：使用公開 API

```javascript
// 動態啟用/禁用
TouchControls.enable();
TouchControls.disable();

// 調整按鈕大小
TouchControls.setButtonSize(80);

// 調整透明度
TouchControls.setButtonOpacity(0.5);

// 查詢狀態
if (TouchControls.isEnabled()) {
    console.log('觸控控制已啟用');
}
```

### 方式 2：修改配置對象

```javascript
// 在 TouchControls.js 中直接修改 CONFIG
const CONFIG = {
    buttonSize: 80,              // 改為 80px
    buttonOpacity: 0.5,          // 改為 50% 透明度
    bottomOffset: 50,            // 改為距底部 50px
};
```

### 方式 3：創建自訂按鈕

可以擴展 `BUTTON_CONFIG`：

```javascript
const BUTTON_CONFIG = {
    // 既有按鈕...
    custom: { 
        id: 'TC_Custom', 
        keyCode: 81,  // Q 鍵
        label: '自訂' 
    }
};
```

### 方式 4：自訂樣式

修改 `injectStyles()` 函數中的 CSS：

```javascript
style.textContent = `
    .touch-control-button {
        background: linear-gradient(...);  /* 自訂背景 */
        box-shadow: 0 0 10px rgba(...);    /* 陰影效果 */
    }
`;
```

---

## 除錯技巧

### 1. 監視事件觸發

```javascript
// 在瀏覽器 Console 中執行
document.getElementById('TC_Up').addEventListener('touchstart', () => {
    console.log('Up 按鈕被按下');
});
```

### 2. 檢查 Input 類狀態

```javascript
// 查詢鍵盤狀態
console.log(Input._currentState);  // 當前按鍵狀態
console.log(Input._previousState); // 前一幀的狀態
```

### 3. 驗證 DOM 結構

```javascript
// 列出所有按鈕
document.querySelectorAll('.touch-control-button').forEach(btn => {
    console.log(btn.id, btn.textContent);
});
```

### 4. 性能分析

```javascript
// 測量初始化時間
console.time('touch-controls-init');
TouchControls.initialize();
console.timeEnd('touch-controls-init');
```

---

## 已知限制

1. **多觸點支援**：目前不支援同時按下多個按鈕的複雜手勢
2. **搖桿模擬**：不支援類似搖桿的連續輸入（需額外插件）
3. **自訂按鍵映射**：需要修改源代碼才能改變鍵盤碼映射
4. **按鈕主題化**：CSS 樣式需要直接修改源代碼

---

## 相關資源

- [RPG Maker MV 官方文檔](https://rpgmaker.net/)
- [Input 類源代碼參考](js/rpg_objects.js)
- [觸控事件 MDN 文檔](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)

---

**最後更新**：2025 年 12 月 6 日
