import { GAME_WIDTH, GAME_HEIGHT } from "../core/constants.js";
import { playerData } from "../data/playerData.js";

export class Player{
    constructor(){
        this.width = playerData.width;
        this.height = playerData.height;
        this.speed = playerData.speed;
        
        this.reset();
    }
    
    update(dt, keys){
        let dx = 0, dy = 0;

        // movement handling with last key overrides
        if(keys['w'] || keys['arrowup'] && ['w','arrowup',''].includes(this.prevVertical)) dy -= 1;
        if((keys['s'] || keys['arrowdown']) && ['s','arrowdown',''].includes(this.prevVertical)) dy += 1;
        if(keys['a'] || keys['arrowleft'] && ['a','arrowleft',''].includes(this.prevHorizontal)) dx -= 1;
        if(keys['d'] || keys['arrowright'] && ['d','arrowright',''].includes(this.prevHorizontal)) dx += 1;

        // normalize diagonal movement
        if(dx || dy){
            const len = Math.sqrt(dx * dx + dy * dy);
            dx /= len;
            dy /= len;

            this.x += dx * this.speed * dt;
            this.y += dy * this.speed * dt;
        }

        // keep player in bounds
        this.x = Math.max(0, Math.min(GAME_WIDTH - this.width, this.x));
        this.y = Math.max(0, Math.min(GAME_HEIGHT - this.height, this.y))
    }

    reset(){
        this.x = (GAME_WIDTH - this.width / 2) / 2;
        this.y = (GAME_HEIGHT - this.height / 2) / 2;
        this.prevVertical = "";
        this.prevHorizontal = "";
    }
}