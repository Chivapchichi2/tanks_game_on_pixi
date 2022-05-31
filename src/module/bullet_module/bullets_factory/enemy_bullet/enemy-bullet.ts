import { BaseBullet } from '../base_bullet/base-bullet';

/**
 * iSOFTBET
 * Copyright 2022 iSOFTBET
 * All Rights Reserved.
 *
 * NOTICE: You may not use, distribute or modify this document without the
 * written permission of its copyright owner
 *
 * Created by Pavlo Ivchenko on 31.05.2022
 */

export class EnemyBullet extends BaseBullet {
	constructor(name: string) {
		super(name);
		this.textureBullet = this.gameProxy.loader.loader.resources.enemy_bullet.texture;
	}
}
