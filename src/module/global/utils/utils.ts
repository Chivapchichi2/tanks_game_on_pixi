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
import { Sprite } from 'pixi.js';
import { Global } from '../misc/global-names';

export class Utils {
	public static getTitlePosition(sprite: Sprite): number[] {
		const row = Math.floor((sprite.position.y - Global.TALE_SIZE / 2) / Global.TALE_SIZE);
		const column = Math.floor((sprite.position.x - Global.TALE_SIZE / 2) / Global.TALE_SIZE);
		return [row, column];
	}

	public static checkHorizontal(sprite: Sprite, column: number): number {
		const bounds = sprite.getBounds();
		const x1 = Math.floor((bounds.x - Global.TALE_SIZE / 2) / Global.TALE_SIZE);
		const x2 = Math.floor((bounds.x + bounds.width - Global.TALE_SIZE / 2) / Global.TALE_SIZE);
		return x1 === column ? x2 : x1;
	}

	public static checkVertical(sprite: Sprite, row: number): number {
		const bounds = sprite.getBounds();
		const y1 = Math.floor((bounds.y - Global.TALE_SIZE / 2) / Global.TALE_SIZE);
		const y2 = Math.floor((bounds.y + bounds.height - Global.TALE_SIZE / 2) / Global.TALE_SIZE);
		return y1 === row ? y2 : y1;
	}
}
