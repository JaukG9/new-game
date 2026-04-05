export class Enemy{
    constructor(data){
        this.data = data;

        // position & dimensions
        this.x = 0;
        this.y = 0;
        this.width = data.width;
        this.height = data.height;

        // stats
        this.speed = data.speed;
        this.health = data.health;
        this.damage = data.damage;
        this.collisionRadius = data.collisionRadius;
    }

    spawn(x, y){
        this.x = x;
        this.y = y;
        this.health = this.data.health;
    }

    update(dt, player){
        // calculate direction to player
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        if(len > 0){
            const normalizedDx = dx / len;
            const normalizedDy = dy / len;

            this.x += normalizedDx * this.speed * dt;
            this.y += normalizedDy * this.speed * dt;
        }
    }
}