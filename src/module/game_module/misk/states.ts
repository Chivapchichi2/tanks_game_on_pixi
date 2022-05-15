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
import { Game } from '../game';
import { Names } from './names';

export class Boot implements State {
	public game: Game;
	public name: string;
	constructor(game: Game) {
		this.game = game;
		this.name = Names.STATE_BOOT;
	}

	public nextState(clb: Function): void {
		this.game.state = this.game.preload;
		clb();
	}
}

export class Preload implements State {
	public game: Game;
	public name: string;
	constructor(game: Game) {
		this.game = game;
		this.name = Names.STATE_PRELOAD;
	}

	public nextState(clb: Function): void {
		this.game.state = this.game.gameTitle;
		clb();
	}
}

export class GameTitle implements State {
	public game: Game;
	public name: string;
	constructor(game: Game) {
		this.game = game;
		this.name = Names.STATE_GAME_TITLE;
	}

	public nextState(clb: Function): void {
		this.game.state = this.game.main;
		clb();
	}
}

export class Main implements State {
	public game: Game;
	public name: string;
	constructor(game: Game) {
		this.game = game;
		this.name = Names.STATE_MAIN;
	}

	public nextState(clb: Function): void {
		this.game.state = this.game.gameOver;
		clb();
	}
}

export class GameOver implements State {
	public game: Game;
	public name: string;
	constructor(game: Game) {
		this.game = game;
		this.name = Names.STATE_GAME_OVER;
	}

	public nextState(clb: Function): void {
		this.game.state = this.game.gameTitle;
		clb();
	}
}

export interface State {
	game: Game;
	name: string;
	nextState(clb: Function): void;
}
