/**
 * iSOFTBET
 * Copyright 2022 iSOFTBET
 * All Rights Reserved.
 *
 * NOTICE: You may not use, distribute or modify this document without the
 * written permission of its copyright owner
 *
 * Created by Pavlo Ivchenko on 04.06.2022
 */
import * as _ from 'lodash';
import { BonusNames } from '../misk/bonus-names';
import { BonusImmortal } from './bonus_immortal/bonus-immortal';
import { BonusLive } from './bonus_live/bonus-live';
import { BonusSpeed } from './bonus_speed/bonus-speed';
import { BonusSlow } from './bonus_slow/bonus-slow';

export class BonusFactory {
	protected bonuses: string[] = [BonusNames.IMMORTAL, BonusNames.LIVE, BonusNames.SPEED, BonusNames.SLOW];
	public getBonus(): void {
		const name: string = this.bonuses[_.random(this.bonuses.length - 1)];
		switch (name) {
			case BonusNames.IMMORTAL:
				return new BonusImmortal(name).getBonus();
			case BonusNames.LIVE:
				return new BonusLive(name).getBonus();
			case BonusNames.SPEED:
				return new BonusSpeed(name).getBonus();
			case BonusNames.SLOW:
				return new BonusSlow(name).getBonus();
		}
	}
}
