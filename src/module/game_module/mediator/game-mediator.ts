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
import { TanksNames } from '../../tanks_module/misc/tanks-names';
import { Global } from '../../global/misc/names';
import { BaseTank } from '../../tanks_module/tanks_factory/base_tank/base-tank';
import { Utils } from '../../global/utils/utils';

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
			this.proxy.score = 0;
			this.view.mainGame();
		}

		if (state.name === Names.STATE_GAME_OVER) {
			this.view.gameOver();
		}
	}

	protected collisionCheck(a: any, b: any, side: string): boolean {
		if (_.isNil(b)) return false;
		const aObj = a.getBounds();
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

	public collisionDetect(obj: any, side: string): boolean {
		let [row, column] = Utils.getTitlePosition(obj.sprite);
		let row1 = row,
			column1 = column;
		const isTank: boolean = _.includes(TanksNames.NAMES, obj.name);
		switch (side) {
			case Global.UP:
				column1 = Utils.checkHorizontal(obj.sprite, column);
				if (isTank) {
					row--;
					row1--;
				}
				break;
			case Global.DOWN:
				column1 = Utils.checkHorizontal(obj.sprite, column);
				if (isTank) {
					row++;
					row1++;
				}
				break;
			case Global.LEFT:
				row1 = Utils.checkVertical(obj.sprite, row1);
				if (isTank) {
					column--;
					column1--;
				}
				break;
			case Global.RIGHT:
				row1 = Utils.checkVertical(obj.sprite, row1);
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

		let tankCollision = false;
		const tanks: any[] = _.filter(this.proxy.tanks, (tank) => tank !== obj);
		_.each(tanks, (tank) => {
			if (tank.name + Global.BULLET !== obj.name && this.fullCollision(obj, tank, side)) {
				tankCollision = true;
				if (_.includes(obj.name, Global.BULLET)) {
					tank.destroy();
				}
			}
		});

		return firstCollision || secondCollision || tankCollision;
	}

	protected fullCollision(a: any, b: BaseTank, side: string): boolean {
		const aObj = a.getBounds();
		const bObj = b.getBounds();
		switch (side) {
			case Global.UP:
				aObj.maxY -= 3;
				break;
			case Global.DOWN:
				aObj.minY += 3;
				break;
			case Global.LEFT:
				aObj.minX -= 3;
				break;
			case Global.RIGHT:
				aObj.maxX += 3;
				break;
		}
		return aObj.minX < bObj.maxX && aObj.maxX > bObj.minX && aObj.minY < bObj.maxY && aObj.maxY > bObj.minY;
	}
}
