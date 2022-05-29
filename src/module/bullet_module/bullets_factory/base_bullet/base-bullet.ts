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
import { GameProxy } from '../../../game_module/proxy/game-proxy';
import * as _ from 'lodash';
import { Element } from '../../../global/utils/element';

export class BaseBullet extends Element {
	protected textureBullet: PIXI.Texture;

	public makeBullet(container: PIXI.Container, position: PIXI.Point, side: string): void {
		const bullet = new PIXI.Sprite(this.textureBullet);
		bullet.name = side;
		bullet.anchor.set(0.5);
		bullet.position.copyFrom(position);
		container.addChild(bullet);
		if (_.isNil(this.gameProxy)) {
			this.gameProxy = new GameProxy();
		}
		this.gameProxy.bullets.push(bullet);
		this.gameProxy.loader.loader.resources.shot.sound.play();
	}
}
