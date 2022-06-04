import { Sprite } from 'pixi.js';

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

export class Utils {
	public static getTitlePosition(sprite: Sprite): number[] {
		const row = Math.floor((sprite.position.y - 18) / 36);
		const column = Math.floor((sprite.position.x - 18) / 36);
		return [row, column];
	}

	public static checkHorizontal(sprite: Sprite, column: number): number {
		const bounds = sprite.getBounds();
		const x1 = Math.floor((bounds.x - 18) / 36);
		const x2 = Math.floor((bounds.x + bounds.width - 18) / 36);
		return x1 === column ? x2 : x1;
	}

	public static checkVertical(sprite: Sprite, row: number): number {
		const bounds = sprite.getBounds();
		const y1 = Math.floor((bounds.y - 18) / 36);
		const y2 = Math.floor((bounds.y + bounds.height - 18) / 36);
		return y1 === row ? y2 : y1;
	}
}
