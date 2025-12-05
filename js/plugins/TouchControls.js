/*:
 * @plugindesc 移動端觸控按鈕控制系統，提供七個觸控按鈕替代鍵盤輸入
 * @author Game Developer
 * @help
 * 該插件為移動端提供了一套完整的觸控按鈕系統，包括：
 * - 方向鍵（上下左右）
 * - 功能鍵（確認、取消、快跑）
 * - 右上角顯示/隱藏切換按鈕
 *
 * 按鈕佈局：
 * - 左下角：方向十字鍵（↑ ↓ ← →）
 * - 右下角：功能按鈕（Z, X, ⇧）
 * - 右上角：顯示/隱藏切換按鈕
 *
 * 按鈕映射到 Input 類的按鈕名稱：
 * - 向上/↑ → 'up' (對應方向鍵 ↑)
 * - 向下/↓ → 'down' (對應方向鍵 ↓)
 * - 向左/← → 'left' (對應方向鍵 ←)
 * - 向右/→ → 'right' (對應方向鍵 →)
 * - 確認 → 'ok' (對應 Z 鍵 和 Enter)
 * - 取消 → 'escape' (對應 X 鍵 和 Escape)
 * - 快跑 → 'shift' (對應 Shift 鍵)
 *
 * 觸控按鈕會自動監聽 touchstart 和 touchend 事件，並模擬鍵盤輸入。
 *
 * @param Show Touch Controls
 * @type boolean
 * @on 顯示
 * @off 隱藏
 * @default true
 * @desc 是否顯示觸控控制按鈕
 *
 * @param Button Size
 * @type number
 * @default 60
 * @desc 觸控按鈕的尺寸（像素）
 *
 * @param Button Opacity
 * @type number
 * @min 0
 * @max 1
 * @decimals 2
 * @default 0.7
 * @desc 按鈕的透明度（0.0 = 完全透明，1.0 = 完全不透明）
 *
 * @param Button Spacing
 * @type number
 * @default 5
 * @desc 按鈕之間的間距（像素）
 *
 * @param Container Bottom Offset
 * @type number
 * @default 20
 * @desc 容器距離視窗底部的距離（像素）
 *
 * @param Container Left Offset
 * @type number
 * @default 20
 * @desc 容器距離視窗左側的距離（像素）
 *
 * @param Container Right Offset
 * @type number
 * @default 20
 * @desc 容器距離視窗右側的距離（像素）
 */

