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

import { BaseTank } from '../base_tank/base-tank';
import { TanksNames } from '../../misc/tanks-names';
import { Container, Point } from 'pixi.js';
import { Global } from '../../../global/misc/global-names';

export class PlayerTank extends BaseTank {
	constructor(name: string, collisionDetect: Function) {
		super(name, collisionDetect);
		this.texture = this.gameProxy.loader.loader.resources.tank.texture;
		this.speed = 3;
	}

	public play(e?: KeyboardEvent): void {
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
				this.makeShot();
			}
			if (e.code === 'Escape') {
				this.destroy();
			}
		}
	}

	public drawTank(container: Container, position: Point): void {
		this.gameProxy.lives = this.lives;
		this.currentSide = Global.UP;
		super.drawTank(container, position);
	}

	public immortal(): void {
		super.immortal();
		const eagle = this.gameProxy.lvl[18][12];
		eagle.immortal();
	}
}
