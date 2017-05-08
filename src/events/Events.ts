import {Point} from 'pixi.js';
import Event from './Event';

export interface IGridClick {
    position: Point;
}

export class GridClick extends Event<IGridClick>{};

export class EventManager {
    static gridClick: GridClick;
}
