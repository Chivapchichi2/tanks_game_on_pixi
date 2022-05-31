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
// import * as _ from 'lodash';
import { gsap } from 'gsap';
import { BaseTexture } from '../base_texture/base-texture';
import { Sprite, Texture } from 'pixi.js';
import { Global } from '../../../global/misc/names';

export class BrickWall extends BaseTexture {
	protected textures: Texture[] = [];
	constructor(row: number, column: number) {
		super(row, column);
		this.name = 'brickWall';
		this.texture = this.gameProxy.loader.loader.resources.small_wall_1.texture;
		const texture2: Texture = this.gameProxy.loader.loader.resources.small_wall_2.texture;
		const texture3: Texture = this.gameProxy.loader.loader.resources.small_wall_3.texture;
		const texture4: Texture = this.gameProxy.loader.loader.resources.small_wall_4.texture;
		this.textures.push(this.texture, texture2, texture3, texture4);
		this.destroyable = false;
		this.collision = true;
	}

	public getTexture(): Sprite {
		const sprite1 = super.getTexture();
		sprite1.position.set(-9, -9);
		const sprite2 = new Sprite(this.textures[1]);
		sprite2.anchor.set(0.5);
		sprite2.position.set(9, -9);
		const sprite3 = new Sprite(this.textures[2]);
		sprite3.anchor.set(0.5);
		sprite3.position.set(-9, 9);
		const sprite4 = new Sprite(this.textures[3]);
		sprite4.anchor.set(0.5);
		sprite4.position.set(9, 9);
		this.sprite = new Sprite();
		this.sprite.anchor.set(0.5);
		this.sprite.addChild(sprite1, sprite2, sprite3, sprite4);
		return this.sprite;
	}

	public shot(side: string): void {
		this.gameProxy.score++;
		let index: number;
		let length: number = this.sprite.children.length;

		switch (side) {
			case Global.UP:
				index = length - 1;
				side = length > 2 ? side : Global.DOWN;
				break;
			case Global.RIGHT:
				index = length == 4 ? 2 : 0;
				side = length > 2 ? side : Global.LEFT;
				break;
			case Global.DOWN:
				index = 0;
				side = length > 2 ? side : Global.UP;
				break;
			case Global.LEFT:
				index = length == 4 ? 1 : length - 1;
				side = length > 2 ? side : Global.RIGHT;
				break;
		}
		if (length) {
			this.sprite.removeChildAt(index);
			length--;
			if (!length) {
				gsap.delayedCall(0.8, () => {
					this.sprite.destroy();
					this.gameProxy.lvl[this.row][this.column] = null;
				});
			}
		}
		super.shot(side);
	}
}
