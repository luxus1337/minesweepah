
import PixiContainer from '../containers/Pixi';
import GridContainer from '../containers/Grid';
import GridVisualsContainer from '../containers/GridVisuals';
import {EventManager} from '../events/Events';

export default class Init {
    constructor() {
        PixiContainer.init();
        this.onReset();
        this.bind();
    }

    private bind(): void {
        EventManager.gameReset.addListener(this.onReset, this);
        EventManager.gameWon.addListener(this.onWon, this);
    }

    private unbind(): void {
        EventManager.gameReset.removeListener(this.onReset, this);
        EventManager.gameWon.removeListener(this.onWon, this);
    }

    private onWon(): void {
        GridContainer.gameOver = true;
        GridVisualsContainer.updateVisuals();
    }

    private onReset(): void {
        PixiContainer.cleanUp();
        GridContainer.init();
        GridVisualsContainer.init();
    }
}