
import GridVisualsContainer from '../containers/GridVisuals';
import PixiContainer from '../containers/Pixi';
import {IUpdate, EventManager} from '../events/Events';

export default class Timer {

    private now:number;

    constructor() {
        this.now = 0;
        this.bind();
    }

    private bind(): void {
        EventManager.update.addListener(this.onUpdate, this);
        EventManager.mineClick.addListener(this.unbind, this);
        EventManager.gameWon.addListener(this.unbind, this);
    }

    private unbind(): void {
        EventManager.update.removeListener(this.onUpdate, this);
        EventManager.mineClick.removeListener(this.unbind, this);
        EventManager.gameWon.removeListener(this.unbind, this);
    }

    public onUpdate(data:IUpdate): void {
        this.now += PixiContainer.ticker.elapsedMS;
        GridVisualsContainer.setTime(this.now * 0.001);
    }
}
