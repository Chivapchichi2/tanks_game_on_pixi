/**
 * iSOFTBET
 * Copyright 2022 iSOFTBET
 * All Rights Reserved.
 *
 * NOTICE: You may not use, distribute or modify this document without the
 * written permission of its copyright owner
 *
 * Created by Pavlo Ivchenko on 29.05.2022
 */
import { TextStyle } from 'pixi.js';

export const styles = new TextStyle({
	fontFamily: 'Arial',
	fontSize: 48,
	fontWeight: 'bold',
	fill: '#f50202',
	stroke: '#ec7007',
	strokeThickness: 5,
	dropShadow: true,
	dropShadowColor: '#000000',
	dropShadowBlur: 4,
	dropShadowAngle: Math.PI / 6,
	dropShadowDistance: 6,
	wordWrap: true,
	wordWrapWidth: 440,
	lineJoin: 'round'
});
