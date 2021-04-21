class BlockPainter {

    constructor(props) {
        this.canvas = props.canvas;
        this.ctx = props.canvas.getContext('2d');
        this.columns = props.columns;
        this.rows = props.rows;
        this.backgroundColor = props.backgroundColor ?? 'white';
        this.blockWidth = Math.round(props.canvas.clientWidth / props.columns);
        this.blockHeight = Math.round(props.canvas.clientHeight / props.rows);
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
    }

    //Kirajzolás végrehajtása a már beállított színnel
    #draw(x, y) {
        this.ctx.beginPath();
        this.ctx.rect(x * this.blockWidth, y * this.blockHeight, this.blockWidth, this.blockHeight);
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
    clearCanvas(){
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.beginPath();
        this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fill();
    }
}

export default BlockPainter;