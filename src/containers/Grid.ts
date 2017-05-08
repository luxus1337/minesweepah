
import Tile from '../data/Tile';
import Mine from '../data/Mine';
import GridVisualsContainer from '../containers/GridVisuals'

export default class Grid {
    static flagMode: boolean = false;
    static gameOver: boolean = false;
    static tiles: Tile[];

    
    static mineConfig: number[];
    /** Test Level:
    static mineConfig: number[] = [
        0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,1,0,0,0
    ];
     */

    //@TODO: use level json's
    static mineConfigs: number[][] = [
        [
            0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,1,0,0,0,
            0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,1,1,
            0,0,0,0,1,0,0,0,0,
            0,0,0,0,0,1,0,0,1,
            0,0,0,0,0,0,1,0,0,
            0,1,0,0,0,0,1,0,0,
            0,0,0,0,0,1,0,0,0
        ],
        [
            0,1,0,0,0,0,0,0,1,
            0,0,0,0,0,0,0,0,0,
            0,1,0,0,0,0,0,0,0,
            0,0,1,1,0,0,0,0,0,
            0,0,0,0,0,1,1,0,0,
            0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,1,0,0,
            0,0,0,0,0,0,0,1,0,
            1,0,0,0,0,0,0,0,0
        ],
        [
            0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,1,0,1,
            0,0,0,1,0,0,0,0,0,
            0,0,0,1,0,0,1,0,0,
            0,0,0,0,1,0,1,0,0,
            0,0,0,0,0,0,1,0,0,
            0,0,0,0,1,1,0,0,0,
            0,0,0,0,1,0,0,0,0,
            0,0,0,0,0,0,0,0,0
        ],
    ]
    static gridSize: number = 9; //we are assuming a square here    

    static init(): void {
        //pick a random config
        Grid.mineConfig = Grid.mineConfigs[Math.floor(Grid.mineConfigs.length * Math.random())];

        //reset the tiles
        Grid.tiles = [];
        Grid.gameOver = false;
        Grid.flagMode = false;
        Grid.createGrid();
        Grid.calculateNeighbours();
    }

    static revealAllMines(): void {
        Grid.tiles.forEach((tile:Tile) => {
            if(tile.mine !== null) {
                Grid.revealTileAtPosition(tile.position);
            }
        });
    }

    static doesPositionHaveMine(position: PIXI.Point): boolean {
        return Grid.mineConfig[position.y * Grid.gridSize + position.x] === 1;
    }

    static getTileAtPosition(position: PIXI.Point): Tile {
        if(position.y < 0 || position.x < 0 || position.y >= Grid.gridSize || position.x >= Grid.gridSize) {
            return null;
        }
        return undefined !== Grid.tiles[position.y * Grid.gridSize + position.x] ? Grid.tiles[position.y * Grid.gridSize + position.x] : null;
    }

    static revealTileAtPosition(position: PIXI.Point): void {
        if(Grid.flagMode) {
            Grid.flagPosition(position);
        } else {
            let tile = Grid.getTileAtPosition(position);
            if(tile !== null && !tile.isRevealed && !tile.isFlagged) {
                tile.isRevealed = true;
                if(tile.getMineNeighbourCount() === 0 && tile.mine === null) {
                    tile.neighbours.forEach( (neighbourTile:Tile) => {
                        if(neighbourTile !== null) {
                            Grid.revealTileAtPosition(neighbourTile.position);
                        }
                    });
                }
            }
        }
    }

    static flagPosition(position: PIXI.Point): void {
        let tile = Grid.getTileAtPosition(position);
        if(!tile.isRevealed && !tile.isFlagged) {
            tile.isFlagged = true;
        } else if(!tile.isRevealed && tile.isFlagged) {
            tile.isFlagged = false;
        }

        GridVisualsContainer.updateVisuals();
    }

    static createGrid(): void {
        for(let y = 0; y < Grid.gridSize; y++) {
            for(let x = 0; x < Grid.gridSize; x++) {
                let tilePosition = new PIXI.Point(x, y);
                Grid.tiles.push(
                    new Tile(
                        tilePosition,
                        Grid.doesPositionHaveMine(tilePosition) ? new Mine(tilePosition) : null
                    )
                );
            }
        }
    }

    static calculateNeighbours(): void {
        Grid.tiles.forEach((tile:Tile) => {
            tile.setNeighbours(Grid.getNeighbourConfigForPosition(tile.position));
        });
    }

    static getNeighbourConfigForPosition(position:PIXI.Point): Tile[] {
        let neighbourConfig: Tile[] = [];
        let neighbourPositions: PIXI.Point[] = [
            new PIXI.Point(position.x - 1, position.y - 1),
            new PIXI.Point(position.x,     position.y - 1),
            new PIXI.Point(position.x + 1, position.y - 1),
            new PIXI.Point(position.x + 1, position.y,),
            new PIXI.Point(position.x + 1, position.y + 1),
            new PIXI.Point(position.x,     position.y + 1),
            new PIXI.Point(position.x - 1, position.y + 1),
            new PIXI.Point(position.x - 1, position.y)
        ];

        neighbourPositions.forEach( (position:PIXI.Point, index) => {
            neighbourConfig[index] = Grid.getTileAtPosition(position);
        });
        return neighbourConfig;
    }

    static checkWinCondition(): boolean {
        let weWon = true;
        Grid.tiles.forEach((tile:Tile) => {
            if(!tile.isRevealed && tile.mine === null) {
                weWon = false;
                return false;
            }
        });
        return weWon;
    }
}