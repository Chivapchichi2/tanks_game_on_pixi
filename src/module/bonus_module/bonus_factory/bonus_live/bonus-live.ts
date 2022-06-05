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
import { TanksNames } from '../../../tanks_module/misc/tanks-names';

export class BonusLive extends BaseBonus {
	constructor(name: string) {
		super(name);
		this.texture = this.gameProxy.loader.loader.resources.bonus_live.texture;
	}

	public collect(tank: BaseTank): void {
		super.collect(tank);
		if (tank.name === TanksNames.NAMES[0]) {
			tank.lives++;
			this.gameProxy.lives = tank.lives;
			this.gameProxy.mediator.changeLivesValue();
		} else {
			this.gameProxy.enemyTanksLeft++;
			this.gameProxy.mediator.drawTanksLeft();
		}
	}
}
