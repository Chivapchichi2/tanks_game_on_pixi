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

import { TanksNames } from '../misc/tanks-names';
import { PlayerTank } from './player_tank/player-tank';
import { EnemyTank } from './enemy_tank/enemy-tank';
import { BaseTank } from './base_tank/base-tank';

export class TanksFactory {
	getTank(name: string): BaseTank {
		if (name === TanksNames.NAMES[0]) {
			return new PlayerTank(TanksNames.NAMES[0]);
		} else if (name === TanksNames.NAMES[1]) {
			return new EnemyTank(TanksNames.NAMES[1]);
		} else return null;
	}
}