(function() {
    'use strict';

    const PLUGIN_NAME = 'TouchControls';
    const parameters = PluginManager.parameters(PLUGIN_NAME);

    const CONFIG = {
        enabled: String(parameters['Show Touch Controls']).toLowerCase() === 'true',
        buttonSize: parseInt(parameters['Button Size'] || 60),
        buttonOpacity: parseFloat(parameters['Button Opacity'] || 0.7),
        buttonSpacing: parseInt(parameters['Button Spacing'] || 5),
        bottomOffset: parseInt(parameters['Container Bottom Offset'] || 20),
        leftOffset: parseInt(parameters['Container Left Offset'] || 20),
        rightOffset: parseInt(parameters['Container Right Offset'] || 20)
    };

    // 按鈕配置
    // buttonName 對應 Input._currentState 中的鍵名
    const BUTTON_CONFIG = {
        // 方向按鈕
        up: { id: 'TC_Up', buttonName: 'up', label: '↑' },
        down: { id: 'TC_Down', buttonName: 'down', label: '↓' },
        left: { id: 'TC_Left', buttonName: 'left', label: '←' },
        right: { id: 'TC_Right', buttonName: 'right', label: '→' },
        // 功能按鈕
        ok: { id: 'TC_OK', buttonName: 'ok', label: 'Z' },
        cancel: { id: 'TC_Cancel', buttonName: 'escape', label: 'X' },
        shift: { id: 'TC_Shift', buttonName: 'shift', label: '⇧' }
    };

    let touchControlsInitialized = false;

    /**
     * 創建觸控控制 UI 容器和按鈕
     */
    function initializeTouchControls() {
        if (touchControlsInitialized || !CONFIG.enabled) return;

        const container = createControlsContainer();
        createDirectionButtons(container);
        createFunctionButtons(container);
        
        // 創建切換按鈕（右上角）
        createToggleButton();

        document.body.appendChild(container);
        touchControlsInitialized = true;
    }

    /**
     * 創建主控制容器
     */
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
        style.width = 'auto';
        style.height = 'auto';
        style.maxHeight = 'calc(100vh - ' + CONFIG.bottomOffset + 'px)';
        style.overflow = 'visible';
        style.flexWrap = 'nowrap';
        style.alignItems = 'flex-end';

        // 注入樣式表
        injectStyles();

        return container;
    }

    /**
     * 創建方向按鈕（十字鍵佈局）
     */
    function createDirectionButtons(container) {
        const directionGroup = document.createElement('div');
        directionGroup.className = 'touch-controls-group direction-group';
        
        const style = directionGroup.style;
        style.display = 'grid';
        style.gridTemplateColumns = `${CONFIG.buttonSize}px ${CONFIG.buttonSize}px ${CONFIG.buttonSize}px`;
        style.gridTemplateRows = `${CONFIG.buttonSize}px ${CONFIG.buttonSize}px ${CONFIG.buttonSize}px`;
        style.gap = CONFIG.buttonSpacing + 'px';
        style.alignItems = 'center';
        style.justifyContent = 'center';
        style.flexShrink = '0';

        // 空位
        const empty1 = document.createElement('div');
        empty1.style.gridColumn = '1';
        empty1.style.gridRow = '1';
        directionGroup.appendChild(empty1);

        // 上鍵
        const upBtn = createButton(BUTTON_CONFIG.up);
        upBtn.style.gridColumn = '2';
        upBtn.style.gridRow = '1';
        directionGroup.appendChild(upBtn);

        // 空位
        const empty2 = document.createElement('div');
        empty2.style.gridColumn = '3';
        empty2.style.gridRow = '1';
        directionGroup.appendChild(empty2);

        // 左鍵
        const leftBtn = createButton(BUTTON_CONFIG.left);
        leftBtn.style.gridColumn = '1';
        leftBtn.style.gridRow = '2';
        directionGroup.appendChild(leftBtn);

        // 中心空位
        const centerEmpty = document.createElement('div');
        centerEmpty.style.gridColumn = '2';
        centerEmpty.style.gridRow = '2';
        directionGroup.appendChild(centerEmpty);

        // 右鍵
        const rightBtn = createButton(BUTTON_CONFIG.right);
        rightBtn.style.gridColumn = '3';
        rightBtn.style.gridRow = '2';
        directionGroup.appendChild(rightBtn);

        // 空位
        const empty3 = document.createElement('div');
        empty3.style.gridColumn = '1';
        empty3.style.gridRow = '3';
        directionGroup.appendChild(empty3);

        // 下鍵
        const downBtn = createButton(BUTTON_CONFIG.down);
        downBtn.style.gridColumn = '2';
        downBtn.style.gridRow = '3';
        directionGroup.appendChild(downBtn);

        // 空位
        const empty4 = document.createElement('div');
        empty4.style.gridColumn = '3';
        empty4.style.gridRow = '3';
        directionGroup.appendChild(empty4);

        container.appendChild(directionGroup);
    }

    /**
     * 創建功能按鈕（OK, Cancel, Shift）
     */
    function createFunctionButtons(container) {
        const functionGroup = document.createElement('div');
        functionGroup.className = 'touch-controls-group function-group';
        
        const style = functionGroup.style;
        style.display = 'flex';
        style.flexDirection = 'column';
        style.gap = CONFIG.buttonSpacing + 'px';
        style.alignItems = 'center';
        style.justifyContent = 'flex-start';
        style.flexShrink = '0';

        // 上行：OK 和 Cancel
        const topRow = document.createElement('div');
        topRow.style.display = 'flex';
        topRow.style.gap = CONFIG.buttonSpacing + 'px';

        const okBtn = createButton(BUTTON_CONFIG.ok);
        const cancelBtn = createButton(BUTTON_CONFIG.cancel);

        topRow.appendChild(okBtn);
        topRow.appendChild(cancelBtn);
        functionGroup.appendChild(topRow);

        // 下行：Shift
        const shiftBtn = createButton(BUTTON_CONFIG.shift);
        shiftBtn.style.width = (CONFIG.buttonSize * 2 + CONFIG.buttonSpacing) + 'px';
        functionGroup.appendChild(shiftBtn);

        container.appendChild(functionGroup);
    }

    /**
     * 創建切換按鈕（右上角）
     */
    function createToggleButton() {
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'TC_Toggle';
        toggleBtn.className = 'touch-control-toggle-button';
        toggleBtn.textContent = '▼';
        toggleBtn.type = 'button';
        toggleBtn.title = '顯示/隱藏觸控按鈕';

        const style = toggleBtn.style;
        style.position = 'fixed';
        style.top = '10px';
        style.right = '10px';
        style.width = '44px';
        style.height = '44px';
        style.padding = '0';
        style.fontSize = '20px';
        style.fontWeight = 'bold';
        style.color = 'white';
        style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
        style.border = '2px solid rgba(255, 255, 255, 0.5)';
        style.borderRadius = '8px';
        style.cursor = 'pointer';
        style.userSelect = 'none';
        style.touchAction = 'none';
        style.zIndex = '10001';
        style.transition = 'all 0.2s ease';
        style.boxSizing = 'border-box';

        toggleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            toggleControlsVisibility();
        });

        toggleBtn.addEventListener('touchstart', function(e) {
            e.preventDefault();
            toggleControlsVisibility();
        });

        toggleBtn.addEventListener('mousedown', function(e) {
            e.preventDefault();
            toggleBtn.style.backgroundColor = 'rgba(100, 150, 200, 0.8)';
        });

        toggleBtn.addEventListener('mouseup', function(e) {
            e.preventDefault();
            toggleBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
        });

        document.body.appendChild(toggleBtn);
    }

    /**
     * 切換控制面板的顯示/隱藏
     */
    function toggleControlsVisibility() {
        const container = document.getElementById('touch-controls-container');
        const toggleBtn = document.getElementById('TC_Toggle');
        
        if (container) {
            if (container.style.display === 'none' || container.style.display === '') {
                container.style.display = 'flex';
                if (toggleBtn) toggleBtn.textContent = '▼';
                CONFIG.enabled = true;
            } else {
                container.style.display = 'none';
                if (toggleBtn) toggleBtn.textContent = '▲';
                CONFIG.enabled = false;
            }
        }
    }

    /**
     * 創建單個按鈕
     */
    function createButton(config) {
        const button = document.createElement('button');
        button.id = config.id;
        button.className = 'touch-control-button';
        button.textContent = config.label;
        button.type = 'button';

        // 樣式設置
        const style = button.style;
        style.width = CONFIG.buttonSize + 'px';
        style.height = CONFIG.buttonSize + 'px';
        style.minWidth = CONFIG.buttonSize + 'px';
        style.minHeight = CONFIG.buttonSize + 'px';
        style.padding = '0';
        style.fontSize = '16px';
        style.fontWeight = 'bold';
        style.color = 'white';
        style.backgroundColor = 'rgba(0, 0, 0, ' + CONFIG.buttonOpacity + ')';
        style.border = '2px solid rgba(255, 255, 255, 0.5)';
        style.borderRadius = '8px';
        style.cursor = 'pointer';
        style.userSelect = 'none';
        style.touchAction = 'none';
        style.transition = 'all 0.1s ease';
        style.boxSizing = 'border-box';
        style.flexShrink = '0';

        // 添加事件監聽器
        attachButtonEvents(button, config);

        return button;
    }

    /**
     * 為按鈕添加事件監聽器
     */
    function attachButtonEvents(button, config) {
        // 防止重複添加事件監聽器
        if (button.dataset.eventsAttached) return;
        button.dataset.eventsAttached = 'true';

        // touchstart 事件
        button.addEventListener('touchstart', function(e) {
            e.preventDefault();
            simulateKeyDown(config.buttonName);
            // 視覺反饋
            button.style.backgroundColor = 'rgba(100, 150, 200, 0.9)';
        });

        // touchend 事件
        button.addEventListener('touchend', function(e) {
            e.preventDefault();
            simulateKeyUp(config.buttonName);
            // 恢復視覺狀態
            button.style.backgroundColor = 'rgba(0, 0, 0, ' + CONFIG.buttonOpacity + ')';
        });

        // mousedown 事件（用於桌面調試）
        button.addEventListener('mousedown', function(e) {
            e.preventDefault();
            simulateKeyDown(config.buttonName);
            button.style.backgroundColor = 'rgba(100, 150, 200, 0.9)';
        });

        // mouseup 事件（用於桌面調試）
        button.addEventListener('mouseup', function(e) {
            e.preventDefault();
            simulateKeyUp(config.buttonName);
            button.style.backgroundColor = 'rgba(0, 0, 0, ' + CONFIG.buttonOpacity + ')';
        });

        // 觸控離開按鈕時也應該觸發 keyup（防止按鈕卡住）
        button.addEventListener('touchleave', function(e) {
            e.preventDefault();
            simulateKeyUp(config.buttonName);
            button.style.backgroundColor = 'rgba(0, 0, 0, ' + CONFIG.buttonOpacity + ')';
        });
    }

    /**
     * 模擬按鍵按下
     * @param {String} buttonName - 按鈕名稱 (如 'ok', 'up', 'escape' 等)
     */
    function simulateKeyDown(buttonName) {
        if (Input._currentState && typeof Input._currentState === 'object') {
            Input._currentState[buttonName] = true;
        }
    }

    /**
     * 模擬按鍵抬起
     * @param {String} buttonName - 按鈕名稱 (如 'ok', 'up', 'escape' 等)
     */
    function simulateKeyUp(buttonName) {
        if (Input._currentState && typeof Input._currentState === 'object') {
            Input._currentState[buttonName] = false;
        }
    }

    /**
     * 注入全局樣式表
     */
    function injectStyles() {
        if (document.getElementById('touch-controls-style')) return;

        const style = document.createElement('style');
        style.id = 'touch-controls-style';
        style.textContent = `
            #touch-controls-container {
                font-family: Arial, sans-serif;
            }

            .touch-control-button {
                box-sizing: border-box;
                outline: none;
            }

            .touch-control-button:active {
                background-color: rgba(100, 150, 200, 0.9) !important;
                transform: scale(0.95);
            }

            .touch-control-button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .touch-control-toggle-button {
                box-sizing: border-box;
                outline: none;
            }

            .touch-control-toggle-button:active {
                background-color: rgba(100, 150, 200, 0.8) !important;
                transform: scale(0.95);
            }

            /* 桌面優化 (≥769px) */
            @media (min-width: 769px) {
                #touch-controls-container {
                    opacity: 0.8;
                    transition: opacity 0.3s ease;
                }

                #touch-controls-container:hover {
                    opacity: 1;
                }

                .touch-control-button:hover {
                    background-color: rgba(50, 100, 150, 0.8) !important;
                }

                .touch-control-toggle-button:hover {
                    background-color: rgba(50, 100, 150, 0.7) !important;
                }
            }

            /* 移動端最佳化 (≤768px) */
            @media (max-width: 768px) {
                .touch-control-button {
                    -webkit-user-select: none;
                    -webkit-touch-callout: none;
                }

                #touch-controls-container {
                    background-color: transparent;
                }

                #TC_Toggle {
                    width: 40px !important;
                    height: 40px !important;
                    font-size: 18px !important;
                }
            }

            /* 超小螢幕優化 (≤480px) */
            @media (max-width: 480px) {
                #touch-controls-container {
                    bottom: 10px !important;
                    left: 10px !important;
                    right: 10px !important;
                }

                .touch-control-button {
                    width: 50px !important;
                    height: 50px !important;
                    font-size: 14px !important;
                }

                #TC_Toggle {
                    width: 36px !important;
                    height: 36px !important;
                    font-size: 16px !important;
                    top: 8px !important;
                    right: 8px !important;
                }
            }

            /* 寬屏優化 (≥1200px) */
            @media (min-width: 1200px) {
                .touch-control-button {
                    width: 70px !important;
                    height: 70px !important;
                    font-size: 18px !important;
                }

                #TC_Toggle {
                    width: 48px !important;
                    height: 48px !important;
                    font-size: 22px !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * 使用插件別名覆寫 SceneManager.initGraphics
     * 在初始化圖形後創建觸控控制
     */
    const _SceneManager_initGraphics = SceneManager.initGraphics;
    SceneManager.initGraphics = function() {
        _SceneManager_initGraphics.call(this);
        initializeTouchControls();
    };

    /**
     * 暴露公開 API（用於動態啟用/禁用）
     */
    window.TouchControls = {
        /**
         * 啟用觸控控制
         */
        enable: function() {
            CONFIG.enabled = true;
            const container = document.getElementById('touch-controls-container');
            if (container) {
                container.style.display = 'flex';
            }
            const toggleBtn = document.getElementById('TC_Toggle');
            if (toggleBtn) {
                toggleBtn.textContent = '▼';
            }
        },

        /**
         * 禁用觸控控制
         */
        disable: function() {
            CONFIG.enabled = false;
            const container = document.getElementById('touch-controls-container');
            if (container) {
                container.style.display = 'none';
            }
            const toggleBtn = document.getElementById('TC_Toggle');
            if (toggleBtn) {
                toggleBtn.textContent = '▲';
            }
        },

        /**
         * 取得觸控控制是否啟用
         */
        isEnabled: function() {
            return CONFIG.enabled;
        },

        /**
         * 設定按鈕大小
         */
        setButtonSize: function(size) {
            CONFIG.buttonSize = size;
            const buttons = document.querySelectorAll('.touch-control-button');
            buttons.forEach(btn => {
                btn.style.width = size + 'px';
                btn.style.height = size + 'px';
                btn.style.minWidth = size + 'px';
                btn.style.minHeight = size + 'px';
            });
        },

        /**
         * 設定按鈕透明度
         */
        setButtonOpacity: function(opacity) {
            CONFIG.buttonOpacity = Math.max(0, Math.min(1, opacity));
            const buttons = document.querySelectorAll('.touch-control-button');
            buttons.forEach(btn => {
                btn.style.backgroundColor = 'rgba(0, 0, 0, ' + CONFIG.buttonOpacity + ')';
            });
        },

        /**
         * 切換控制面板顯示/隱藏
         */
        toggle: function() {
            toggleControlsVisibility();
        }
    };

})();
