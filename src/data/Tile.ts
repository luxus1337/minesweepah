import {Point} from 'pixi.js';
import {Mine} from './Mine';

export interface Tile {
    position: Point;
    /**
     * A string with length of 8 where the positioning (indexes) of the neighbours is clockwise so:
     * 
     * 0 1 2
     * 7 x 3
     * 6 5 4
     * 
     * x = the tile itself
     * 
     * In the string a 0 represents no neighbour a 1 represents a bomb
     */
    neighbourhoodConfig: string;
    mine: Mine; //null if no mine
    hasMine(): boolean;
}