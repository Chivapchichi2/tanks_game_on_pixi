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
import { Point, Rectangle, Sprite } from 'pixi.js';
import { GameProxy } from '../../game_module/proxy/game-proxy';
import { IBounds } from '../misc/interfaces';

export class Element {
	public sprite: Sprite;
	public name: string;
	protected gameProxy: GameProxy;
	constructor(name: string) {
		this.name = name;
		this.gameProxy = new GameProxy();
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
}
