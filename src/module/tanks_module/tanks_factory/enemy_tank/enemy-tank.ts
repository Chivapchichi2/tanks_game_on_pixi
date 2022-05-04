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
import { BaseTank } from '../base_tank/base-tank';
import { TanksNames } from '../../misc/tanks-names';

export class EnemyTank extends BaseTank {
	constructor() {
		super();
		this._name = TanksNames.TANKS_NAMES[1];
		this.texturePath = TanksNames.ENEMY_TANK_TEXTURE[_.random(2)];
		this.texture = PIXI.Texture.from(this.texturePath);
	}
}