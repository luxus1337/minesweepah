
import PixiContainer from '../containers/Pixi';
import GridContainer from '../containers/Grid';
import Tile from '../data/Tile';

import {EventManager, GridClick} from '../events/Events';

export default class GridVisuals {

    static mines: PIXI.Sprite[];
    static tiles: PIXI.Sprite[];
    static flags: PIXI.Sprite[];

    static tileTexts: PIXI.Text[];
    static timerText: PIXI.Text;

    static tileHoverFrame: PIXI.Texture;
    static tileFrame: PIXI.Texture;

    static gridBackground: PIXI.Sprite[];
    static background: PIXI.Sprite;

    static flagModeButton: PIXI.Sprite;
    static flagModeOnFrame: PIXI.Texture;
    static flagModeOffFrame: PIXI.Texture;
    static retryFrame: PIXI.Texture;

    static emotionFeedback: PIXI.Sprite;
    static emotionHappyFrame: PIXI.Texture;
    static emotionSadFrame: PIXI.Texture;
    static emotionScaredFrame: PIXI.Texture;

    static gridContainerSize: number = 630; //we are assuming a square here
    static gridContainerMarginHorizontal: number = 45;
    static gridContainerMarginVertically: number = 290;
    static tileSize: number;

    static init(): void {
        GridVisuals.mines = [];
        GridVisuals.tiles = [];
        GridVisuals.flags = [];
        GridVisuals.tileTexts = [];
        GridVisuals.gridBackground = [];
        GridVisuals.tileSize = GridVisuals.gridContainerSize / GridContainer.gridSize;
        GridVisuals.initTextureFrames();
        GridVisuals.addBackground();
        GridVisuals.addMinesAndTiles();
        GridVisuals.addFlagModeButton();
        GridVisuals.addTimer();
        GridVisuals.addEmotion();
    }

    static addEmotion(): void {
        GridVisuals.emotionHappyFrame = PIXI.Texture.fromImage('sprites/smiley-smile.png');
        GridVisuals.emotionScaredFrame = PIXI.Texture.fromImage('sprites/smiley-oface.png');
        GridVisuals.emotionSadFrame = PIXI.Texture.fromImage('sprites/smiley-sad.png');
        GridVisuals.emotionFeedback = new PIXI.Sprite(GridVisuals.emotionHappyFrame);
        GridVisuals.emotionFeedback.anchor.set(.5,.5);
        GridVisuals.emotionFeedback.position.set(560, 150);
        PixiContainer.app.stage.addChild(GridVisuals.emotionFeedback);
    }

    static initTextureFrames(): void {
        GridVisuals.tileHoverFrame = PIXI.Texture.fromImage('sprites/tile-hover.png');
        GridVisuals.tileFrame = PIXI.Texture.fromImage('sprites/tile.png');
        GridVisuals.flagModeOnFrame = PIXI.Texture.fromImage('sprites/flagmode-on.png');
        GridVisuals.flagModeOffFrame = PIXI.Texture.fromImage('sprites/flagmode-off.png');
        GridVisuals.retryFrame = PIXI.Texture.fromImage('sprites/retry-button.png');
    }

    static addBackground(): void {
        GridVisuals.background = PIXI.Sprite.fromImage('sprites/background.png');
        PixiContainer.app.stage.addChild(GridVisuals.background);
    }

    static gridPositionToSpritePosition(gridPosition: PIXI.Point) {
        return new PIXI.Point(
            GridVisuals.gridContainerMarginHorizontal + gridPosition.x * GridVisuals.tileSize,
            GridVisuals.gridContainerMarginVertically + gridPosition.y * GridVisuals.tileSize
        );
    }

    static addMinesAndTiles(): void {
        let bgSprite: PIXI.Sprite;
        let mineSprite: PIXI.Sprite;
        let tileSprite: PIXI.Sprite;

        GridContainer.tiles.forEach((tile:Tile) => {
            //actual render position
            let spritePosition = GridVisuals.gridPositionToSpritePosition(tile.position);

            //grid background
            //@TODO: Use a repeating texture...
            let bgSprite = PIXI.Sprite.fromImage('sprites/tile-bg.png');
            GridVisuals.gridBackground.push(bgSprite);
            bgSprite.position.copy(spritePosition);
            PixiContainer.app.stage.addChild(bgSprite);

            //the mine
            if(tile.mine !== null) {
                mineSprite = PIXI.Sprite.fromImage('sprites/mine.png');
                GridVisuals.mines.push(mineSprite);
                mineSprite.position.copy(spritePosition);
                PixiContainer.app.stage.addChild(mineSprite);
            }

            //the tile above it gridContainerMarginVertically
            let tileSprite = new PIXI.Sprite(GridVisuals.tileFrame);
            GridVisuals.tiles.push(tileSprite);
            tileSprite.position.copy(spritePosition);
            PixiContainer.app.stage.addChild(tileSprite);

            //let the tile fire and event if he is clicked
            tileSprite.interactive = true;

            tileSprite.on('rightdown', () => {
                GridContainer.flagPosition(tile.position);
            });

            const handlePointer = () => {
                if(tile.mine !== null) {
                    if(GridContainer.flagMode) {
                        EventManager.gridClick.fire({
                            position: tile.position
                        });
                    } else {
                        EventManager.mineClick.fire({
                            position: tile.position
                        });
                    }
                } else {
                    EventManager.gridClick.fire({
                        position: tile.position
                    });
                }
            }

            tileSprite.on('mousedown', handlePointer);
            tileSprite.on('touchdown', handlePointer);


            //tile animation for hover
            tileSprite.on('mouseover', () => {
                tileSprite.texture = GridVisuals.tileHoverFrame;
            });
            tileSprite.on('mouseout', () => {
                tileSprite.texture = GridVisuals.tileFrame;
            });
        });
    }

