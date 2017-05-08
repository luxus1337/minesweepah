
export default class Pixi {
    
    static app:PIXI.Application;
    static canvas:HTMLCanvasElement;
    static ticker:PIXI.ticker.Ticker;

    static init(): void {
        //create the application and make it staticly available
        Pixi.app = new PIXI.Application(720, 1220);

        //store a reference to the created canvas element
        Pixi.canvas = Pixi.app.view;

        //store a reference to the ticker
        Pixi.ticker = Pixi.app.ticker;

        //append the canvas to the body
        document.body.appendChild(Pixi.canvas);

        Pixi.app.start();
    }

    static cleanUp(): void {
        for (let i = Pixi.app.stage.children.length - 1; i >= 0; i--) {	
            Pixi.app.stage.removeChild(Pixi.app.stage.children[i]);
        };
    }

}