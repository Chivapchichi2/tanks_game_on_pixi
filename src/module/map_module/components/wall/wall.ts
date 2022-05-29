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
import { BaseTexture } from '../base_texture/base-texture';

export class Wall extends BaseTexture {
	constructor(row: number, column: number) {
		super(row, column);
		this.name = 'wall';
		this.texture = this.gameProxy.loader.loader.resources.wall.texture;
		this.destroyable = false;
		this.collision = true;
	}
}
