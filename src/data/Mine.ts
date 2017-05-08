
export default class  Mine {
    public isFired: boolean = false;
    public position: PIXI.Point;

    constructor(position:PIXI.Point) {
        this.position = position;
    }
}