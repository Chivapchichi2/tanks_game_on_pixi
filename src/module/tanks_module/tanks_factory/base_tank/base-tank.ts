/**
 * iSOFTBET
 * Copyright 2022 iSOFTBET
 * All Rights Reserved.
 *
 * NOTICE: You may not use, distribute or modify this document without the
 * written permission of its copyright owner
 *
 * Created by Pavlo Ivchenko on 04.05.2022
 */

import * as _ from 'lodash';
import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';
import { TanksNames } from '../../misc/tanks-names';
import { GameProxy } from '../../../game_module/proxy/game-proxy';
import { BaseBullet } from '../../../bullet_module/bullets_factory/base_bullet/base-bullet';
import { BulletsFactory } from '../../../bullet_module/bullets_factory/bullets-factory';
import { Element } from '../../../global/utils/element';
import { Global } from '../../../global/misc/names';
import { Animation } from '../../../global/utils/animation';

export class BaseTank extends Element {
	public appear: boolean = false;
	protected _lives = 1;
	protected _speed = 1;
	protected texture: PIXI.Texture;
	protected container: PIXI.Container;
	protected collisionDetect: Function;
	protected time: number = 0;
	protected destroyable: boolean = false;

	constructor(name: string, collisionDetect: Function) {
		super(name);

		this.collisionDetect = collisionDetect;
	}

	public set lives(lives: number) {
		this._lives = lives;
	}

	public get lives(): number {
		return this._lives;
	}

	public set speed(speed: number) {
		this._speed = speed;
	}

	public get speed(): number {
		return this._speed;
	}

	public drawTank(container: PIXI.Container, position: PIXI.Point): void {
		this.container = container;
		this.sprite = new PIXI.Sprite(this.texture);
		this.sprite.anchor.set(0.5, 0.6);
		this.sprite.position.copyFrom(position);
		if (this.name === TanksNames.NAMES[1]) {
			this.sprite.rotation = Math.PI;
		}
		if (_.isNil(this.gameProxy)) {
			this.gameProxy = new GameProxy();
		}

		const animatedSprite = Animation.APPEAR(this.gameProxy);
		animatedSprite.position.copyFrom(position);
		this.container.addChild(animatedSprite);
		animatedSprite.animationSpeed = 0.2;
		animatedSprite.loop = false;
		animatedSprite.onComplete = () => {
			this.container.removeChild(animatedSprite);
			animatedSprite.destroy();
			this.gameProxy.tanks.push(this);
			this.container.addChild(this.sprite);
			this.sprite.alpha = 0;
			gsap.to(this.sprite, {
				duration: 0.3,
				alpha: 1,
				repeat: 4,
				yoyo: true,
				onComplete: () => {
					if (this.name === TanksNames.NAMES[0]) {
						document.onkeydown = this.play.bind(this);
					}
					this.destroyable = true;
					this.appear = true;
				}
			});
		};
		animatedSprite.play();
	}

	protected moveUp(): void {
		if (this.sprite) {
			gsap.to(this.sprite, {
				rotation: 0,
				duration: 0.2,
				onComplete: () => {
					if (!this.collisionDetect(this, Global.UP)) {
						this.sprite.y -= this.speed;
					}
				}
			});
		}
	}

	protected moveDown(): void {
		if (this.sprite) {
			gsap.to(this.sprite, {
				rotation: Math.PI,
				duration: 0.2,
				onComplete: () => {
					if (!this.collisionDetect(this, Global.DOWN)) {
						this.sprite.y += this.speed;
					}
				}
			});
		}
	}

	protected moveLeft(): void {
		if (this.sprite) {
			gsap.to(this.sprite, {
				rotation: (3 * Math.PI) / 2,
				duration: 0.2,
				onComplete: () => {
					if (!this.collisionDetect(this, Global.LEFT)) {
						this.sprite.x -= this.speed;
					}
				}
			});
		}
	}

	protected moveRight(): void {
		if (this.sprite) {
			gsap.to(this.sprite, {
				rotation: Math.PI / 2,
				duration: 0.2,
				onComplete: () => {
					if (!this.collisionDetect(this, Global.RIGHT)) {
						this.sprite.x += this.speed;
					}
				}
			});
		}
	}

	protected shot(position: PIXI.Point, side: string): void {
		const bullet = new BulletsFactory(this.name + 'Bullet') as BaseBullet;
		bullet.makeBullet(this.container, position, side);
	}

	protected makeShot(delay: number = 1000): void {
		const time = Date.now();
		if (time > this.time + delay) {
			this.time = time;
			const side = this.getSide(_.round(this.sprite.rotation));
			const position = this.getBulletPosition(this.sprite.position, side);
			this.shot(position, side);
		}
	}

	protected getSide(side: number): string {
		switch (side) {
			case 0:
				return Global.UP;
			case 2:
				return Global.RIGHT;
			case 3:
				return Global.DOWN;
			case 5:
				return Global.LEFT;
		}
	}

	protected getBulletPosition(position: PIXI.Point, side: string): PIXI.Point {
		let x = position.x;
		let y = position.y;
		switch (side) {
			case Global.UP:
				y -= 16;
				break;
			case Global.RIGHT:
				x += 14;
				break;
			case Global.DOWN:
				y += 14;
				break;
			case Global.LEFT:
				x -= 14;
				break;
		}
		return new PIXI.Point(x, y);
	}

	public destroy(): void {
		if (!this.destroyable) return;

		const animatedSprite = Animation.EXPLODE(this.gameProxy);
		animatedSprite.position.copyFrom(this.sprite.position);
		try {
			this.gameProxy.app.stage.removeChild(this.sprite);
			this.sprite.destroy();
		} catch (error) {
			console.log(error);
		}

		this.gameProxy.tanks = _.filter(this.gameProxy.tanks, (el) => el != this);
		this.gameProxy.app.stage.addChild(animatedSprite);
		animatedSprite.animationSpeed = 0.2;
		animatedSprite.loop = false;
		animatedSprite.onComplete = () => {
			this.gameProxy.app.stage.removeChild(animatedSprite);
			animatedSprite.destroy();

			if (this.name === TanksNames.NAMES[0]) {
				document.onkeydown = null;
				this.gameProxy.win = false;
				gsap.delayedCall(1, () => {
					this.gameProxy.game.state.nextState(this.gameProxy.mediator.play.bind(this.gameProxy.mediator));
				});
			} else {
				this.gameProxy.score += 10;
			}
		};
		animatedSprite.play();
		this.gameProxy.loader.loader.resources.eagle_destroy.sound.play();
	}

	public play(): void {}
}
