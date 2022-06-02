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

export class Eagle extends BaseTexture {
	constructor(row: number, column: number) {
		super(row, column);
		this.name = 'eagle';
		this.texture = this.gameProxy.loader.loader.resources.eagle.texture;
		this.destroyable = true;
		this.collision = true;
	}

	protected explode(): void {
		const animatedSprite = Animation.EXPLODE(this.gameProxy);

		this.sprite.addChild(animatedSprite);
		animatedSprite.animationSpeed = 0.2;
		animatedSprite.loop = false;
		animatedSprite.onComplete = () => {
			this.sprite.removeChild(animatedSprite);
			animatedSprite.destroy();
			try {
				this.sprite.destroy();
			} catch (error) {
				console.log(error);
			}
			this.gameProxy.win = false;
			gsap.delayedCall(1, () => {
				this.gameProxy.game.state.nextState(this.gameProxy.mediator.play.bind(this.gameProxy.mediator));
			});
		};
		animatedSprite.play();
		this.gameProxy.loader.loader.resources.eagle_destroy.sound.play();
	}
}
