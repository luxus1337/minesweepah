
import ContainersSystem from '../systems/Containers';
import ResizeSystem from '../systems/Resize';
import UpdateSystem from '../systems/Update';
import RenderSystem from '../systems/Render';
import GridClickSystem from '../systems/GridClick';
import MineClickSystem from '../systems/MineClick';
import TimerSystem from '../systems/Timer';
import EmotionFeedbackSystem from '../systems/EmotionFeedback';
import {EventManager} from '../events/Events'

export default class Game {
    constructor() {
        /**
         * Containers systems are listed below.. these are systems that do an "one-and-done"-job
         */
        new ContainersSystem();

        /**
         * Reactive systems are listed below.. these systems react to Game or DOM events only.. (e.g. UpdateEvent, PointerEvent, .. )
         */
        new UpdateSystem();
        this.createReactiveSystems();
        EventManager.gameReset.addListener(this.createReactiveSystems, this);
    }

    private createReactiveSystems(): void {
        new ResizeSystem();
        new RenderSystem();
        new TimerSystem();
        new GridClickSystem();
        new MineClickSystem();
        new EmotionFeedbackSystem();
    }
}