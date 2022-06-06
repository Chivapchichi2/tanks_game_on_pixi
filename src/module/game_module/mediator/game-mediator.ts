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
import { GameNames } from '../misk/game-names';
import { TanksNames } from '../../tanks_module/misc/tanks-names';
import { Global } from '../../global/misc/global-names';
import { BaseTank } from '../../tanks_module/tanks_factory/base_tank/base-tank';
import { Utils } from '../../global/utils/utils';
import { BaseBonus } from '../../bonus_module/bonus_factory/base_bonus/base-bonus';
import { gsap } from 'gsap';
import { MapNames } from '../../map_module/misk/map-names';

export class GameMediator {
	public app: PIXI.Application;
	protected view: GameView;
	protected proxy: GameProxy;
	protected game: Game;
	protected isLvlEnded: boolean = false;
	constructor(game: Game, width: number = 1024, height: number = 768) {
		this.app = new PIXI.Application({
			width,
			height,
			backgroundColor: 0x002030,
			antialias: true
		});
		this.game = game;
		this.app.stage.sortableChildren = true;
	}

	public play(): void {
		const state: State = this.game.state;
		if (state.name === GameNames.STATE_BOOT) {
			document.getElementById('app').appendChild(this.app.view);
			state.nextState(this.play.bind(this));
		}

		if (state.name === GameNames.STATE_PRELOAD) {
			this.proxy = new GameProxy(this.app, this.game, this);
			this.view = new GameView(this.app, this);
		}

		if (state.name === GameNames.STATE_GAME_TITLE) {
			this.view.drawTitle();
		}

		if (state.name === GameNames.STATE_MAIN) {
			this.proxy.score = 0;
			this.view.mainGame();
		}

		if (state.name === GameNames.STATE_GAME_OVER) {
			this.reset();
			this.view.gameOver();
		}
	}

	protected collisionCheck(a: any, b: any, side: string): boolean {
		if (_.isNil(b) || !b.collision) return false;
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
			if (
				obj.name === TanksNames.NAMES[0] + Global.BULLET &&
				this.proxy.lvl[row][column].name === MapNames.BRICK_WALL
			) {
				this.proxy.score++;
				this.changeScoreValue();
			}
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

		if (isTank) {
			_.each(this.proxy.bonuses, (bonus: BaseBonus) => {
				if (this.fullCollision(obj, bonus, side)) {
					bonus.collect(obj);
					if (obj.name === TanksNames.NAMES[0]) {
						this.proxy.score += 5;
						this.changeScoreValue();
					}
				}
			});
			if (this.waterCheck(obj)) {
				obj.drown();
			}
		}

		return firstCollision || secondCollision || tankCollision;
	}

	protected fullCollision(a: any, b: BaseTank | BaseBonus, side: string): boolean {
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

	protected waterCheck(obj: BaseTank): boolean {
		const [row, column] = Utils.getTitlePosition(obj.sprite);
		const tile = this.proxy.lvl[row][column];
		return tile && tile.name === MapNames.WATER;
	}

	public endGame(): void {
		document.onkeydown = null;
		this.proxy.win = false;
		gsap.delayedCall(1, () => {
			this.proxy.game.state.nextState(this.play.bind(this));
		});
	}

	public changeLivesValue(): void {
		this.view.changeLivesValue();
	}

	public changeScoreValue(): void {
		this.view.changeScoreValue();
		this.proxy.loader.loader.resources.score_collect.sound.play();
	}

	public drawTanksLeft(): void {
		this.view.drawTanksLeft();
	}

	public levelEnd(): void {
		if (this.isLvlEnded) return;
		this.isLvlEnded = true;
		if (this.proxy.gameLevels.length < 1) {
			document.onkeydown = null;
			this.proxy.win = true;
			gsap.delayedCall(1, () => {
				this.proxy.game.state.nextState(this.play.bind(this));
				this.isLvlEnded = false;
			});
		} else {
			this.proxy.loader.loader.resources.lvl_win.sound.play();
			this.proxy.score += this.view.timer.getScore();
			this.changeScoreValue();
			gsap.delayedCall(3, () => {
				this.reset();
				this.proxy.newLvl();
				this.view.mainGame();
				this.isLvlEnded = false;
			});
		}
	}

	public addNewEnemy(): void {
		this.view.addNewEnemy(this.proxy.gameRound);
	}

	protected reset(): void {
		this.view.reset();
	}
}
