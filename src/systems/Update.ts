
import PixiContainer from '../containers/Pixi';
import {IUpdate, EventManager} from '../events/Events';

export default class Update {

    private frameCount:number;

    constructor() {
        this.bind();
    }

    private bind(): void {
        PixiContainer.ticker.add( (deltaTime:number) => {
            this.fireUpdate(deltaTime);
        });
    }

    public fireUpdate(deltaTime:number): void {
        this.frameCount++;
        let updateData: IUpdate = {
            deltaTime: deltaTime,
            frameCount: this.frameCount
        };
        EventManager.update.fire(updateData);
    }
}