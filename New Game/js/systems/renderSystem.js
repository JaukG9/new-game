import { GAME_WIDTH, GAME_HEIGHT, GRID_SIZE, GAME_STATES } from "../core/constants.js";

export class RenderSystem{
    constructor(canvas, imageManager){
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;
        this.imageManager = imageManager;
    }

    render(state, player, enemies = []){
        if(state === GAME_STATES.MENU){
            //menu background
            this.renderMenuBackground();
        }else{
            // background
            this.ctx.fillStyle = "#0f3460";
            this.ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
            this.renderGrid();

            // other elements
            this.renderEnemies(enemies);
            this.renderPlayer(player);
        }
    }

    renderPlayer(player){
        const playerImage = this.imageManager.get('player');

        if(playerImage){
            this.ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
        }else{
            // fallback
            this.ctx.fillStyle = "#1a1a2e";
            this.ctx.fillRect(player.x, player.y, player.width, player.height);
            this.ctx.strokeStyle = "white";
            this.ctx.strokeRect(player.x, player.y, player.width, player.height);
        }
    }

    renderEnemies(enemies){
        for(let i = 0; i < enemies.length; i++){
            const enemy = enemies[i];
            this.ctx.fillStyle = '#ff0000';
            this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        }
    }

    renderGrid(){
        this.ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
        this.ctx.lineWidth = 1;

        this.ctx.beginPath();
        for(let i = 0; i <= GAME_WIDTH; i += GRID_SIZE){
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, GAME_HEIGHT);
        }
        for(let i = 0; i <= GAME_HEIGHT; i += GRID_SIZE){
            this.ctx.moveTo(0, i);
            this.ctx.lineTo(GAME_WIDTH, i);
        }
        this.ctx.stroke();
    }

    renderMenuBackground(){
        this.ctx.fillStyle = "#0f3460";
        this.ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    }
}