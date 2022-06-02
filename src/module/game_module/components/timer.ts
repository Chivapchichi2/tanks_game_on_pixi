/**
 * iSOFTBET
 * Copyright 2022 iSOFTBET
 * All Rights Reserved.
 *
 * NOTICE: You may not use, distribute or modify this document without the
 * written permission of its copyright owner
 *
 * Created by Pavlo Ivchenko on 02.06.2022
 */
import * as PIXI from 'pixi.js';
import { GameProxy } from '../proxy/game-proxy';
import { stylesTimer1, stylesTimer2, stylesTimer3 } from '../../global/utils/styles';

export class Timer {
	protected time: number;
	protected app: PIXI.Application;
	protected gameProxy: GameProxy;
	protected clock: PIXI.Text;
	protected position: PIXI.Point = new PIXI.Point(975, 40);
	constructor(time: number, app: PIXI.Application) {
		this.time = time * 60 * 60;
		this.app = app;
		this.gameProxy = new GameProxy(app);
		this.clock = new PIXI.Text(this.convert(), stylesTimer1);
		this.clock.anchor.set(0.5);
		this.clock.position.copyFrom(this.position);
		this.app.stage.addChild(this.clock);
		this.app.ticker.add(this.start);
	}

	protected convert(): string {
		const mins = Math.floor(this.time / (60 * 60)).toString();
		const secs = Math.floor((this.time / 60) % 60).toString();
		return `${mins}:${secs.length > 1 ? secs : '0' + secs}`;
	}

	public start = (): void => {
		this.time--;
		this.clock.text = this.convert();
		if (this.time === 3600) {
			this.clock.style = stylesTimer2;
		}
		if (this.time === 1800) {
			this.clock.style = stylesTimer3;
		}
		if (this.time < 1) {
			this.app.ticker.remove(this.start);
		}
	};
}
