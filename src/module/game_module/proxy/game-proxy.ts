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
import * as _ from 'lodash';
import { Loader } from '../components/loader';
import { Game } from '../game';
import { GameMediator } from '../mediator/game-mediator';
import { TanksFactory } from '../../tanks_module/tanks_factory/tanks-factory';
import { MapUtils } from '../../map_module/utils/map-utils';
import { Utils } from '../../global/utils/utils';
import { Sprite, Application } from 'pixi.js';
import { BaseBonus } from '../../bonus_module/bonus_factory/base_bonus/base-bonus';
import { IEmptyTales } from '../../global/misc/interfaces';
import { BonusFactory } from '../../bonus_module/bonus_factory/bonus-factory';

export class GameProxy {
	public bullets: any[] = [];
	public tanks: any[] = [];
	public maxTanksOnMap: number;
	public enemyTanksLeft: number;
	public enemyTanksPanel: Sprite[] = [];
	public bonuses: BaseBonus[] = [];
	public map: number[][];
	public emptyTales: IEmptyTales = { rows: [], columns: [] };
	public lvl: any[][] = [[]];
	public bulletSpeed = 5;
	public loader: Loader;
	public app: Application;
	public game: Game;
	public tanksFactory: TanksFactory;
	public bonusFactory: BonusFactory;
	public mediator: GameMediator;
	public win: boolean;
	public score: number;
	public lives: number;
	public gameRound: number;
	public gameLevels = [MapUtils.LEVEL_1, MapUtils.LEVEL_2, MapUtils.LEVEL_3];
	protected static instance: GameProxy;
	protected static exists: boolean;
	constructor(app?: Application, game?: Game, mediator?: GameMediator) {
		if (GameProxy.exists) {
			return GameProxy.instance;
		}
		this.app = app;
		this.game = game;
		this.mediator = mediator;
		this.loader = new Loader(
			app.stage,
			this.game.state.nextState.bind(this, this.mediator.play.bind(this.mediator))
		);
		GameProxy.instance = this;
		GameProxy.exists = true;
		this.tanksFactory = new TanksFactory();
		this.bonusFactory = new BonusFactory();
		this.newGame();
		return this;
	}

	public static getInstance(): GameProxy {
		if (!GameProxy.instance) {
			GameProxy.instance = new GameProxy();
		}
		return GameProxy.instance;
	}

	public makeLvl(): void {
		this.lvl = _.map(this.map, (line, row) =>
			_.map(line, (tiles, column) => {
				const tile = MapUtils.TILES[tiles];
				if (tile) return new tile(row, column);
				return null;
			})
		);
	}

	public checkTanks(): boolean {
		return this.tanks.length < this.maxTanksOnMap;
	}

	public findEmptyPosition(): number {
		let position = _.random(2);
		const row1 = 1;
		const column1 = position === 0 ? 1 : position === 1 ? 12 : 23;
		_.each(this.tanks, (tank) => {
			const [row, column] = Utils.getTitlePosition(tank.sprite);
			if (row === row1 && column === column1) {
				position = 3;
			}
		});
		return position;
	}

	public checkWins(): boolean {
		return this.tanks.length < 2 && this.enemyTanksLeft < 1;
	}

	protected fillEmptyTales(): void {
		_.each(this.map, (lines: number[], row: number) => {
			_.each(lines, (tile: number, column: number) => {
				if (!tile) {
					this.emptyTales.rows.push(row);
					this.emptyTales.columns.push(column);
				}
			});
		});
	}

	public newLvl(): void {
		this.map = this.gameLevels.shift();
		this.bullets = [];
		this.tanks = [];
		this.maxTanksOnMap = 4;
		this.enemyTanksLeft = 10;
		this.enemyTanksPanel = [];
		this.bonuses = [];
		this.fillEmptyTales();
	}

	public newGame(): void {
		this.gameLevels = [MapUtils.LEVEL_1, MapUtils.LEVEL_2, MapUtils.LEVEL_3];
		this.lives = 1;
		this.gameRound = 0;
		this.newLvl();
	}
}
