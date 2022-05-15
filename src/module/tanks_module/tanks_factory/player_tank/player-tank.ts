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
import * as PIXI from 'pixi.js';

export class PlayerTank extends BaseTank {
	constructor(name: string) {
		super(name);
		this.texturePath = TanksNames.PLAYER_TANK_TEXTURE;
		this.texture = PIXI.Texture.from(this.texturePath);
	}
}
