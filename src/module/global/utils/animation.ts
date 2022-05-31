/**
 * iSOFTBET
 * Copyright 2022 iSOFTBET
 * All Rights Reserved.
 *
 * NOTICE: You may not use, distribute or modify this document without the
 * written permission of its copyright owner
 *
 * Created by Pavlo Ivchenko on 29.05.2022
 */
import { AnimatedSprite, Rectangle } from 'pixi.js';
import { GameProxy } from '../../game_module/proxy/game-proxy';

export class Animation {
	public static SMALL_EXPLODE(proxy: GameProxy): AnimatedSprite {
		const texture = proxy.loader.loader.resources.explode_small.texture;
		const textureArray = [];
		for (let i = 0; i < 8; i++) {
			const t = texture.clone();
			t.frame = new Rectangle(i * 48, 0, 48, 48);
			t.updateUvs();
			textureArray.push(t);
		}
		const animatedSprite = new AnimatedSprite(textureArray);
		animatedSprite.anchor.set(0.5);
		return animatedSprite;
	}

	public static EXPLODE(proxy: GameProxy): AnimatedSprite {
		const texture = proxy.loader.loader.resources.explode.texture;
		const textureArray = [];
		for (let i = 0; i < 16; i++) {
			const t = texture.clone();
			t.frame = new Rectangle(i * 68, 0, 68, 68);
			t.updateUvs();
			textureArray.push(t);
		}
		const animatedSprite = new AnimatedSprite(textureArray);
		animatedSprite.anchor.set(0.5);
		return animatedSprite;
	}

	public static APPEAR(proxy: GameProxy): AnimatedSprite {
		const texture = proxy.loader.loader.resources.appear.texture;
		const textureArray = [];
		for (let i = 0; i < 10; i++) {
			const t = texture.clone();
			t.frame = new Rectangle(i * 68, 0, 68, 68);
			t.updateUvs();
			textureArray.push(t);
		}
		const animatedSprite = new AnimatedSprite(textureArray);
		animatedSprite.anchor.set(0.5);
		return animatedSprite;
	}
}
