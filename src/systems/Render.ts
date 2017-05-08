
import PixiContainer from '../containers/Pixi';
import {IUpdate, EventManager} from '../events/Events';

export default class Render {

    private now:number;
    private currentFrameTime:number;
    private lastFrameTime:number;
    private frameCount:number;

    constructor() {
        this.bind();
    }

    private bind(): void {
        EventManager.update.addListener(this.onUpdate, this);
    }

    private unbind(): void {
        EventManager.update.addListener(this.onUpdate, this);
    }

    public onUpdate(data:IUpdate): void {
        PixiContainer.app.render();
    }
}