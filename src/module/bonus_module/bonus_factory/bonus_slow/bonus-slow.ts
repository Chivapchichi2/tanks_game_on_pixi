/**
 * iSOFTBET
 * Copyright 2022 iSOFTBET
 * All Rights Reserved.
 *
 * NOTICE: You may not use, distribute or modify this document without the
 * written permission of its copyright owner
 *
 * Created by Pavlo Ivchenko on 05.06.2022
 */
import { BaseBonus } from '../base_bonus/base-bonus';
import { BaseTank } from '../../../tanks_module/tanks_factory/base_tank/base-tank';
import { gsap } from 'gsap';

export class BonusSlow extends BaseBonus {
	constructor(name: string) {
		super(name);
		this.texture = this.gameProxy.loader.loader.resources.bonus_slow.texture;
	}

	public collect(tank: BaseTank): void {
		super.collect(tank);
		tank.speed = tank.speed / 2;

		gsap.delayedCall(5, () => {
			tank.speed *= 2;
		});
	}
}
