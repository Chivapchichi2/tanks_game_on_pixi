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
import { gsap } from 'gsap';
import { GameProxy } from '../proxy/game-proxy';
import { GameMediator } from '../mediator/game-mediator';
import { TanksNames } from '../../tanks_module/misc/tanks-names';
import { MapUtils } from '../../map_module/utils/map-utils';
import { Global } from '../../global/misc/names';
import { styles } from '../../global/utils/styles';
import { BaseBullet } from '../../bullet_module/bullets_factory/base_bullet/base-bullet';

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

	protected move(bullet: BaseBullet): void {
		if (bullet?.sprite) {
			switch (bullet.sprite.name) {
				case Global.UP:
					this.moveUp(bullet);
					break;
				case Global.RIGHT:
					this.moveRight(bullet);
					break;
				case Global.DOWN:
					this.moveDown(bullet);
					break;
				case Global.LEFT:
					this.moveLeft(bullet);
					break;
				default:
					this.moveUp(bullet);
			}
		}
	}

	protected moveUp(bullet: BaseBullet): void {
		if (!this.gameMediator.collisionDetect(bullet, Global.UP)) {
			bullet.sprite.y -= this.gameProxy.bulletSpeed;
		} else {
			_.remove(this.gameProxy.bullets, bullet);
			bullet.sprite.destroy();
		}
	}

	protected moveDown(bullet: BaseBullet): void {
		if (!this.gameMediator.collisionDetect(bullet, Global.DOWN)) {
			bullet.sprite.y += this.gameProxy.bulletSpeed;
		} else {
			_.remove(this.gameProxy.bullets, bullet);
			bullet.sprite.destroy();
		}
	}

	protected moveLeft(bullet: BaseBullet): void {
		if (!this.gameMediator.collisionDetect(bullet, Global.LEFT)) {
			bullet.sprite.x -= this.gameProxy.bulletSpeed;
		} else {
			_.remove(this.gameProxy.bullets, bullet);
			bullet.sprite.destroy();
		}
	}

	protected moveRight(bullet: BaseBullet): void {
		if (!this.gameMediator.collisionDetect(bullet, Global.RIGHT)) {
			bullet.sprite.x += this.gameProxy.bulletSpeed;
		} else {
			_.remove(this.gameProxy.bullets, bullet);
			bullet.sprite.destroy();
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
		for (let i = 0; i < 3; i++) {
			this.gameProxy.tanksFactory
				.getTank(TanksNames.NAMES[1], this.gameMediator.collisionDetect.bind(this.gameMediator))
				.drawTank(this.app.stage, MapUtils.ENEMY_START[i]);
		}
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

	public gameOver(): void {
		this.clean();
		const score = new PIXI.Text(this.gameProxy.score.toString(), styles);
		score.anchor.set(0.5);
		score.position.set(1024 / 2, 768 / 1.25);

		const title: PIXI.Sprite = new PIXI.Sprite(this.gameProxy.loader.loader.resources.scores.texture);
		title.anchor.set(0.5);
		title.position.set(1024 / 2, 768 / 1.5);

		this.app.stage.addChild(title, score);
		this.app.stage.interactive = true;
		this.app.stage.buttonMode = true;
		this.app.stage.on('pointerdown', () => {
			this.gameProxy.game.state.nextState(this.gameMediator.play.bind(this.gameMediator));
			this.app.stage.removeAllListeners();
			this.app.stage.interactive = false;
			this.app.stage.buttonMode = false;
		});
		if (this.gameProxy.win) {
			this.gameProxy.loader.loader.resources.win.sound.play();
		} else {
			const gameOver: PIXI.Sprite = new PIXI.Sprite(this.gameProxy.loader.loader.resources.game_over.texture);
			gameOver.anchor.set(0.5);
			gameOver.position.set(1024 / 2, -200);
			this.app.stage.addChild(gameOver);
			gsap.to(gameOver.position, {
				duration: 3,
				y: 768 / 3
			});

			this.gameProxy.loader.loader.resources.lose.sound.play();
		}
	}
}
