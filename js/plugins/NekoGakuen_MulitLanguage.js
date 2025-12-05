//=============================================================================
// NekoGakuen_MulitLanguage.js
// Version: 1.3.1
//=============================================================================
/*:
 * @plugindesc 多國語言文本
 * @author Mirai
 * @help
 * 
 * ─ 插件簡介 ─
 * 在RPG Maker MV中用於支援各國語言文本內容的切換功能。
 * 本插件為「Maker製造機」多語系文本插件 (chimaki_Langugae.js)的改良加強版，
 * 當然對於「Maker製造機」有感興趣的人可以到以下網址前往喔！
 * 
 * 【Maker製造機】
 * https://www.chimakier.com
 * 
 * 
 * ─ 更新履歷 ─
 * V1.3.1 修正「\Say[<參數>]」使用時無法轉換控制字符的問題。
 * V1.3 修正「!Say <參數>」使用時的錯誤問題，另外也新增插件使用說明的Google文件連結。
 * V1.2 修正讀檔時無法成功讀取「外部文本」參數問題
 * V1.1 更新插件簡介的內容
 * V1.0 初次版本的插件發佈
 * 
 * 
 * ─ 使用說明 ─
 * 1.在RPG Maker MV的「插件管理器」之中載入本插件，
 *   並在本插件的「參數」區塊設定即可。
 * 2.在事件頁中高級區塊選擇「插件命令...」，
 *   並輸入想要執行的插件命令及參數即可。
 * 
 * ※ 詳細使用說明：
 * https://docs.google.com/document/d/e/2PACX-1vRetYbZCskIf75S4R445Q6JOnABp1799ebDRK-sjBo2h3Unh5_3CI_b9eAlo3QOBgsBTCFdPVPd3qNf/pub
 * 
 * 
 * ─ 插件/腳本/文字指令 ─
 * 
 * 【變更CSV檔讀取】
 * --說明：在遊戲中變更CSV的語言。
 * 而<參數>為插件參數「外部文本語言列表」所設定的「參數」。
 * --插件指令 MulitLang CSV <參數>
 * --腳本指令 $gameSystem.mulitLangCSV("<參數>");
 * 
 * 【變更遊戲語言】
 * --說明：在遊戲中變更遊戲文本的語言。
 * 而<參數>為插件參數「自訂遊戲語言列表」所設定的「參數」，
 * 而且所設定的「參數」必須跟CSV檔案裡的欄位名稱一致。
 * --插件指令 MulitLang SET <參數>
 * --腳本指令 $gameSystem.mulitLangSET("<參數>");
 * 
 * 【呼叫多國語言文本】
 * --說明：在遊戲中呼叫目前所設定的語言文本。
 * 而<參數>為你在CSV檔案裡所輸入的參數名稱。
 * --文字指令  !Say <參數>
 * (※適用於「資料庫」中所有的文字框部分。)
 * --文字指令  \Say[<參數>]
 * (※僅在事件指令「顯示文字...」、「顯示選擇...」使用。)
 * 
 * ※注意：上述提到的參數命名方式最好不要有任何的半形空白，
 * 如有空白可以改成「_」取代半形空白。
 * 
 * ─ 版權聲明 ─
 * 修改或翻譯本插件無需向作者事前告知，但修改後的版本禁止再次發佈。
 * 如果官方的版本有BUG，可以跟作者回報。
 * 
 * 禁止利用本插件進行非法販售及詐騙。
 * 作者只單純提供此插件，如有問題請使用者自負所有法律責任。
 * 本插件著作權為貓咪學園(Neko Gakuen)的程式人員Mirai(快閃小強)所有。
 * 
 * --------------------
 * -來源標示：【△ 不需要，但有的話會很感謝】
 * -授權方式：【√ 免費】
 * -商業營利：【√ 允許】
 * -改作許可：【√ 允許】
 * -二次配佈：【× 禁止】
 * -成人用途：【√ 允許】
 * -使用範圍：【※ 僅RPG Maker系列】
 * --------------------
 * 
 * 
 * 
 * @param Lancsv List
 * @text 外部文本語言列表
 * @desc 匯入各種外部文本CSV檔案列表。
 * @type struct<Lancsv>[]
 * @default ["{\"Lancsv Name\":\"Text01\",\"Lancsv Path\":\"data/Text1.csv\"}","{\"Lancsv Name\":\"Text02\",\"Lancsv Path\":\"data/Text2.csv\"}"]
 * 
 * @param Custom Langlist
 * @text 自訂遊戲語言列表
 * @desc 設定自己遊戲可以選擇切換的語言。
 * @type struct<Langlist>[]
 * @default ["{\"Lang Key\":\"zh_TW\",\"Lang Name\":\"中文\"}","{\"Lang Key\":\"JP\",\"Lang Name\":\"日本語\"}","{\"Lang Key\":\"EN\",\"Lang Name\":\"English\"}"]
 * 
 * @param Config Lang
 * @text 選項語言名稱
 * @desc 設定遊戲設定「選項」的語言設定名稱，
 * 需要選項語言支援多國語言可以使用 !Say <參數> 。
 * @type string
 * @default 語言設定
 * 
 * @param Lancsv Var
 * @text 外部文本記錄變數ID
 * @desc 用於記錄「外部文本」參數的變數ID。
 * @type variable
 * @default 0
 * 
 */
