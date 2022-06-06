/**
 * iSOFTBET
 * Copyright 2022 iSOFTBET
 * All Rights Reserved.
 *
 * NOTICE: You may not use, distribute or modify this document without the
 * written permission of its copyright owner
 *
 * Created by Pavlo Ivchenko on 16.05.2022
 */
import { BaseTexture } from '../base_texture/base-texture';
import { gsap } from 'gsap';
import { Animation } from '../../../global/utils/animation';
import { MapNames } from '../../misk/map-names';

export class Eagle extends BaseTexture {
	constructor(row: number, column: number) {
		super(row, column);
		this.name = MapNames.EAGLE;
		this.texture = this.gameProxy.loader.loader.resources.eagle.texture;
		this.destroyable = true;
		this.collision = true;
	}

	protected explode(): void {
		const animatedSprite = Animation.EXPLODE(this.gameProxy);
		animatedSprite.position.copyFrom(this.sprite.position);
		this.gameProxy.app.stage.addChild(animatedSprite);
		this.gameProxy.lvl[this.row][this.column] = null;
		this.sprite.destroy();
		animatedSprite.animationSpeed = 0.2;
		animatedSprite.loop = false;
		animatedSprite.onComplete = () => {
			animatedSprite.destroy();
			this.gameProxy.win = false;
			gsap.delayedCall(1, () => {
				this.gameProxy.game.state.nextState(this.gameProxy.mediator.play.bind(this.gameProxy.mediator));
			});
		};
		animatedSprite.play();
		this.gameProxy.loader.loader.resources.eagle_destroy.sound.play();
	}

	public immortal(): void {
		this.destroyable = false;
		gsap.to(this.sprite, {
			duration: 0.3,
			alpha: 0,
			repeat: 17,
			yoyo: true,
			onComplete: () => {
				this.destroyable = true;
			}
		});
	}
}
