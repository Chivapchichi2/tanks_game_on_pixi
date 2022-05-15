/**
 * iSOFTBET
 * Copyright 2022 iSOFTBET
 * All Rights Reserved.
 *
 * NOTICE: You may not use, distribute or modify this document without the
 * written permission of its copyright owner
 *
 * Created by Pavlo Ivchenko on 09.05.2022
 */
import * as _ from 'lodash';
import * as PIXI from 'pixi.js';
import { GameProxy } from '../proxy/game-proxy';

export class GameView {
	protected gameProxy: GameProxy;
	protected app: PIXI.Application;

	constructor(app: PIXI.Application) {
		this.app = app;
		this.gameProxy = new GameProxy(app);
		this.app.ticker.add(() => {
			_.each(this.gameProxy.bullets, this.move.bind(this));
		});
	}

	protected move(sprite: PIXI.Sprite): void {
		if (sprite) {
			switch (sprite.name) {
				case 'up':
					this.moveUp(sprite);
					break;
				case 'right':
					this.moveRight(sprite);
					break;
				case 'down':
					this.moveDown(sprite);
					break;
				case 'left':
					this.moveLeft(sprite);
					break;
				default:
					this.moveUp(sprite);
			}
		}
	}

	protected moveUp(sprite: PIXI.Sprite): void {
		if (sprite.y >= this.gameProxy.borders.up + sprite.getBounds().height / 2) {
			sprite.y -= this.gameProxy.bulletSpeed;
		} else {
			_.remove(this.gameProxy.bullets, sprite);
			sprite.destroy();
		}
	}

	protected moveDown(sprite: PIXI.Sprite): void {
		if (sprite.y <= this.gameProxy.borders.down - sprite.getBounds().height / 2) {
			sprite.y += this.gameProxy.bulletSpeed;
		} else {
			_.remove(this.gameProxy.bullets, sprite);
			sprite.destroy();
		}
	}

	protected moveLeft(sprite: PIXI.Sprite): void {
		if (sprite.x >= this.gameProxy.borders.left + sprite.getBounds().height / 2) {
			sprite.x -= this.gameProxy.bulletSpeed;
		} else {
			_.remove(this.gameProxy.bullets, sprite);
			sprite.destroy();
		}
	}

	protected moveRight(sprite: PIXI.Sprite): void {
		if (sprite.x <= this.gameProxy.borders.right - sprite.getBounds().height / 2) {
			sprite.x += this.gameProxy.bulletSpeed;
		} else {
			_.remove(this.gameProxy.bullets, sprite);
			sprite.destroy();
		}
	}
}