/*~struct~Lancsv:
 * 
 * @param Lancsv Name
 * @text 外部文本參數
 * @desc 指定外部文本CSV檔的參數名稱。
 * @type string
 * 
 * @param Lancsv Path
 * @text 外部文本CSV檔
 * @desc 指定外部文本的CSV檔案路徑。
 * @type string
 * 
 */
/*~struct~Langlist:
 * 
 * @param Lang Key
 * @text 文本語言參數
 * @desc 指定該遊戲語言的參數名稱，
 * 必須跟CSV檔案的欄位名稱一致。
 * @type string
 * 
 * @param Lang Name
 * @text 文本語言名稱
 * @desc 指定該遊戲語言的顯示名稱。
 * @type string
 * 
 */
//=============================================================================
'use strict';

(function () {
    var NekoGakuen = NekoGakuen || {};
    NekoGakuen.MulitLanguage = {};
    NekoGakuen.MulitLanguage.Enable = true;
    NekoGakuen.MulitLanguage.Parameters = PluginManager.parameters('NekoGakuen_MulitLanguage');
    NekoGakuen.MulitLanguage.Config_Lang = String(NekoGakuen.MulitLanguage.Parameters['Config Lang'] || "語言設定");
    NekoGakuen.MulitLanguage.LancsvVar = Number(NekoGakuen.MulitLanguage.Parameters['Lancsv Var'] || 0);

    var args_LanNameList = JSON.parse(NekoGakuen.MulitLanguage.Parameters['Custom Langlist']);
    var args_LancsvFileList = JSON.parse(NekoGakuen.MulitLanguage.Parameters['Lancsv List']);
    var args_Lancsv1a = new Array();
    var args_Lancsv1b = new Array();
    var args_Lan2a = new Array();
    var args_Lan2b = new Array();
    var args_load = false;
    var args_LancsvPath, args_LanName;

    for (var i = 0; i < args_LancsvFileList.length; i++) {
        args_LancsvPath = JSON.parse(args_LancsvFileList[i]);
        args_Lancsv1a.push(String(args_LancsvPath["Lancsv Name"]));
        args_Lancsv1b.push(String(args_LancsvPath["Lancsv Path"]));
    }

    for (var i = 0; i < args_LanNameList.length; i++) {
        args_LanName = JSON.parse(args_LanNameList[i]);
        args_Lan2a.push(String(args_LanName["Lang Key"]));
        args_Lan2b.push(String(args_LanName["Lang Name"]));
    }

    ConfigManager.language = 0;

    var args_Csvindex = args_Lancsv1b[0];
    var args_Lanindex = args_Lan2a[0];

    var request = new XMLHttpRequest();
    request.open("GET", args_Csvindex, false);
    request.send(null);

    var csvData = new Array();
    var jsonObject = request.responseText.split(/\r\n|\r/);
    for (var i = 0; i < jsonObject.length; i++) {
        csvData.push(jsonObject[i].split(','));
    }

    NekoGakuen.MulitLanguage._Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        NekoGakuen.MulitLanguage._Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'MulitLang') {
            switch (args[0]) {
                case 'CSV':
                    $gameSystem.mulitLangCSV(String(args[1]));
                    break;
                case 'SET':
                    $gameSystem.mulitLangSET(String(args[1]));
                    break;
            }
        }
    };

    NekoGakuen.MulitLanguage._Window_Base_convertEscapeCharacters = Window_Base.prototype.convertEscapeCharacters;
    Window_Base.prototype.convertEscapeCharacters = function (text) {
        let content = NekoGakuen.MulitLanguage._Window_Base_convertEscapeCharacters.call(this, text);
        content = content.replace(/\x1bSay\[(.*?)\]/gi, function () {
            return MulitLanguageArgs.isLangDataText(String(arguments[1])) ? this.convertEscapeCharacters(MulitLanguageArgs.getLangDataText(String(arguments[1]))) : ''
        }.bind(this));
        return content;
    };

    NekoGakuen.MulitLanguage._Scene_Load_onLoadSuccess = Scene_Load.prototype.onLoadSuccess;
    Scene_Load.prototype.onLoadSuccess = function () {
        NekoGakuen.MulitLanguage._Scene_Load_onLoadSuccess.call(this);
        args_load = true;
    };

    Scene_Map.prototype.isReady = function () {
        if (!this._mapLoaded && DataManager.isMapLoaded()) {
            this.onMapLoaded();
            this._mapLoaded = true;
            if (args_load) {
                MulitLanguageArgs.setCsvData(args_Lancsv1a[$gameVariables.value(NekoGakuen.MulitLanguage.LancsvVar)]);
                args_load = false;
            }
        }
        return this._mapLoaded && Scene_Base.prototype.isReady.call(this);
    };

    Game_Interpreter.prototype.checkTextByData = function (text) {
        text = text.replace(/\\/g, '\x1b');
        text = text.replace(/\x1bSay\[(.*?)\]/gi, function () {
            return MulitLanguageArgs.isLangDataText(String(arguments[1])) ? MulitLanguageArgs.getLangDataText(String(arguments[1])) : ''
        }.bind(this));
        return text;
    }

    Game_Interpreter.prototype.setupChoices = function (params) {
        var choices = params[0].clone();
        for (let i = 0; i < choices.length; i++) {
            choices[i] = this.checkTextByData(choices[i]);
        }
        var cancelType = params[1];
        var defaultType = params.length > 2 ? params[2] : 0;
        var positionType = params.length > 3 ? params[3] : 2;
        var background = params.length > 4 ? params[4] : 0;
        if (cancelType >= choices.length) {
            cancelType = -2;
        }
        $gameMessage.setChoices(choices, defaultType, cancelType);
        $gameMessage.setChoiceBackground(background);
        $gameMessage.setChoicePositionType(positionType);
        $gameMessage.setChoiceCallback(function (n) {
            this._branch[this._indent] = n;
        }.bind(this));
    };

    TextManager.param = function (paramId) {
        var args = $dataSystem.terms.params[paramId].split(" ");
        var command = args.shift();
        if (command === "!Say" && MulitLanguageArgs.isLangDataText(String(args[0]))) {
            return MulitLanguageArgs.getLangDataText(String(args[0]));
        } else {
            return $dataSystem.terms.params[paramId] || '';
        }
    };

    TextManager.getter = function (method, param) {
        return {
            get: function () {
                var args = this[method](param).split(" ");
                var command = args.shift();
                if (command === "!Say" && MulitLanguageArgs.isLangDataText(String(args[0]))) {
                    return MulitLanguageArgs.getLangDataText(String(args[0]));
                } else {
                    return this[method](param);
                }
            },
            configurable: true
        };
    };

    Object.defineProperties(TextManager, {
        level: TextManager.getter('basic', 0),
        levelA: TextManager.getter('basic', 1),
        hp: TextManager.getter('basic', 2),
        hpA: TextManager.getter('basic', 3),
        mp: TextManager.getter('basic', 4),
        mpA: TextManager.getter('basic', 5),
        tp: TextManager.getter('basic', 6),
        tpA: TextManager.getter('basic', 7),
        exp: TextManager.getter('basic', 8),
        expA: TextManager.getter('basic', 9),
        fight: TextManager.getter('command', 0),
        escape: TextManager.getter('command', 1),
        attack: TextManager.getter('command', 2),
        guard: TextManager.getter('command', 3),
        item: TextManager.getter('command', 4),
        skill: TextManager.getter('command', 5),
        equip: TextManager.getter('command', 6),
        status: TextManager.getter('command', 7),
        formation: TextManager.getter('command', 8),
        save: TextManager.getter('command', 9),
        gameEnd: TextManager.getter('command', 10),
        options: TextManager.getter('command', 11),
        weapon: TextManager.getter('command', 12),
        armor: TextManager.getter('command', 13),
        keyItem: TextManager.getter('command', 14),
        equip2: TextManager.getter('command', 15),
        optimize: TextManager.getter('command', 16),
        clear: TextManager.getter('command', 17),
        newGame: TextManager.getter('command', 18),
        continue_: TextManager.getter('command', 19),
        toTitle: TextManager.getter('command', 21),
        cancel: TextManager.getter('command', 22),
        buy: TextManager.getter('command', 24),
        sell: TextManager.getter('command', 25),
        alwaysDash: TextManager.getter('message', 'alwaysDash'),
        commandRemember: TextManager.getter('message', 'commandRemember'),
        bgmVolume: TextManager.getter('message', 'bgmVolume'),
        bgsVolume: TextManager.getter('message', 'bgsVolume'),
        meVolume: TextManager.getter('message', 'meVolume'),
        seVolume: TextManager.getter('message', 'seVolume'),
        possession: TextManager.getter('message', 'possession'),
        expTotal: TextManager.getter('message', 'expTotal'),
        expNext: TextManager.getter('message', 'expNext'),
        saveMessage: TextManager.getter('message', 'saveMessage'),
        loadMessage: TextManager.getter('message', 'loadMessage'),
        file: TextManager.getter('message', 'file'),
        partyName: TextManager.getter('message', 'partyName'),
        emerge: TextManager.getter('message', 'emerge'),
        preemptive: TextManager.getter('message', 'preemptive'),
        surprise: TextManager.getter('message', 'surprise'),
        escapeStart: TextManager.getter('message', 'escapeStart'),
        escapeFailure: TextManager.getter('message', 'escapeFailure'),
        victory: TextManager.getter('message', 'victory'),
        defeat: TextManager.getter('message', 'defeat'),
        obtainExp: TextManager.getter('message', 'obtainExp'),
        obtainGold: TextManager.getter('message', 'obtainGold'),
        obtainItem: TextManager.getter('message', 'obtainItem'),
        levelUp: TextManager.getter('message', 'levelUp'),
        obtainSkill: TextManager.getter('message', 'obtainSkill'),
        useItem: TextManager.getter('message', 'useItem'),
        criticalToEnemy: TextManager.getter('message', 'criticalToEnemy'),
        criticalToActor: TextManager.getter('message', 'criticalToActor'),
        actorDamage: TextManager.getter('message', 'actorDamage'),
        actorRecovery: TextManager.getter('message', 'actorRecovery'),
        actorGain: TextManager.getter('message', 'actorGain'),
        actorLoss: TextManager.getter('message', 'actorLoss'),
        actorDrain: TextManager.getter('message', 'actorDrain'),
        actorNoDamage: TextManager.getter('message', 'actorNoDamage'),
        actorNoHit: TextManager.getter('message', 'actorNoHit'),
        enemyDamage: TextManager.getter('message', 'enemyDamage'),
        enemyRecovery: TextManager.getter('message', 'enemyRecovery'),
        enemyGain: TextManager.getter('message', 'enemyGain'),
        enemyLoss: TextManager.getter('message', 'enemyLoss'),
        enemyDrain: TextManager.getter('message', 'enemyDrain'),
        enemyNoDamage: TextManager.getter('message', 'enemyNoDamage'),
        enemyNoHit: TextManager.getter('message', 'enemyNoHit'),
        evasion: TextManager.getter('message', 'evasion'),
        magicEvasion: TextManager.getter('message', 'magicEvasion'),
        magicReflection: TextManager.getter('message', 'magicReflection'),
        counterAttack: TextManager.getter('message', 'counterAttack'),
        substitute: TextManager.getter('message', 'substitute'),
        buffAdd: TextManager.getter('message', 'buffAdd'),
        debuffAdd: TextManager.getter('message', 'debuffAdd'),
        buffRemove: TextManager.getter('message', 'buffRemove'),
        actionFailure: TextManager.getter('message', 'actionFailure'),
    });

    Game_Enemy.prototype.originalName = function () {
        var args = this.enemy().name.split(" ");
        var command = args.shift();
        if (command === "!Say" && MulitLanguageArgs.isLangDataText(String(args[0]))) {
            return MulitLanguageArgs.getLangDataText(String(args[0]));
        } else {
            return this.enemy().name;
        }
    };

    Game_Actor.prototype.name = function () {
        var args = this._name.split(" ");
        var command = args.shift();
        if (command === "!Say" && MulitLanguageArgs.isLangDataText(String(args[0]))) {
            return MulitLanguageArgs.getLangDataText(String(args[0]));
        } else {
            return this._name;
        }
    };

    Game_Party.prototype.name = function () {
        var numBattleMembers = this.battleMembers().length;
        if (numBattleMembers === 0) {
            return '';
        } else if (numBattleMembers === 1) {
            var args = this.leader().name().split(" ");
            var command = args.shift();
            if (command === "!Say" && MulitLanguageArgs.isLangDataText(String(args[0]))) {
                return MulitLanguageArgs.getLangDataText(String(args[0]));
            } else {
                return this.leader().name();
            }
        } else {
            var args = this.leader().name().split(" ");
            var command = args.shift();
            if (command === "!Say" && MulitLanguageArgs.isLangDataText(String(args[0]))) {
                return MulitLanguageArgs.getLangDataText(String(args[0]));
            } else {
                return TextManager.partyName.format(this.leader().name());
            }
        }
    };

    Window_MapName.prototype.refresh = function () {
        this.contents.clear();
        if ($gameMap.displayName()) {
            var width = this.contentsWidth();
            this.drawBackground(0, 0, width, this.lineHeight());
            var args = $gameMap.displayName().split(" ");
            var command = args.shift();
            if (command === "!Say" && MulitLanguageArgs.isLangDataText(String(args[0]))) {
                this.drawText(MulitLanguageArgs.getLangDataText(String(args[0])), 0, 0, width, "center");
            } else {
                this.drawText($gameMap.displayName(), 0, 0, width, 'center');
            }
        }
    };

    Window_Help.prototype.refresh = function () {
        this.contents.clear();
        var args = this._text.split(" ");
        var command = args.shift();
        if (command === "!Say" && MulitLanguageArgs.isLangDataText(String(args[0]))) {
            this.drawTextEx(MulitLanguageArgs.getLangDataText(String(args[0])), this.textPadding(), 0);
        } else {
            this.drawTextEx(this._text, this.textPadding(), 0);
        }
    };

    Window_Base.prototype.drawItemName = function (item, x, y, width) {
        width = width || 312;
        if (item) {
            var iconBoxWidth = Window_Base._iconWidth + 4;
            this.resetTextColor();
            this.drawIcon(item.iconIndex, x + 2, y + 2);
            var args = item.name.split(" ");
            var command = args.shift();
            if (command === "!Say" && MulitLanguageArgs.isLangDataText(String(args[0]))) {
                this.drawText(MulitLanguageArgs.getLangDataText(String(args[0])), x + iconBoxWidth, y, width - iconBoxWidth);
            } else {
                this.drawText(item.name, x + iconBoxWidth, y, width - iconBoxWidth);
            }
        }
    };

    Window_Base.prototype.drawActorName = function (actor, x, y, width) {
        width = width || 168;
        this.changeTextColor(this.hpColor(actor));
        var args = actor.name().split(" ");
        var command = args.shift();
        if (command === "!Say" && MulitLanguageArgs.isLangDataText(String(args[0]))) {
            this.drawText(MulitLanguageArgs.getLangDataText(String(args[0])), x, y, width);
        } else {
            this.drawText(actor.name(), x, y, width);
        }
    };

    Window_Base.prototype.drawActorClass = function (actor, x, y, width) {
        width = width || 168;
        this.resetTextColor();
        var args = actor.currentClass().name.split(" ");
        var command = args.shift();
        if (command === "!Say" && MulitLanguageArgs.isLangDataText(String(args[0]))) {
            this.drawText(MulitLanguageArgs.getLangDataText(String(args[0])), x, y, width);
        } else {
            this.drawText(actor.currentClass().name, x, y, width);
        }
    };

    Window_Base.prototype.drawActorNickname = function (actor, x, y, width) {
        width = width || 270;
        this.resetTextColor();
        var args = actor.nickname().split(" ");
        var command = args.shift();
        if (command === "!Say" && MulitLanguageArgs.isLangDataText(String(args[0]))) {
            this.drawText(MulitLanguageArgs.getLangDataText(String(args[0])), x, y, width);
        } else {
            this.drawText(actor.nickname(), x, y, width);
        }
    };

    Window_Status.prototype.drawProfile = function (x, y) {
        var args = this._actor.profile().split(" ");
        var command = args.shift();
        if (command === "!Say" && MulitLanguageArgs.isLangDataText(String(args[0]))) {
            this.drawTextEx(MulitLanguageArgs.getLangDataText(String(args[0])), x, y);
        } else {
            this.drawTextEx(this._actor.profile(), x, y);
        }
    };

    Window_Options.prototype.statusText = function (index) {
        var symbol = this.commandSymbol(index);
        var value = this.getConfigValue(symbol);
        if (this.isVolumeSymbol(symbol)) {
            return this.volumeStatusText(value);
        } else if (this.isLanguageSymbol(symbol)) {
            return this.langSymbol(value);
        } else {
            return this.booleanStatusText(value);
        }
    };

    Window_Options.prototype.isLanguageSymbol = function (symbol) {
        return symbol.contains('language');
    };

    Window_Options.prototype.langSymbol = function (value) {
        return args_Lan2b[value];
    }

    Window_Options.prototype.addGeneralOptions = function () {
        var args = NekoGakuen.MulitLanguage.Config_Lang.split(" ");
        var command = args.shift();
        if (command === "!Say" && MulitLanguageArgs.isLangDataText(String(args[0]))) {
            this.addCommand(MulitLanguageArgs.getLangDataText(String(args[0])), 'language');
        } else {
            this.addCommand(NekoGakuen.MulitLanguage.Config_Lang, 'language');
        }
        this.addCommand(TextManager.alwaysDash, 'alwaysDash');
        this.addCommand(TextManager.commandRemember, 'commandRemember');
    };

    Window_Options.prototype.processOk = function () {
        var index = this.index();
        var symbol = this.commandSymbol(index);
        var value = this.getConfigValue(symbol);
        if (this.isVolumeSymbol(symbol)) {
            value += this.volumeOffset();
            if (value > 100) {
                value = 0;
            }
            value = value.clamp(0, 100);
            this.changeValue(symbol, value);
        } else if (this.isLanguageSymbol(symbol)) {
            value += this.langOffset();
            let config = args_Lan2a;
            if (value > config.length - 1) {
                value = 0;
            }
            MulitLanguageArgs.setLangData(args_Lan2a[value]);
            this.changeValue(symbol, value);
        } else {
            this.changeValue(symbol, !value);
        }
    };

    Window_Options.prototype.langOffset = function () {
        return 1;
    }

    Window_Options.prototype.cursorLeft = function (wrap) {
        var index = this.index();
        var symbol = this.commandSymbol(index);
        var value = this.getConfigValue(symbol);
        if (this.isVolumeSymbol(symbol)) {
            value -= this.volumeOffset();
            value = value.clamp(0, 100);
            this.changeValue(symbol, value);
        } else if (this.isLanguageSymbol(symbol)) {
            value--;
            value = value.clamp(0, args_LanNameList.length);
            MulitLanguageArgs.setLangData(args_Lan2a[value]);
            this.changeValue(symbol, value);
        } else {
            this.changeValue(symbol, false);
        }
    };

    Window_Options.prototype.cursorRight = function (wrap) {
        var index = this.index();
        var symbol = this.commandSymbol(index);
        var value = this.getConfigValue(symbol);
        if (this.isVolumeSymbol(symbol)) {
            value += this.volumeOffset();
            value = value.clamp(0, 100);
            this.changeValue(symbol, value);
        } else if (this.isLanguageSymbol(symbol)) {
            value++;
            value = value.clamp(0, args_LanNameList.length);
            MulitLanguageArgs.setLangData(args_Lan2a[value]);
            this.changeValue(symbol, value);
        } else {
            this.changeValue(symbol, true);
        }
    };

    NekoGakuen.MulitLanguage._configManager_makeData = ConfigManager.makeData;
    ConfigManager.makeData = function () {
        let config = NekoGakuen.MulitLanguage._configManager_makeData.call(this);
        config.language = this.language;
        return config;
    };

    NekoGakuen.MulitLanguage._configManager_applyData = ConfigManager.applyData;
    ConfigManager.applyData = function (config) {
        NekoGakuen.MulitLanguage._configManager_applyData.call(this, config);
        this.language = this.readVolume(config, 'language');
        args_Lanindex = args_Lan2a[this.language];
    };

    ConfigManager.readVolume = function (config, name) {
        var value = config[name];
        if (name != 'language') {
            if (value !== undefined) {
                return Number(value).clamp(0, 100);
            } else {
                return 100;
            }
        } else {
            if (value !== undefined) {
                return Number(value).clamp(0, args_LanNameList.length);
            } else {
                return 0;
            }
        }
    };

    Game_System.prototype.mulitLangSET = function (lanargs) {
        ConfigManager.language = args_Lan2a.indexOf(lanargs);
        ConfigManager.save();
        MulitLanguageArgs.setLangData(String(lanargs));
    };

    Game_System.prototype.mulitLangCSV = function (csvargs) {
        $gameVariables.setValue(NekoGakuen.MulitLanguage.LancsvVar, args_Lancsv1a.indexOf(csvargs));
        MulitLanguageArgs.setCsvData(String(csvargs));
    };

    function MulitLanguageArgs() {
        throw new Error('This is a static class');
    }

    MulitLanguageArgs.setLangData = function (lanindex) {
        if (args_Lan2a[args_Lan2a.indexOf(lanindex)] != undefined) {
            args_Lanindex = args_Lan2a[args_Lan2a.indexOf(lanindex)];
        }
    }

    MulitLanguageArgs.setCsvData = function (csvindex) {
        args_Csvindex = args_Lancsv1b[args_Lancsv1a.indexOf(csvindex)];
        if (args_Csvindex != undefined) {
            request.open("GET", args_Csvindex, false);
            request.send(null);
            csvData = new Array();
            jsonObject = request.responseText.split(/\r\n|\r/);
            for (var i = 0; i < jsonObject.length; i++) {
                csvData.push(jsonObject[i].split(','));
            }
        }
    }

    MulitLanguageArgs.isLangDataText = function (textArgs) {
        const idList = csvData.map(x => x[0]).indexOf(textArgs);
        return idList == -1 ? false : true;
    }

    MulitLanguageArgs.getLangDataText = function (textArgs) {
        var text = '';
        const idList = csvData.map(x => x[0]).indexOf(textArgs);
        const nameList = csvData["0"].indexOf(args_Lanindex);
        text = csvData[idList][nameList];
        text = text.replace(/^\"|\"$/g, '');
        return text;
    }
})();