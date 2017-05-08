
import {EventManager, IGridClick} from '../events/Events';
import GridContainer from '../containers/Grid';
import GridVisualsContainer from '../containers/GridVisuals';

export default class MineClick {
    constructor() {
        this.bind();
    }

    private bind(): void {
        EventManager.mineClick.addListener(this.onMineClick, this);
        EventManager.gameWon.addListener(this.unbind, this);
    }

    private unbind(): void {
        EventManager.mineClick.removeListener(this.onMineClick, this);
        EventManager.gameWon.removeListener(this.unbind, this);
    }

    private onMineClick(data:IGridClick): void {
        GridContainer.revealAllMines();
        GridContainer.gameOver = true;
        GridVisualsContainer.updateVisuals();
        this.unbind();
    }
}