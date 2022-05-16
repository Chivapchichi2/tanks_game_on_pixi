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

export class PlayerTank extends BaseTank {
	constructor(name: string) {
		super(name);
		this.texture = this.gameProxy.loader.loader.resources.tank.texture;
	}
}
