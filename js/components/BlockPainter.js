class BlockPainter {
    constructor(props) {
        this.parent = props.parent;
        this.canvas = document.createElement('canvas');
        this.parent.append(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.columns = props.columns;
        this.rows = props.rows;
        this.backgroundColor = props.backgroundColor ?? 'white';
        this.invalidate();
    }

    //Kirajzolás végrehajtása a már beállított színnel
    #draw(x, y) {
        this.ctx.beginPath();

        const space = Math.floor(this.blocksize * 0.1);

        this.ctx.rect(
            x * this.blocksize + space,
            y * this.blocksize + space,
            this.blocksize - 2 * space,
            this.blocksize - 2 * space
        );
        this.ctx.fill();
    }

    //Kirjazol egy blokkot a megadott pontra, megadott színnel
    drawBlock(x, y, color) {
        this.ctx.fillStyle = color;
        this.#draw(x, y);
    }

    //Kitöröl egy blokkot a megadott ponton
    clearBlock(x, y) {
        this.ctx.fillStyle = this.backgroundColor;
        this.#draw(x, y);
    }

    //Az egész canvast letörli
    clearCanvas() {
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.beginPath();
        this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fill();
    }

    invalidate() {
        const parentAspectRatio = this.parent.clientWidth / this.parent.clientHeight;
        const canvasAspectRatio = this.columns / this.rows;

        if (canvasAspectRatio < parentAspectRatio) {
            //Magassághoz igazít
            this.blocksize = Math.floor(this.parent.clientHeight / this.rows);
        } else {
            //Szélességhez igazít
            this.blocksize = Math.floor(this.parent.clientWidth / this.columns);
        }

        this.canvas.width = this.blocksize * this.columns;
        this.canvas.height = this.blocksize * this.rows;
    }
}

export default BlockPainter;