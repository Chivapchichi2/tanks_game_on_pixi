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
import { Texture, Sprite } from 'pixi.js';
import { GameProxy } from '../../../game_module/proxy/game-proxy';
import { Rectangle, Point } from 'pixi.js';
import * as PIXI from 'pixi.js';

export class BaseTexture {
	public name: string;
	public destroyable: boolean;
	public collision: boolean;
	protected gameProxy: GameProxy;
	protected texture: Texture;
	protected sprite: Sprite;
	constructor() {
		this.gameProxy = new GameProxy();
	}

	public getTexture(): Sprite {
		if (!this.texture) return null;
		this.sprite = new Sprite(this.texture);
		this.sprite.anchor.set(0.5);
		return this.sprite;
	}

	public getBounds(): IBounds {
		const bounds: Rectangle = this.sprite.getBounds();
		const position: Point = this.sprite.position;
		const minX: number = position.x - bounds.width / 2;
		const maxX: number = position.x + bounds.width / 2;
		const minY: number = position.y - bounds.height / 2;
		const maxY: number = position.y + bounds.height / 2;
		return { minX, maxX, minY, maxY };
	}

	public shot(): void {
		this.explode();
	}

	protected explode(): void {
		const texture = this.gameProxy.loader.loader.resources.explode_small.texture;
		const textureArray = [];
		for (let i = 0; i < 8; i++) {
			const t = texture.clone();
			t.frame = new PIXI.Rectangle(i * 48, 0, 48, 48);
			t.updateUvs();
			textureArray.push(t);
		}
		const animatedSprite = new PIXI.AnimatedSprite(textureArray);
		animatedSprite.anchor.set(0.5);
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

export interface IBounds {
	minX: number;
	maxX: number;
	minY: number;
	maxY: number;
}
