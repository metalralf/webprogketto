class BlockPainter {
    constructor(props) {
        this.canvas = props.canvas;
        this.ctx = props.canvas.getContext('2d');
        this.columns = props.columns;
        this.rows = props.rows;
        this.backgroundColor = props.backgroundColor ?? 'white';
        this.invalidate();
    }

    //Kirajzolás végrehajtása a már beállított színnel
    #draw(x, y) {
        this.ctx.beginPath();

        const spaceX = this.blockWidth * 0.1;
        const spaceY = this.blockHeight * 0.1;

        this.ctx.rect(
            x * this.blockWidth + spaceX / 2,
            y * this.blockHeight + spaceY / 2,
            this.blockWidth - spaceX,
            this.blockHeight - spaceY
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
        this.blockWidth = Math.round(this.canvas.width / this.columns);
        this.blockHeight = Math.round(this.canvas.height / this.rows);
    }
}

export default BlockPainter;