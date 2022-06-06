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
import { gsap } from 'gsap';
import { GameProxy } from '../proxy/game-proxy';
import { GameMediator } from '../mediator/game-mediator';
import { TanksNames } from '../../tanks_module/misc/tanks-names';
import { MapUtils } from '../../map_module/utils/map-utils';
import { Global } from '../../global/misc/global-names';
import { styles, stylesLives } from '../../global/utils/styles';
import { BaseBullet } from '../../bullet_module/bullets_factory/base_bullet/base-bullet';
import { Timer } from '../components/timer';
import { GameNames } from '../misk/game-names';
import { Sprite, Application, Graphics, Text } from 'pixi.js';

export class GameView {
	public timer: Timer;
	protected lives: string = 'Lives';
	protected score: string = 'Score';
	protected livesValue: Text;
	protected scoreValue: Text;
	protected gameProxy: GameProxy;
	protected gameMediator: GameMediator;
	protected app: Application;
	protected tanksPanelStartX: number = 960;
	protected tanksPanelStartY: number = 100;
	protected tanksPanelScale: number = 0.7;
	protected tanksPanelOffset: number = 30;
	protected firstBonusDelay: number = 15;
	protected firstNewEnemyDelay: number = 10;
	protected firstEnemyQuantity: number = 3;

	constructor(app: Application, mediator: GameMediator) {
		this.app = app;
		this.gameMediator = mediator;
		this.gameProxy = new GameProxy(app);
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
		const graphics = new Graphics();
		graphics.beginFill(0xde3249);
		graphics.drawRect(341, 547, 345, 70);
		graphics.endFill();
		const title: Sprite = new Sprite(this.gameProxy.loader.loader.resources.scr1.texture);
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
		this.gameProxy.tanks = [];
		this.gameProxy.bullets = [];
		if (this.app.stage.children.length > 0) {
			this.app.stage.removeChildAt(0);
			this.clean();
		}
	}

	public mainGame(): void {
		this.clean();
		this.gameProxy.gameRound++;
		this.timer = new Timer(2, this.app);
		this.gameProxy.loader.loader.resources.start.sound.play();
		this.app.ticker.add(this.startTicker);
		this.drawMap();
		this.drawTanksLeft();
		this.drawLives();
		this.drawScore();

		this.getTank(TanksNames.NAMES[0]);
		for (let i = 0; i < this.firstEnemyQuantity; i++) {
			this.getTank(TanksNames.NAMES[1], i);
		}
		gsap.delayedCall(this.firstNewEnemyDelay, this.addNewEnemy.bind(this, this.gameProxy.gameRound));
		gsap.delayedCall(this.firstBonusDelay, this.getBonus.bind(this, this.gameProxy.gameRound));
	}

	protected drawMap(): void {
		this.gameProxy.makeLvl();
		_.each(this.gameProxy.lvl, (line: any[], row: number) => {
			_.each(line, (element, column: number) => {
				if (element) {
					const sprite: Sprite = element.getTexture();
					const x = Global.TALE_SIZE * column + Global.TALE_SIZE;
					const y = Global.TALE_SIZE * row + Global.TALE_SIZE;
					sprite.position.set(x, y);
					this.app.stage.addChild(sprite);
				}
			});
		});
	}

	public gameOver(): void {
		this.clean();
		this.gameProxy.gameRound++;
		const score = new Text(this.gameProxy.score.toString(), styles);
		score.anchor.set(0.5);
		score.position.set(1024 / 2, 768 / 1.25);

		const title: Sprite = new Sprite(this.gameProxy.loader.loader.resources.scores.texture);
		title.anchor.set(0.5);
		title.position.set(1024 / 2, 768 / 1.5);

		this.app.stage.addChild(title, score);
		this.app.stage.interactive = true;
		this.app.stage.buttonMode = true;
		this.app.stage.on('pointerdown', () => {
			this.gameProxy.newGame();
			this.gameProxy.game.state.nextState(this.gameMediator.play.bind(this.gameMediator));
			this.app.stage.removeAllListeners();
			this.app.stage.interactive = false;
			this.app.stage.buttonMode = false;
		});
		let gameOver: Sprite;
		if (this.gameProxy.win) {
			this.gameProxy.score += this.timer.getScore();
			score.text = this.gameProxy.score.toString();
			gameOver = new Sprite(this.gameProxy.loader.loader.resources.you_win.texture);
			gameOver.scale.set(0.8);
			this.gameProxy.loader.loader.resources.win.sound.play();
		} else {
			gameOver = new Sprite(this.gameProxy.loader.loader.resources.game_over.texture);
			gameOver.scale.set(1);
			this.gameProxy.loader.loader.resources.lose.sound.play();
		}
		gameOver.anchor.set(0.5);
		gameOver.position.set(1024 / 2, -200);
		this.app.stage.addChild(gameOver);
		gsap.to(gameOver.position, {
			duration: 3,
			y: 768 / 3
		});
	}

