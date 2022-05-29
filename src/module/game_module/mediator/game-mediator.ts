/**
 * iSOFTBET
 * Copyright 2022 iSOFTBET
 * All Rights Reserved.
 *
 * NOTICE: You may not use, distribute or modify this document without the
 * written permission of its copyright owner
 *
 * Created by Pavlo Ivchenko on 11.05.2022
 */
import * as _ from 'lodash';
import { GameProxy } from '../proxy/game-proxy';
import { GameView } from '../view/game-view';
import * as PIXI from 'pixi.js';
import { State } from '../misk/states';
import { Game } from '../game';
import { Names } from '../misk/names';
import { Sprite } from 'pixi.js';
import { TanksNames } from '../../tanks_module/misc/tanks-names';
import { Global } from '../../global/misc/names';

export class GameMediator {
	public app: PIXI.Application;
	protected view: GameView;
	protected proxy: GameProxy;
	protected game: Game;
	constructor(game: Game, width: number = 1024, height: number = 768) {
		this.app = new PIXI.Application({
			width,
			height,
			backgroundColor: 0x002030,
			antialias: true
		});
		this.game = game;
	}

	public play(): void {
		const state: State = this.game.state;
		if (state.name === Names.STATE_BOOT) {
			document.getElementById('app').appendChild(this.app.view);
			state.nextState(this.play.bind(this));
		}

		if (state.name === Names.STATE_PRELOAD) {
			this.proxy = new GameProxy(this.app, this.game, this);
			this.view = new GameView(this.app, this);
		}

		if (state.name === Names.STATE_GAME_TITLE) {
			this.view.drawTitle();
		}

		if (state.name === Names.STATE_MAIN) {
			this.view.mainGame();
		}
	}

	protected collisionCheck(a: any, b: any, side: string): boolean {
		if (_.isNil(b)) return false;
		let aObj = a.getBounds();
		if (aObj.x && aObj.y) {
			const minX = aObj.x;
			const maxX = aObj.x + aObj.width;
			const minY = aObj.y;
			const maxY = aObj.y + aObj.height;
			aObj = { minX, maxX, minY, maxY };
		}
		const bObj = b.getBounds();
		switch (side) {
			case Global.UP:
				return aObj.minY <= bObj.maxY;
			case Global.DOWN:
				return aObj.maxY >= bObj.minY;
			case Global.LEFT:
				return aObj.minX <= bObj.maxX;
			case Global.RIGHT:
				return aObj.maxX >= bObj.minX;
		}
	}

	protected checkHorizontal(sprite: Sprite, column: number): number {
		const bounds = sprite.getBounds();
		const x1 = Math.floor((bounds.x - 18) / 36);
		const x2 = Math.floor((bounds.x + bounds.width - 18) / 36);
		return x1 === column ? x2 : x1;
	}

	protected checkVertical(sprite: Sprite, row: number): number {
		const bounds = sprite.getBounds();
		const y1 = Math.floor((bounds.y - 18) / 36);
		const y2 = Math.floor((bounds.y + bounds.height - 18) / 36);
		return y1 === row ? y2 : y1;
	}

	protected getTitlePosition(sprite: Sprite): number[] {
		const row = Math.floor((sprite.position.y - 18) / 36);
		const column = Math.floor((sprite.position.x - 18) / 36);
		return [row, column];
	}

	public collisionDetect(obj: any, side: string): boolean {
		const a = obj.sprite ? obj.sprite : obj;
		let [row, column] = this.getTitlePosition(a);
		let row1 = row,
			column1 = column;
		const isTank: boolean = _.includes(TanksNames.NAMES, obj.name);
		switch (side) {
			case Global.UP:
				column1 = this.checkHorizontal(a, column);
				if (isTank) {
					row--;
					row1--;
				}
				break;
			case Global.DOWN:
				column1 = this.checkHorizontal(a, column);
				if (isTank) {
					row++;
					row1++;
				}
				break;
			case Global.LEFT:
				row1 = this.checkVertical(a, row1);
				if (isTank) {
					column--;
					column1--;
				}
				break;
			case Global.RIGHT:
				row1 = this.checkVertical(a, row1);
				if (isTank) {
					column++;
					column1++;
				}
				break;
		}

		const firstCollision = this.collisionCheck(obj, this.proxy.lvl[row][column], side);

		if (firstCollision && !isTank) {
			this.proxy.lvl[row][column].shot(side);
		}

		const secondCollision = this.collisionCheck(obj, this.proxy.lvl[row1][column1], side);

		if (secondCollision && !firstCollision && !isTank) {
			this.proxy.lvl[row1][column1].shot(side);
		}
		return firstCollision || secondCollision;
	}
}
