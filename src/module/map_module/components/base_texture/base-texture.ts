/**
 * iSOFTBET
 * Copyright 2022 iSOFTBET
 * All Rights Reserved.
 *
 * NOTICE: You may not use, distribute or modify this document without the
 * written permission of its copyright owner
 *
 * Created by Pavlo Ivchenko on 15.05.2022
 */
import { Texture, Sprite, Rectangle, AnimatedSprite } from 'pixi.js';
import { Element } from '../../../global/utils/element';
import { Global } from '../../../global/misc/names';

export class BaseTexture extends Element {
	public destroyable: boolean;
	public collision: boolean;
	public row: number;
	public column: number;
	protected texture: Texture;
	constructor(row: number, column: number, name: string = '') {
		super(name);
		this.row = row;
		this.column = column;
	}

	public getTexture(): Sprite {
		if (!this.texture) return null;
		this.sprite = new Sprite(this.texture);
		this.sprite.anchor.set(0.5);
		return this.sprite;
	}

	public shot(side?: string): void {
		if (this.collision) this.explode(side);
	}

	protected explode(side?: string): void {
		const texture = this.gameProxy.loader.loader.resources.explode_small.texture;
		const textureArray = [];
		for (let i = 0; i < 8; i++) {
			const t = texture.clone();
			t.frame = new Rectangle(i * 48, 0, 48, 48);
			t.updateUvs();
			textureArray.push(t);
		}
		const animatedSprite = new AnimatedSprite(textureArray);
		animatedSprite.anchor.set(0.5);
		switch (side) {
			case Global.UP:
				animatedSprite.position.set(0, 12);
				break;
			case Global.RIGHT:
				animatedSprite.position.set(-12, 0);
				break;
			case Global.DOWN:
				animatedSprite.position.set(0, -12);
				break;
			case Global.LEFT:
				animatedSprite.position.set(12, 0);
				break;
		}
		this.sprite.addChild(animatedSprite);
		animatedSprite.animationSpeed = 0.15;
		animatedSprite.loop = false;
		animatedSprite.onComplete = () => {
			this.sprite.removeChild(animatedSprite);
			animatedSprite.destroy();
		};
		animatedSprite.play();
		this.gameProxy.loader.loader.resources.explode_sound.sound.play();
	}
}
