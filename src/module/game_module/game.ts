/**
 * iSOFTBET
 * Copyright 2022 iSOFTBET
 * All Rights Reserved.
 *
 * NOTICE: You may not use, distribute or modify this document without the
 * written permission of its copyright owner
 *
 * Created by Pavlo Ivchenko on 12.05.2022
 */
import { Boot, GameOver, GameTitle, Main, Preload, State } from './misk/states';
import { GameMediator } from './mediator/game-mediator';

export class Game {
	protected _currentState: State;
	public boot: State;
	public preload: State;
	public gameTitle: State;
	public main: State;
	public gameOver: State;
	public game: GameMediator;
	constructor() {
		this.boot = new Boot(this);
		this.preload = new Preload(this);
		this.gameTitle = new GameTitle(this);
		this.main = new Main(this);
		this.gameOver = new GameOver(this);
		this.state = this.boot;
	}

	public set state(state: State) {
		this._currentState = state;
	}

	public get state(): State {
		return this._currentState;
	}

	public start(): void {
		this.game = new GameMediator(this);
		this.game.play();
	}
}
