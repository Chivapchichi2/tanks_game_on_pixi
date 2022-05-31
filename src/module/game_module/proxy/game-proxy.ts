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
import * as PIXI from 'pixi.js';
import { Loader } from '../components/loader';
import { Game } from '../game';
import { GameMediator } from '../mediator/game-mediator';
import { TanksFactory } from '../../tanks_module/tanks_factory/tanks-factory';
import { Wall } from '../../map_module/components/wall/wall';
import { MapUtils } from '../../map_module/utils/map-utils';

export class GameProxy {
	public bullets: any[] = [];
	public tanks: any[] = [];
	public map: number[][];
	public lvl: any[][] = [[]];
	public bulletSpeed = 4;
	public loader: Loader;
	public app: PIXI.Application;
	public game: Game;
	public tanksFactory: TanksFactory;
	public wall: Wall;
	public mediator: GameMediator;
	public win: boolean;
	public score: number;
	protected static instance: GameProxy;
	protected static exists: boolean;
	constructor(app?: PIXI.Application, game?: Game, mediator?: GameMediator) {
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
		this.map = _.clone(MapUtils.LEVEL_1);
		return this;
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
}
