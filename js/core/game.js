import { GAME_WIDTH, GAME_HEIGHT, ASPECT_RATIO, CANVAS_MARGIN, GAME_STATES } from "./constants.js";
import { RenderSystem } from "../systems/renderSystem.js";
import { Player } from "../entities/player.js"
import { ImageManager } from "../managers/imageManager.js";
import { AudioManager } from "../managers/audioManager.js";
import { UIManager } from "../managers/uIManager.js";
import { EnemyManager } from "../managers/enemyManager.js";

export class Game{
    constructor(){
        // define canvas
        this.canvas = document.getElementById("gameCanvas");

        // instantiate managers
        this.imageManager = new ImageManager();
        this.audioManager = new AudioManager();
        this.uiManager = new UIManager(this);
        this.enemyManager = new EnemyManager();

        // define rendering & player
        this.renderSystem = new RenderSystem(this.canvas, this.imageManager);
        this.player = new Player();

        // attributes
        this.keys = {};
        this.lastTime = 0;
        this.time;
        this.state = GAME_STATES.MENU;
        
        // initialize the game
        this.init();
    }

    async init(){
        await Promise.all([
            this.imageManager.loadAll(),
            this.audioManager.loadAll()
        ]);

        this.uiManager.showPanel('mainMenu');

        // maintain canvas when loading & resizing window
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        // setup game
        this.setupInput();

        // start game loop
        this.lastTime = performance.now();
        requestAnimationFrame((t) => this.gameLoop(t));
    }

    gameLoop(timestamp){
        // deltaTime & timer
        const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
        this.lastTime = timestamp;

        if(this.state === GAME_STATES.PLAYING){
            this.time += dt;
            this.uiManager.updateTimer(this.time);
        }

        // update & render game
        this.update(dt);
        this.renderSystem.render(this.state, this.player, this.enemyManager.getActiveEnemies());

        // loop
        requestAnimationFrame((t) => this.gameLoop(t));
    }

    update(dt){
        if(this.state !== GAME_STATES.PLAYING) return;

        this.player.update(dt, this.keys);
        this.enemyManager.update(dt, this.player);
    }

    setupInput(){
        // store user input
        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            if (['w','arrowup','s','arrowdown'].includes(e.key.toLowerCase())) {
                this.player.prevVertical = e.key.toLowerCase();
            }else if (['a','arrowleft','d','arrowright'].includes(e.key.toLowerCase())) {
                this.player.prevHorizontal = e.key.toLowerCase();
            }
            
            if(e.key.toLowerCase() === 'escape'){
                if(this.state === GAME_STATES.PLAYING){this.pause();}
                else if(this.state === GAME_STATES.PAUSED){this.resume();}
            }
        });
        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
            if (['w','arrowup','s','arrowdown'].includes(e.key.toLowerCase())) {
                this.player.prevVertical = '';
            }else if (['a','arrowleft','d','arrowright'].includes(e.key.toLowerCase())) {
                this.player.prevHorizontal = '';
            }
        });

        // reset input when unfocused
        window.addEventListener('contextmenu', () => {
            this.keys = {};
        });
        window.addEventListener('blur', () => {
            this.keys = {};
        });
    }

    startGame(){
        this.playSound('button_click');
        this.state = GAME_STATES.PLAYING;
        this.time = 0;

        // change UI
        this.uiManager.hideAllPanels();
        this.uiManager.showTimer();

        // reset game
        this.player.reset();
        this.enemyManager.spawn(200, 200);

        this.lastTime = performance.now();
    }

    pause(){
        this.state = GAME_STATES.PAUSED;
        this.playSound('pause');
        this.uiManager.showPanel('pauseMenu');
    }
    resume(){
        this.state = GAME_STATES.PLAYING;
        this.playSound('unpause');
        this.uiManager.hideAllPanels();
    }
    quitToMenu(){
        this.playSound('button_click');
        this.returnToMenu();
    }
    returnToMenu(){
        this.state = GAME_STATES.MENU;
        this.uiManager.hideAllPanels();
        this.uiManager.showPanel('mainMenu');
        this.uiManager.hideTimer();
    }

    playSound(name){
        this.audioManager.play(name);
    }

    resizeCanvas(){
        let w, h;

        const availableWidth = window.innerWidth - CANVAS_MARGIN * 2;
        const availableHeight = window.innerHeight - CANVAS_MARGIN * 2;
        if(availableWidth / availableHeight > ASPECT_RATIO){
            h = availableHeight;
            w = h * ratio;
        }else{
            w = availableWidth;
            h = w / ASPECT_RATIO;
        }

        this.canvas.width = GAME_WIDTH;
        this.canvas.height = GAME_HEIGHT;

        this.canvas.style.width = w + 'px';
        this.canvas.style.height = h + 'px';
        this.canvas.style.margin = `${CANVAS_MARGIN}px`;
    }
}