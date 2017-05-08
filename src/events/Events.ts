
import Event from './Event';

export interface IGeneric {};

export interface IGridClick {
    position: PIXI.Point;
}

export interface IUpdate {
    deltaTime: number;
    frameCount: number;
}

export interface IClickMode {
    isFlagMode: boolean;
}

export class Update extends Event<IUpdate>{};
export class GridClick extends Event<IGridClick>{};
export class GameOver extends Event<IGeneric>{};
export class GameWon extends Event<IGeneric>{};
export class GameReset extends Event<IGeneric>{};
export class MineClick extends Event<IGridClick>{};
export class ChangeClickMode extends Event<IClickMode>{};

export class EventManager {
    static update: Update = new Update();
    static gridClick: GridClick = new GridClick();
    static gameOver: GameOver = new GameOver();
    static gameWon: GameWon = new GameWon();
    static gameReset: GameReset = new GameReset();
    static mineClick: MineClick = new MineClick();
    static changeClickMode: ChangeClickMode = new ChangeClickMode();
}


