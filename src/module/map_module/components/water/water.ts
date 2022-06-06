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
import { MapNames } from '../../misk/map-names';

export class Water extends BaseTexture {
	constructor(row: number, column: number) {
		super(row, column);
		this.name = MapNames.WATER;
		this.texture = this.gameProxy.loader.loader.resources.water.texture;
		this.destroyable = false;
		this.collision = false;
	}
}
