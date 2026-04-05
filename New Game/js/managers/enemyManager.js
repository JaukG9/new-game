import { enemyData } from "../data/enemyData.js";
import { Enemy } from "../entities/enemy.js";

export class EnemyManager{
    constructor(){
        this.enemy = new Enemy(enemyData.drifter);
    }

    spawn(x, y){
        this.enemy.spawn(x, y);
    }

    getActiveEnemies(){
        return [this.enemy];
    }

    update(dt, player){
        this.enemy.update(dt, player);
    }
}