    static addFlagModeButton(): void {
        GridVisuals.flagModeButton = new PIXI.Sprite(GridVisuals.flagModeOffFrame);
        GridVisuals.flagModeButton.interactive = true;
        GridVisuals.flagModeButton.on('pointerdown', () => {
            GridVisuals.switchFlagMode();
        });
        GridVisuals.flagModeButton.position.set(
            GridVisuals.gridContainerMarginHorizontal,
            GridVisuals.gridContainerMarginVertically + GridVisuals.gridContainerMarginHorizontal + GridVisuals.gridContainerSize
        );
        PixiContainer.app.stage.addChild(GridVisuals.flagModeButton);
    }

    static addTimer(): void {
        GridVisuals.timerText = new PIXI.Text("0",{fontFamily : 'Arial', fontSize: 80, fill : 0x633d2e, align : 'left'});
        GridVisuals.timerText.position.set(220, 150);
        GridVisuals.timerText.anchor.set(0,.5);
        PixiContainer.app.stage.addChild(GridVisuals.timerText);
    }

    static setTime(time:number) {
        GridVisuals.timerText.text = Math.round(time).toString();
    }

    static switchFlagMode(): void {
        if(GridContainer.gameOver) {
            EventManager.gameReset.fire({});
        } else {
            GridContainer.flagMode = !GridContainer.flagMode;
            GridVisuals.updateVisuals();
        }
    }

    static updateVisuals(): void {
        GridContainer.tiles.forEach((tile:Tile, index:number) => {
            if(tile.isRevealed) {
                GridVisuals.tiles[index].visible = false;
                let tileNeighbourCount = tile.getMineNeighbourCount();
                if(tileNeighbourCount > 0 && tile.mine === null) {
                    if(undefined === GridVisuals.tileTexts[index]) {
                        GridVisuals.tileTexts[index] = new PIXI.Text(tileNeighbourCount.toString(),{fontFamily : 'Arial', fontSize: 30, fill : 0x633d2e, align : 'center'});
                        GridVisuals.tileTexts[index].position = GridVisuals.gridPositionToSpritePosition(tile.position);
                        GridVisuals.tileTexts[index].anchor.set(.5,.5);
                        GridVisuals.tileTexts[index].position.x += GridVisuals.tileSize * .5;
                        GridVisuals.tileTexts[index].position.y += GridVisuals.tileSize * .5;
                        PixiContainer.app.stage.addChild(GridVisuals.tileTexts[index]);
                    } else {
                        GridVisuals.tileTexts[index].text = tileNeighbourCount.toString();
                    }
                }
            }
            if(tile.isFlagged && !tile.isRevealed) {
                if(undefined === GridVisuals.flags[index]) {
                    GridVisuals.flags[index] = PIXI.Sprite.fromImage('sprites/flag.png');
                    GridVisuals.flags[index].position = GridVisuals.gridPositionToSpritePosition(tile.position);
                    GridVisuals.flags[index].anchor.set(.5,.5);
                    GridVisuals.flags[index].position.x += GridVisuals.tileSize * .5;
                    GridVisuals.flags[index].position.y += GridVisuals.tileSize * .5;
                    PixiContainer.app.stage.addChild(GridVisuals.flags[index]);
                }
                GridVisuals.flags[index].visible = true;
            } else {
                if(undefined !== GridVisuals.flags[index]) {
                    GridVisuals.flags[index].visible = false;
                }
            }
        });
        if(GridContainer.gameOver) {
            GridVisuals.flagModeButton.texture = GridVisuals.retryFrame;
        } else {
            if(GridContainer.flagMode) {
                GridVisuals.flagModeButton.texture = GridVisuals.flagModeOnFrame;
            } else {
                GridVisuals.flagModeButton.texture = GridVisuals.flagModeOffFrame;
            }
        }
    }

}