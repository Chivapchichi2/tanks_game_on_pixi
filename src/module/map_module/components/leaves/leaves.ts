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
import { BaseTexture } from '../base_texture/base-texture';
import { Sprite } from 'pixi.js';
import { MapNames } from '../../misk/map-names';

export class Leaves extends BaseTexture {
	constructor(row: number, column: number) {
		super(row, column);
		this.name = MapNames.LEAVES;
		this.texture = this.gameProxy.loader.loader.resources.leaves.texture;
		this.destroyable = false;
		this.collision = false;
	}

	public getTexture(): Sprite {
		const sprite: Sprite = super.getTexture();
		sprite.zIndex = 2;
		return sprite;
	}
}
