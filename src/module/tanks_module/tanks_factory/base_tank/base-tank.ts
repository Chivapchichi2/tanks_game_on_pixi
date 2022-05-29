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

export class BaseTank extends Element {
	protected bullet: BaseBullet;
	protected _lives = 1;
	protected _speed = 2;
	protected texture: PIXI.Texture;
	protected container: PIXI.Container;
	protected collisionDetect: Function;
	protected time: number = 0;

	constructor(name: string, collisionDetect: Function) {
		super(name);
		this.bullet = new BulletsFactory(name) as BaseBullet;
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
		if (_.isNil(this.gameProxy)) {
			this.gameProxy = new GameProxy();
		}
		this.gameProxy.tanks.push(this.sprite);
		this.container.addChild(this.sprite);
		this.sprite.interactive = true;
		if (this.name === TanksNames.NAMES[0]) {
			document.onkeydown = this.play.bind(this);
		}
	}

	public play(e: KeyboardEvent): void {
		if (this.name === TanksNames.NAMES[0]) {
			if (e.code === 'ArrowDown' || e.code === 'KeyS') {
				this.moveDown();
				this.gameProxy.loader.loader.resources.move.sound.play({ start: 0, end: 0.1 });
			}
			if (e.code === 'ArrowUp' || e.code === 'KeyW') {
				this.moveUp();
				this.gameProxy.loader.loader.resources.move.sound.play({ start: 0, end: 0.1 });
			}
			if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
				this.moveLeft();
				this.gameProxy.loader.loader.resources.move.sound.play({ start: 0, end: 0.1 });
			}
			if (e.code === 'ArrowRight' || e.code === 'KeyD') {
				this.moveRight();
				this.gameProxy.loader.loader.resources.move.sound.play({ start: 0, end: 0.1 });
			}
			if (e.code === 'Space') {
				const time = Date.now();
				if (time > this.time + 1000) {
					this.time = time;
					const side = this.getSide(_.round(this.sprite.rotation));
					const position = this.getBulletPosition(this.sprite.position, side);
					this.shot(position, side);
				}
			}
		}
	}

	protected moveUp(): void {
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

	protected moveDown(): void {
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

	protected moveLeft(): void {
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

	protected moveRight(): void {
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

	protected shot(position: PIXI.Point, side: string): void {
		this.bullet.makeBullet(this.container, position, side);
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
}
