/**
 * iSOFTBET
 * Copyright 2022 iSOFTBET
 * All Rights Reserved.
 *
 * NOTICE: You may not use, distribute or modify this document without the
 * written permission of its copyright owner
 *
 * Created by Pavlo Ivchenko on 09.05.2022
 */
import * as PIXI from 'pixi.js';
import { Element } from '../../../global/utils/element';

export class BaseBullet extends Element {
	protected textureBullet: PIXI.Texture;

	public makeBullet(container: PIXI.Container, position: PIXI.Point, side: string): void {
		this.sprite = new PIXI.Sprite(this.textureBullet);
		this.sprite.name = side;
		this.sprite.anchor.set(0.5);
		this.sprite.position.copyFrom(position);
		container.addChild(this.sprite);
		this.gameProxy.bullets.push(this);
		this.gameProxy.loader.loader.resources.shot.sound.play();
	}
}
