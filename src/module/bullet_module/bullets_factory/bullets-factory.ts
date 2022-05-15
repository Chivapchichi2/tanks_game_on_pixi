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

import { TanksNames } from '../../tanks_module/misc/tanks-names';
import { PlayerBullet } from './player_bullet/player-bullet';

export class BulletsFactory {
	constructor(name: string) {
		if (name === TanksNames.NAMES[0]) {
			return new PlayerBullet(TanksNames.NAMES[0]);
		} else {
			return null;
		}
		// 	else if (name === TanksNames.NAMES[1]) {
		// 		return new EnemyBullet(TanksNames.NAMES[1]);
		// }
	}
}
