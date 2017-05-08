
import PixiContainer from '../containers/Pixi';

export default class Resize {

    constructor() {
        this.bind();
    }

    private bind(): void {
        window.addEventListener('resize', this.onResize, false);
        this.onResize();
    }

    private onResize() {
        let canvas = PixiContainer.canvas;
        let canvasRatio = canvas.height / canvas.width;
        let windowRatio = window.innerHeight / window.innerWidth;
        let width;
        let height;

        if (windowRatio < canvasRatio) {
            height = window.innerHeight;
            width = height / canvasRatio;
        } else {
            width = window.innerWidth;
            height = width * canvasRatio;
        }

        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
    };

}