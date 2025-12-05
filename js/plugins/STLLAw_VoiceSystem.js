
//=============================================================================
// STLLAw_VoiceSystem.js
//=============================================================================

/*:
 * @plugindesc 追加一個Voice播放(基本音量和SE共用)
 * @author STILILA
 *
 * @help
 * ＜說明＞
 *   檔案放在audio/voice
 *
 * ＜插件指令＞
 *   播放voice
 *     Voice play 檔名 音量 音調 偏移
 *   停止voice
 *     Voice stop
 *
 *  申訴管道：
 *  http://home.gamer.com.tw/homeindex.php?owner=qootm2
 */


AudioManager._voiceBuffer = null;

AudioManager.playVoice = function(voice) {
	// 還在播放就中斷
	if (this._voiceBuffer && this._voiceBuffer.isPlaying()) {
		return;
	}
    if (voice.name) {
        this._voiceBuffer = this.createBuffer('voice', voice.name);
        this.updateVoiceParameters(voice);
        this._voiceBuffer.play(false);
		this._voiceBuffer.addStopListener(this.stopVoice.bind(this))
    }
};

AudioManager.updateVoiceParameters = function(voice) {
    this.updateBufferParameters(this._voiceBuffer, this._seVolume, voice);
};

AudioManager.stopVoice = function() {
	if (this._voiceBuffer){
		this._voiceBuffer.stop()
		this._voiceBuffer = null;
	}

};



(function(){
	var _AudioManager_stopAll = AudioManager.stopAll;
	AudioManager.stopAll = function() {
		_AudioManager_stopAll.call(this);
		this.stopVoice();
	};
	
	
	var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args) {
		_Game_Interpreter_pluginCommand.call(this, command, args);
		if (command === 'Voice') {
			switch (args[0]) {
			case 'play':
				AudioManager.playVoice({'name':args[1], 'volume':Number(args[2]), 'pitch':Number(args[3]), 'pan':Number(args[4])})
				break;
			case 'stop':
				AudioManager.stopVoice()
				break;
			}
		}
	};
	
	
})()
