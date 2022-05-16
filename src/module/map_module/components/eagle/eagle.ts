/**
 * iSOFTBET
 * Copyright 2022 iSOFTBET
 * All Rights Reserved.
 *
 * NOTICE: You may not use, distribute or modify this document without the
 * written permission of its copyright owner
 *
 * Created by Pavlo Ivchenko on 16.05.2022
 */
import { BaseTexture } from '../base_texture/base-texture';

export class Eagle extends BaseTexture {
	constructor() {
		super();
		this.name = 'eagle';
		this.texture = this.gameProxy.loader.loader.resources.eagle.texture;
		this.destroyable = true;
		this.collision = true;
	}
}
