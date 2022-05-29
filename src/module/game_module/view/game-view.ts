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
import { GameProxy } from '../proxy/game-proxy';
import { GameMediator } from '../mediator/game-mediator';
import { TanksNames } from '../../tanks_module/misc/tanks-names';
import { MapUtils } from '../../map_module/utils/map-utils';
import { Global } from '../../global/misc/names';

export class GameView {
	protected gameProxy: GameProxy;
	protected gameMediator: GameMediator;
	protected app: PIXI.Application;

	constructor(app: PIXI.Application, mediator: GameMediator) {
		this.app = app;
		this.gameMediator = mediator;
		this.gameProxy = new GameProxy(app);

		this.app.ticker.add(() => {
			_.each(this.gameProxy.bullets, this.move.bind(this));
		});
	}

	protected move(sprite: PIXI.Sprite): void {
		if (sprite) {
			switch (sprite.name) {
				case Global.UP:
					this.moveUp(sprite);
					break;
				case Global.RIGHT:
					this.moveRight(sprite);
					break;
				case Global.DOWN:
					this.moveDown(sprite);
					break;
				case Global.LEFT:
					this.moveLeft(sprite);
					break;
				default:
					this.moveUp(sprite);
			}
		}
	}

	protected moveUp(sprite: PIXI.Sprite): void {
		if (!this.gameMediator.collisionDetect(sprite, Global.UP)) {
			sprite.y -= this.gameProxy.bulletSpeed;
		} else {
			_.remove(this.gameProxy.bullets, sprite);
			sprite.destroy();
		}
	}

	protected moveDown(sprite: PIXI.Sprite): void {
		if (!this.gameMediator.collisionDetect(sprite, Global.DOWN)) {
			sprite.y += this.gameProxy.bulletSpeed;
		} else {
			_.remove(this.gameProxy.bullets, sprite);
			sprite.destroy();
		}
	}

	protected moveLeft(sprite: PIXI.Sprite): void {
		if (!this.gameMediator.collisionDetect(sprite, Global.LEFT)) {
			sprite.x -= this.gameProxy.bulletSpeed;
		} else {
			_.remove(this.gameProxy.bullets, sprite);
			sprite.destroy();
		}
	}

	protected moveRight(sprite: PIXI.Sprite): void {
		if (!this.gameMediator.collisionDetect(sprite, Global.RIGHT)) {
			sprite.x += this.gameProxy.bulletSpeed;
		} else {
			_.remove(this.gameProxy.bullets, sprite);
			sprite.destroy();
		}
	}

	public drawTitle(): void {
		this.clean();
		const graphics = new PIXI.Graphics();
		graphics.beginFill(0xde3249);
		graphics.drawRect(341, 547, 345, 70);
		graphics.endFill();
		const title: PIXI.Sprite = new PIXI.Sprite(this.gameProxy.loader.loader.resources.scr1.texture);
		title.anchor.set(0.5);
		title.position.set(1024 / 2, 768 / 2);
		title.scale.set(1.15);
		this.app.stage.addChild(graphics, title);
		graphics.interactive = true;
		graphics.buttonMode = true;
		graphics.on('pointerdown', () => {
			this.gameProxy.game.state.nextState(this.gameMediator.play.bind(this.gameMediator));
			graphics.removeAllListeners();
		});
	}

	public clean(): void {
		if (this.app.stage.children.length > 0) {
			this.app.stage.removeChildAt(0);
			this.clean();
		}
	}

	public mainGame(): void {
		this.clean();
		this.gameProxy.loader.loader.resources.start.sound.play();
		this.drawMap();

		this.gameProxy.tanksFactory
			.getTank(TanksNames.NAMES[0], this.gameMediator.collisionDetect.bind(this.gameMediator))
			.drawTank(this.app.stage, MapUtils.PLAYER_START);
	}

	protected drawMap(): void {
		this.gameProxy.makeLvl();
		_.each(this.gameProxy.lvl, (line: any[], row: number) => {
			_.each(line, (element, column: number) => {
				if (element) {
					const sprite: PIXI.Sprite = element.getTexture();
					const x = 36 * column + 36;
					const y = 36 * row + 36;
					sprite.position.set(x, y);
					this.app.stage.addChild(sprite);
				}
			});
		});
	}
}
