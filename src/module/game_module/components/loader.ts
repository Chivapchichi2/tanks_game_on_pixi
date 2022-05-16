/**
 * iSOFTBET
 * Copyright 2022 iSOFTBET
 * All Rights Reserved.
 *
 * NOTICE: You may not use, distribute or modify this document without the
 * written permission of its copyright owner
 *
 * Created by Pavlo Ivchenko on 12.05.2022
 */
import * as _ from 'lodash';
import * as PIXI from 'pixi.js';

export class Loader {
	public loader: PIXI.Loader;
	protected emptyBar: PIXI.Sprite;
	protected foolBar: PIXI.Sprite;
	protected display: PIXI.Container;
	constructor(display: PIXI.Container, clb: Function) {
		this.loader = PIXI.Loader.shared;
		this.display = display;
		this.loader.add('emptyBarTexture', './assets/loader bar/loader-bar.png');
		this.loader.add('foolBarTexture', './assets/loader bar/loader-bg.png');
		this.loader.load((loader, resources) => {
			this.emptyBar = new PIXI.TilingSprite(resources.emptyBarTexture.texture, 800, 50);
			this.emptyBar.position.set(100, 400);
			this.foolBar = new PIXI.TilingSprite(resources.foolBarTexture.texture, 0, 50);
			this.foolBar.position.set(100, 400);
			this.display.addChild(this.emptyBar, this.foolBar);
			this.starLoading(clb);
		});
	}

	public starLoading(clb: Function): void {
		this.loader.add('eagle', './assets/board/eagle.png');
		this.loader.add('leaves', './assets/board/leaves.png');
		this.loader.add('small_wall_1', './assets/board/small_wall_1.png');
		this.loader.add('small_wall_2', './assets/board/small_wall_2.png');
		this.loader.add('small_wall_3', './assets/board/small_wall_3.png');
		this.loader.add('small_wall_4', './assets/board/small_wall_4.png');
		this.loader.add('wall', './assets/board/wall.png');
		this.loader.add('water', './assets/board/water.png');
		this.loader.add('bonus_immortal', './assets/bonus/bonus_immortal.png');
		this.loader.add('bonus_live', './assets/bonus/bonus_live.png');
		this.loader.add('bonus_slow', './assets/bonus/bonus_slow.png');
		this.loader.add('bonus_speed', './assets/bonus/bonus_speed.png');
		this.loader.add('scr1', './assets/screens/scr1.png');
		this.loader.add('scr3', './assets/screens/scr3.png');
		this.loader.add('bonus', './assets/sounds/bonus.wav');
		this.loader.add('explode_sound', './assets/sounds/explode.wav');
		this.loader.add('hit', './assets/sounds/hit.wav');
		this.loader.add('lose', './assets/sounds/lose.wav');
		this.loader.add('shot', './assets/sounds/shot.wav');
		this.loader.add('win', './assets/sounds/win.wav');
		this.loader.add('start', './assets/sounds/start.mp3');
		this.loader.add('move', './assets/sounds/move.mp3');
		this.loader.add('eagle-destroy', './assets/sounds/eagle-destroy.mp3');
		this.loader.add('enemy_blue', './assets/tanks/enemy_blue.png');
		this.loader.add('enemy_red', './assets/tanks/enemy_red.png');
		this.loader.add('enemy_white', './assets/tanks/enemy_white.png');
		this.loader.add('tank', './assets/tanks/tank.png');
		this.loader.add('appear', './assets/appear.png');
		this.loader.add('bullet', './assets/bullet.png');
		this.loader.add('button', './assets/button.png');
		this.loader.add('enemy_bullet', './assets/enemy_bullet.png');
		this.loader.add('explode', './assets/explode.png');
		this.loader.add('explode_small', './assets/explode_small.png');
		this.loader.add('scores', './assets/scores.png');
		this.loader.onLoad.add((loader) => {
			const length = _.keys(loader.resources).length - 2;
			this.foolBar.width += 800 / length;
		});
		this.loader.onComplete.add(() => {
			clb();
		});
	}
}
