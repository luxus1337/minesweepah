import Mine from './Mine';

export default class Tile {

    //weather this Tile is revealed or not
    public isRevealed: boolean = false;
    public isFlagged: boolean = false;
    
    //the position in the grid
    public position: PIXI.Point;

    //The main placed on this tile.. null of none
    public mine: Mine = null;

    /**
     * @var neighbourhoodConfig
     * An array length of 8 where the positioning (indexes) of the neighbours is clockwise so:
     * 
     *   0 1 2
     *   7 x 3          x = the tile itself
     *   6 5 4
     */
    public neighbours: Tile[];

    constructor(position: PIXI.Point, mine:Mine = null) {
        this.position = position;
        this.mine = mine;
    }

    public setNeighbours(neighbourhoodConfig: Tile[]): void {
        this.neighbours = neighbourhoodConfig;
    }

    public hasMineNeighbours(): boolean {
        for(let i = 0; i < this.neighbours.length; i++) {
            if(this.neighbours[i] !== null && this.neighbours[i].mine !== null) {
                return true;
            }
        }
        return false;
    }

    public getMineNeighbourCount(): number {
        let count = 0;
        for(let i = 0; i < this.neighbours.length; i++) {
            if(this.neighbours[i] !== null && this.neighbours[i].mine !== null) {
                count++;
            }
        }
        return count;
    }
}