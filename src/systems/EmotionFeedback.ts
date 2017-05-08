
import {EventManager, IGridClick} from '../events/Events';
import GridContainer from '../containers/Grid';
import GridVisualsContainer from '../containers/GridVisuals';

export default class GridBlick {
    constructor() {
        this.bind();
    }

    private bind(): void {
        EventManager.gridClick.addListener(this.onGridClick, this);
        EventManager.mineClick.addListener(this.onMineClick, this);
    }

    private unbind(): void {
        EventManager.gridClick.removeListener(this.onGridClick, this);
        EventManager.mineClick.removeListener(this.onMineClick, this);
    }

    private onGridClick(data:IGridClick): void {
        GridVisualsContainer.emotionFeedback.texture = GridVisualsContainer.emotionScaredFrame;
        setTimeout( () => {
            GridVisualsContainer.emotionFeedback.texture = GridVisualsContainer.emotionHappyFrame;
        }, 300)
    }

    private onMineClick(data:IGridClick): void {
        GridVisualsContainer.emotionFeedback.texture = GridVisualsContainer.emotionSadFrame;
        this.unbind();
    }
}