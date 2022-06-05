/**
 * iSOFTBET
 * Copyright 2022 iSOFTBET
 * All Rights Reserved.
 *
 * NOTICE: You may not use, distribute or modify this document without the
 * written permission of its copyright owner
 *
 * Created by Pavlo Ivchenko on 04.06.2022
 */
import * as _ from 'lodash';
import { Element } from '../../../global/utils/element';
import { BaseTank } from '../../../tanks_module/tanks_factory/base_tank/base-tank';
import { Point, Sprite, Texture } from 'pixi.js';
import { Global } from '../../../global/misc/names';

export class BaseBonus extends Element {
	protected texture: Texture;

	public getBonus(): void {
		const position: Point = this.getPosition();
		this.sprite = new Sprite(this.texture);
		this.sprite.name = this.name;
		this.sprite.anchor.set(0.5);
		this.sprite.position.copyFrom(position);
		this.gameProxy.app.stage.addChild(this.sprite);
		this.gameProxy.bonuses.push(this);
		this.gameProxy.loader.loader.resources.bonus_appear.sound.play();
	}

	public collect(tank: BaseTank): void {
		this.gameProxy.loader.loader.resources.bonus.sound.play();
		this.gameProxy.bonuses = _.filter(this.gameProxy.bonuses, (bonus: BaseBonus) => bonus !== this);
		this.gameProxy.score += 5;
		this.sprite.destroy();
	}

	protected getPosition(): Point {
		const randomTale: number = _.random(this.gameProxy.emptyTales.rows.length - 1);
		const x = Global.TALE_SIZE * (this.gameProxy.emptyTales.columns[randomTale] + 1);
		const y = Global.TALE_SIZE * (this.gameProxy.emptyTales.rows[randomTale] + 1);
		return new Point(x, y);
	}
}
