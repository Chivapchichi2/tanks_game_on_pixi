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
import { BaseTank } from '../base_tank/base-tank';
import { TanksNames } from '../../misc/tanks-names';

export class EnemyTank extends BaseTank {
	protected movements: Function[] = [this.moveUp, this.moveDown, this.moveLeft, this.moveRight];
	protected lastMove: Function;
	protected timer: number = 0;
	protected delayShot: number = 1500;
	constructor(name: string, collisionDetect: Function) {
		super(name, collisionDetect);
		const textureName = TanksNames.ENEMY_TANK_TEXTURE[_.random(2)];
		this.texture = this.gameProxy.loader.loader.resources[textureName].texture;
		this.lastMove = this.movements[1];
		this.timer = 120;
	}

	public play(): void {
		this.makeShot(this.delayShot);
		if (this.timer < 1) {
			this.timer = _.random(30, 180);
			this.lastMove = this.movements[_.random(3)];
		}
		if (this.sprite) {
			this.lastMove();
		}
		this.timer--;
	}

	public destroy(): void {
		super.destroy();
		this.lastMove = () => {};
		this.timer = 0;
	}
}
