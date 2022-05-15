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
import { GameProxy } from '../proxy/game-proxy';
import { GameView } from '../view/game-view';
import * as PIXI from 'pixi.js';
import { TanksFactory } from '../../tanks_module/tanks_factory/tanks-factory';
import { State } from '../misk/states';
import { Game } from '../game';
import { Names } from '../misk/names';
// import { TanksNames } from '../../tanks_module/misc/tanks-names';

export class GameMediator {
	public app: PIXI.Application;
	protected view: GameView;
	protected proxy: GameProxy;
	protected game: Game;
	protected tanksFactory: TanksFactory;
	constructor(game: Game, width = 1024, height = 768) {
		this.app = new PIXI.Application({
			width,
			height,
			backgroundColor: 0x002030,
			antialias: true
		});
		this.game = game;

		this.tanksFactory = new TanksFactory();
	}

	public play(): void {
		const state: State = this.game.state;
		if (state.name === Names.STATE_BOOT) {
			this.app.stage.interactive = true;
			document.getElementById('app').appendChild(this.app.view);
			state.nextState(this.play.bind(this));
		}

		if (state.name === Names.STATE_PRELOAD) {
			this.proxy = new GameProxy(this.app, this.game, this);
			this.view = new GameView(this.app);
		}

		// this.tanksFactory.getTank(TanksNames.NAMES[0]).drawTank(this.app.stage, new PIXI.Point(300, 500));
	}

	// public drawWall(x: number, y: number): void {
	// 	const wall = new PIXI.Sprite(this.texture);
	// 	wall.anchor.set(0.5);
	// 	wall.position.set(x, y);
	// 	this.app.stage.addChild(wall);
	// }
}
