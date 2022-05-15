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
import { sound } from '@pixi/sound';
import { Game } from './module/game_module/game';

sound.add('shot', './assets/sounds/shot.wav');

const game = new Game();
game.start();
