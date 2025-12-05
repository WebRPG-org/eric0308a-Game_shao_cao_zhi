
//=============================================================================
// STLLAw_ShowPictruePercent.js
//=============================================================================

/*:
 * @plugindesc 可用%數顯示圖片
 * @author STILILA
 *
 * @help 
*   $gameScreen.showPicturePercent(id, 檔名, 對齊方式, x, y, 不透明度, 合成方式, %數, 方向(2、4、6、8))
 *
 *  申訴管道：
 *  http://home.gamer.com.tw/homeindex.php?owner=qootm2
 */


(function() {
	
	Game_Screen.prototype.showPicturePercent = function(pictureId, name, origin, x, y, 
                                             opacity, blendMode, percent, percentDir) {
		var realPictureId = this.realPictureId(pictureId);
		var picture = new Game_Picture();
		picture.showPercent(name, origin, x, y, opacity, blendMode, percent, percentDir);
		this._pictures[realPictureId] = picture;
	};
	
	
	var _Game_Picture_initBasic = Game_Picture.prototype.initBasic;
	Game_Picture.prototype.initBasic = function() {
		_Game_Picture_initBasic.call(this)
		this.initPercent();
	};

    Game_Picture.prototype.showPercent = function(name, origin, x, y, opacity, blendMode, percent, percentDir) {
		this._name = name;
		this._origin = origin;
		this._x = x;
		this._y = y;
		this._scaleX = 100;
		this._scaleY = 100;
		this._opacity = opacity;
		this._blendMode = blendMode;
		this.initTarget();
		this.initTone();
		this.initRotation();
		this.initPercent();
		this._percentDir = percentDir;
		switch (this._percentDir){
			case 8:
			case 2:
				this._percentY = percent / 100
				break;
			case 6:
			case 4:
				this._percentX = percent / 100
				break;
			
		}
	};
	
    Game_Picture.prototype.initPercent = function() {
		this._percentX = 1;
		this._percentY = 1;
		this._percentDir = 6;
	};
	
	Game_Picture.prototype.PercentX = function(){
		return this._percentX
	}
	Game_Picture.prototype.PercentY = function(){
		return this._percentY
	}
	Game_Picture.prototype.PercentDir = function(){
		return this._percentDir
	}
	
	Game_Picture.prototype.setupPercentPos = function(plusX, plusY){
		switch (this._percentDir){
			case 8:
				this._y += plusY
				break;
			case 4:
				this._x += plusX
				break;
		}
	}
	
	var _Sprite_Picture_initialize = Sprite_Picture.prototype.initialize;
	Sprite_Picture.prototype.initialize = function(pictureId) {
		this._percentX = this._percentY = 1
		this._percentDir = 6
		_Sprite_Picture_initialize.call(this, pictureId)
	};
	
	var _Sprite_Picture_updateBitmap = Sprite_Picture.prototype.updateBitmap
	Sprite_Picture.prototype.updateBitmap = function() {
		_Sprite_Picture_updateBitmap.call(this)
		var picture = this.picture();
		if (picture) {
			if (this._percentX !== picture.PercentX() || this._percentY !== picture.PercentY() || this._percentDir !== picture.PercentDir()){
				this._percentX = picture.PercentX()
				this._percentY = picture.PercentY()
				this._percentDir = picture.PercentDir()
				
				var source = ImageManager.loadPicture(this._pictureName);
				
				if (!source.isReady()){
					source.addLoadListener(function() {
						this.setupPercent();
					}.bind(this))
				} else {
					this.setupPercent();
				}
			}
		}
	};
	
	Sprite_Picture.prototype.setupPercent = function() {
		var picture = this.picture();
		var source = ImageManager.loadPicture(this._pictureName);
		this.bitmap = new Bitmap(source.width, source.height);
		var sx = 0
		var sy = 0
		switch (picture.PercentDir()){
			case 8:
				sy = (1 - picture.PercentY()) * source.height
				var sh = source.height - sy
				this.bitmap.blt(source, 0, sy, source.width, sh, 0, 0)
				break;
			case 2:
				var sh = picture.PercentY() * source.height
				this.bitmap.blt(source, 0, 0, source.width, sh, 0, 0)
				break;	
			case 6:
				var sw = picture.PercentX() * source.width
				this.bitmap.blt(source, 0, 0, sw, source.height, 0, 0)
				break;
			case 4:
				sx = (1 - picture.PercentX()) * source.width
				var sw = source.width - sx
				this.bitmap.blt(source, sx, 0, sw, source.height, 0, 0)
				break;
		}
		picture.setupPercentPos(sx, sy);
	}
	
	
	
	
})()