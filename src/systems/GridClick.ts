
import {EventManager, IGridClick} from '../events/Events';
import GridContainer from '../containers/Grid';
import GridVisualsContainer from '../containers/GridVisuals';

export default class GridBlick {
    constructor() {
        this.bind();
    }

    private bind(): void {
        EventManager.gridClick.addListener(this.onGridClick, this);
        EventManager.mineClick.addListener(this.unbind, this);
    }

    private unbind(): void {
        EventManager.gridClick.removeListener(this.onGridClick, this);
        EventManager.mineClick.removeListener(this.unbind, this);
    }

    private onGridClick(data:IGridClick): void {
        GridContainer.revealTileAtPosition(data.position);
        GridVisualsContainer.updateVisuals();
        if(GridContainer.checkWinCondition()) {
            EventManager.gameWon.fire({});
        }
    }
}