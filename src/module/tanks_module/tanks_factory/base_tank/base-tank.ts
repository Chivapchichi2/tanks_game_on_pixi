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

export class BaseTank {
	protected gameProxy: GameProxy;
	protected bullet: BaseBullet;
	protected _name: string;
	protected _lives = 1;
	protected _speed = 2;
	protected texture: PIXI.Texture;
	protected sprite: PIXI.Sprite;
	protected container: PIXI.Container;

	constructor(name: string) {
		this._name = name;
		this.gameProxy = new GameProxy();
		this.bullet = new BulletsFactory(name) as BaseBullet;
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
		this.sprite.anchor.set(0.5);
		this.sprite.position.copyFrom(position);
		if (_.isNil(this.gameProxy)) {
			this.gameProxy = new GameProxy();
		}
		this.gameProxy.tanks.push(this.sprite);
		this.container.addChild(this.sprite);
		this.sprite.interactive = true;
		if (this._name === TanksNames.NAMES[0]) {
			document.onkeydown = this.play.bind(this);
		}
	}

	public play(e: KeyboardEvent): void {
		if (this._name === TanksNames.NAMES[0]) {
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
				const side = this.getSide(_.round(this.sprite.rotation));
				const position = this.getBulletPosition(this.sprite.position, side);
				this.shot(position, side);
			}
		}
	}

	protected moveUp(): void {
		gsap.to(this.sprite, { rotation: 0, duration: 0.2 });
		if (this.sprite.y >= this.gameProxy.borders.up + this.sprite.getBounds().height / 2) {
			this.sprite.y -= this.speed;
		}
	}

	protected moveDown(): void {
		gsap.to(this.sprite, { rotation: (180 * Math.PI) / 180, duration: 0.2 });
		if (this.sprite.y <= this.gameProxy.borders.down - this.sprite.getBounds().height / 2) {
			this.sprite.y += this.speed;
		}
	}

	protected moveLeft(): void {
		gsap.to(this.sprite, { rotation: (270 * Math.PI) / 180, duration: 0.2 });
		if (this.sprite.x >= this.gameProxy.borders.left + this.sprite.getBounds().width / 2) {
			this.sprite.x -= this.speed;
		}
	}

	protected moveRight(): void {
		gsap.to(this.sprite, { rotation: (90 * Math.PI) / 180, duration: 0.3 });
		if (this.sprite.x <= this.gameProxy.borders.right - this.sprite.getBounds().width / 2) {
			this.sprite.x += this.speed;
		}
	}

	protected shot(position: PIXI.Point, side: string): void {
		this.bullet.makeBullet(this.container, position, side);
	}

	protected getSide(side: number): string {
		switch (side) {
			case 0:
				return 'up';
			case 2:
				return 'right';
			case 3:
				return 'down';
			case 5:
				return 'left';
		}
	}

	protected getBulletPosition(position: PIXI.Point, side: string): PIXI.Point {
		let x = position.x;
		let y = position.y;
		switch (side) {
			case 'up':
				y -= 21;
				break;
			case 'right':
				x += 21;
				break;
			case 'down':
				y += 21;
				break;
			case 'left':
				x -= 21;
				break;
		}
		return new PIXI.Point(x, y);
	}
}
