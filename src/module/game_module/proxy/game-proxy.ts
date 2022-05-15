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
import { Loader } from '../components/loader';
import { Game } from '../game';
import { GameMediator } from '../mediator/game-mediator';

export class GameProxy {
	public loader: Loader;
	public app: PIXI.Application;
	public game: Game;
	protected mediator: GameMediator;
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
		return this;
	}

	public bullets: PIXI.Sprite[] = [];
	public tanks: PIXI.Sprite[] = [];
	public bulletSpeed = 4;
	public borders = { up: 54, down: 700, left: 54, right: 880 };
}
