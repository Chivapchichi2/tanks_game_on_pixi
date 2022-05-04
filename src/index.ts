/**
 * iSOFTBET
 * Copyright 2022 iSOFTBET
 * All Rights Reserved.
 *
 * NOTICE: You may not use, distribute or modify this document without the
 * written permission of its copyright owner
 *
 * Created by Pavlo Ivchenko on 04.05.2022
 */
import './index.css';
import * as PIXI from 'pixi.js';
import { TanksFactory } from './module/tanks_module/tanks_factory/tanks-factory';
import { TanksNames } from './module/tanks_module/misc/tanks-names';

class View {
	public app: PIXI.Application;
	protected texture: PIXI.Texture;
	constructor(width = 1024, height = 768) {
		this.app = new PIXI.Application({
			width,
			height,
			backgroundColor: 0x002030,
			antialias: true
		});
		this.texture = PIXI.Texture.from('./assets/board/wall.png');
	}

	public displayApp(): void {
		this.app.stage.interactive = true;

		document.getElementById('app').appendChild(this.app.view);
	}
	public drawWall(x: number, y: number): void {
		const wall = new PIXI.Sprite(this.texture);
		wall.anchor.set(0.5);
		wall.position.set(x, y);
		this.app.stage.addChild(wall);
	}
}

const view = new View();
view.displayApp();
for (let i = 0; i < 19; i++) {
	view.drawWall(36, 36 * i + 36);
}
for (let i = 0; i < 19; i++) {
	view.drawWall(36 * 25, 36 * i + 72);
}
for (let i = 0; i < 24; i++) {
	view.drawWall(36 * i + 72, 36);
}
for (let i = 0; i < 24; i++) {
	view.drawWall(36 * i + 36, 36 * 20);
}
const tankFactory = new TanksFactory();
const tank = tankFactory.getTank(TanksNames.TANKS_NAMES[0]);
tank.drawTank(view.app.stage, new PIXI.Point(200, 200));