	protected getTank(name: string, position?: number): void {
		if (this.gameProxy.enemyTanksLeft) {
			if (name === TanksNames.NAMES[1]) {
				this.gameProxy.enemyTanksLeft--;
				this.gameProxy.enemyTanksPanel.pop().destroy();
			}
			this.gameProxy.tanksFactory
				.getTank(name, this.gameMediator.collisionDetect.bind(this.gameMediator))
				.drawTank(
					this.app.stage,
					typeof position === 'number' ? MapUtils.ENEMY_START[position] : MapUtils.PLAYER_START
				);
		}
	}

	public addNewEnemy(gameRound: number): void {
		if (this.gameProxy.gameRound !== gameRound) return;
		if (this.gameProxy.checkTanks()) {
			const position: number = this.gameProxy.findEmptyPosition();
			if (position < 3 && this.gameProxy.game.state.name === GameNames.STATE_MAIN) {
				this.getTank(TanksNames.NAMES[1], position);
			}
		}
		if (this.gameProxy.enemyTanksLeft && this.gameProxy.game.state.name === GameNames.STATE_MAIN) {
			gsap.delayedCall(5, this.addNewEnemy.bind(this, this.gameProxy.gameRound));
		}
	}

	public drawTanksLeft(): void {
		this.gameProxy.enemyTanksPanel.length = 0;
		for (let i = 0; i < this.gameProxy.enemyTanksLeft; i++) {
			const tank: Sprite = new Sprite(this.gameProxy.loader.loader.resources.enemy_white.texture);
			tank.anchor.set(0.5);
			tank.scale.set(this.tanksPanelScale);
			const x: number = this.tanksPanelStartX + (i % 2) * this.tanksPanelOffset;
			const y: number = this.tanksPanelStartY + Math.floor(i / 2) * this.tanksPanelOffset;
			tank.position.set(x, y);
			this.gameProxy.enemyTanksPanel.push(tank);
			this.app.stage.addChild(tank);
		}
	}

	protected drawLives(): void {
		const livesTitle = new Text(this.lives, stylesLives);
		livesTitle.anchor.set(0.5);
		livesTitle.position.set(975, 500);
		this.livesValue = new Text(this.gameProxy.lives.toString(), stylesLives);
		this.livesValue.anchor.set(0.5);
		this.livesValue.position.set(975, 530);
		this.app.stage.addChild(livesTitle, this.livesValue);
	}

	public changeLivesValue(): void {
		if (!_.isNil(this.livesValue)) {
			this.livesValue.text = this.gameProxy.lives.toString();
		}
	}

	protected drawScore(): void {
		const scoreTitle = new Text(this.score, stylesLives);
		scoreTitle.anchor.set(0.5);
		scoreTitle.position.set(975, 300);
		this.scoreValue = new Text(this.gameProxy.score.toString(), stylesLives);
		this.scoreValue.anchor.set(0.5);
		this.scoreValue.position.set(975, 330);
		this.app.stage.addChild(scoreTitle, this.scoreValue);
	}

	public changeScoreValue(): void {
		if (!_.isNil(this.scoreValue)) {
			this.scoreValue.text = this.gameProxy.score.toString();
		}
	}

	protected getBonus(gameRound: number): void {
		if (this.gameProxy.gameRound !== gameRound) return;
		if (this.gameProxy.game.state.name === GameNames.STATE_MAIN) {
			this.gameProxy.bonusFactory.getBonus();
			gsap.delayedCall(15, this.getBonus.bind(this, this.gameProxy.gameRound));
		}
	}

	protected startTicker = (): void => {
		_.each(this.gameProxy.bullets, this.move.bind(this));
		_.each(this.gameProxy.tanks, (tank) => {
			if (tank.name === TanksNames.NAMES[0]) return;
			if (tank.appear && tank.sprite) tank.play();
		});
	};

	public reset(): void {
		this.app.ticker.remove(this.startTicker);
	}
}
