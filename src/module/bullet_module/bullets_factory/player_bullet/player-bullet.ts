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
import { BaseBullet } from '../base_bullet/base-bullet';
import { TanksNames } from '../../../tanks_module/misc/tanks-names';
import * as PIXI from 'pixi.js';

export class PlayerBullet extends BaseBullet {
	constructor(name: string) {
		super(name);
		this.textureBulletPath = TanksNames.BULLET_TEXTURE[0];
		this.textureBullet = PIXI.Texture.from(this.textureBulletPath);
	}
}
