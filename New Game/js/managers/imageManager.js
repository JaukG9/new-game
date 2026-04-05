export class ImageManager{
    constructor(){
        this.images = {};
    }

    load(name, path){
        return new Promise((resolve) => {
            const img = new Image();
            img.src = path;
            this.images[name] = {img, loaded:false};

            img.onload = () => {
                this.images[name].loaded = true;
                console.log(`[DEV] Image loaded: ${name}`);
                resolve();
            }
            img.onerror = () => {
                console.log(`Image failed: ${name} (will use fallback)`);
                resolve();
            }
        });
    }

    get(name){
        return this.images[name]?.loaded ? this.images[name].img : null;
    }

    async loadAll(){
        await Promise.all([
            this.load('player', './images/player.png')
        ]);
    }
}