
import {Application} from 'pixi.js'

export default class PixiContainer {
    
    static app:Application;

    static init(): void {
        PixiContainer.app = new Application();
        document.body.appendChild(PixiContainer.app.view);
    }
}