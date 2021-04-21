class Tetrimino {
    constructor(props) {
        this.color = props.color;
        this.matrix = props.matrix;
        //TODO csak négyzetes mátrixot fogad el
        this.height = props.matrix.length;
        this.width = props.matrix.length;
        this.#updateClientRect();
    }

    //Balra fordítja az objektumot
    rotateLeft() {
        const result = Array(this.height).fill(null).map(() => Array(this.width));
        this.iterateMatrix((x, y) => result[x][y] = this.matrix[this.width - y - 1][x]);
        this.matrix = result;
        this.#updateClientRect();
    }

    //Jobbra fordítja az objektumot
    rotateRight() {
        const result = Array(this.height).fill(null).map(() => Array(this.width));
        this.iterateMatrix((x, y) => result[x][y] = this.matrix[y][this.width - x - 1]);
        this.matrix = result;
        this.#updateClientRect();
    }

    //Bejárja az objektum mátrixának összes elemét
    iterateMatrix(callback) {
        for (let y = 0; y < this.height; y++) {
            let row = this.matrix[y];
            for (let x = 0; x < row.length; x++) {
                callback(x, y);
            }
        }
    }

    //Bejárja az objektum mátrixának csak a teli elemét
    iterateOnlyFullItems(callback) {
        this.iterateMatrix((x, y) => {
            if (this.matrix[y][x] === 1)
                callback(x, y);
        });
    }

    #updateClientRect() {
        this.left = this.width;
        this.top = this.height;
        this.right = 0;
        this.bottom = 0;
        this.iterateOnlyFullItems((x, y) => {
            if (this.right <= x) {
                this.right = x + 1;
            }
            if (this.bottom <= y) {
                this.bottom = y + 1;
            }
            if (this.left > x) {
                this.left = x;
            }
            if (this.top > y) {
                this.top = y;
            }
        });
    }
}

export default Tetrimino;
