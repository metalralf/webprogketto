import BlockPainter from "./BlockPainter.js";
import Tetrimino from "./Tetrimino.js";

class Player extends BlockPainter {

    constructor(props) {
        super(props);
        this.columns = props.columns;
        this.rows = props.rows;
        this.objects = props.objects;
        this.onGameOver = props.onGameOver;
        this.onRowCountChanged = props.onRowCountChanged;
        this.onObjectCountChanged = props.onObjectCountChanged;
        this.delay = 150;
        this.isStarted = false;
        this.clearRowsItemDelay = 20;
        this.init();
    }

    init() {
        this.clearBoard();
        this.rowCount = 0;
        this.objectCount = 0;
    }

    //A játék újra indítása
    restart() {
        this.init();
        this.generateTetrimino();
        //A legmagasabb pontja a táblának ahol már van objektum, fordított értékkel,
        //mert minél nagyobb az y, annál lejjebb vagyunk a táblán
        this.topIndex = this.rows;
        this.isStarted = true;
        this.rowCountChanged();
        this.objectCountChanged();
        this.start();
    }

    //Játék indítása/folytatása
    start() {
        this.looperCallback = function () {
            this.moveDown();
        }.bind(this);

        if (this.isStarted) {
            this.looper = setInterval(this.looperCallback, this.delay);
        } else {
            this.restart();
        }
    }

    //Játék leállítása/szüneteltetése
    stopPlayer() {
        if (this.isRunning()) {
            clearInterval(this.looper);
            this.looper = null;
        }
    }

    //A játék futás alatt van-e?
    isRunning() {
        return this.looper !== null;
    }

    moveLeft() {
        if (!this.isRunning()) return;

        //Ha a bal szélén van vagy ha a balra mozdulástól ütközne más objektummal, akkor nem mozdulhat
        if (this.x + this.tetrimino.left > 0 && !this.isCrash(this.x - 1, this.y)) {
            this.repaint(() => this.x--);
        }
    }

    moveRight() {
        if (!this.isRunning()) return;

        //Ha a jobb szélén van vagy ha a jobbra mozdulástól ütközne más objektummal, akkor nem mozdulhat
        if (this.x + this.tetrimino.right < this.columns && !this.isCrash(this.x + 1, this.y)) {
            this.repaint(() => this.x++);
        }
    }

    //Lefelé mozgatás
    moveDown() {
        if (!this.isRunning()) return;

        //Ha a tábla aljára ért vagy lefelé mozdulva ütközne más objektummal, akkor nem mozdulhat
        if (this.y + this.tetrimino.bottom + 1 <= this.rows && !this.isCrash(this.x, this.y + 1)) {
            this.repaint(() => this.y++);
        } else {
            //Ha nincs olyan része, ami kilóg, akkor lehelyezi az objektumot a táblára
            this.put();
        }
    }

    //Elforgatja a objektumot az egyik irányba
    rotate() {
        if (!this.isRunning()) return;

        this.repaint(() => {
            this.tetrimino.rotateLeft();
            //Ha elforgatás után ütközik és így eggyel jobbra vagy balra tolva is ütközik más objektumokkal,
            //akkor visszafordítja. Azaz nem lehet elfordítani.
            if (this.isCrash(this.x, this.y)) {
                if (this.tetrimino.right < this.columns && !this.isCrash(this.x + 1, this.y)) {
                    this.x++;
                    return;
                }
                if (this.tetrimino.left > 0 && !this.isCrash(this.x - 1, this.y)) {
                    this.x--;
                    return;
                }
                this.tetrimino.rotateRight();
            }
        });
    }

    invalidate() {
        super.invalidate();
        if (this.board === undefined) return;

        this.clearCanvas();
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                if (this.board[i][j] !== null) {
                    this.drawBlock(j, i, this.board[i][j].color);
                }
            }
        }
    }

    //Játék vége, leállítás és az onGameOver esemény meghívása, ha meg van adva
    gameOver() {
        this.isStarted = false;
        this.stopPlayer();
        if (this.onGameOver != null) {
            this.onGameOver();
        }
    }

    rowCountChanged() {
        if (this.onRowCountChanged !== null) {
            this.onRowCountChanged(this.rowCount);
        }
    }

    objectCountChanged() {
        if (this.onObjectCountChanged !== null) {
            this.onObjectCountChanged(this.objectCount);
        }
    }

    //Letörli az egész táblát
    clearBoard() {
        this.board = Array(this.rows).fill(null).map(() => Array(this.columns).fill(null));
        this.clearCanvas();
    }

    //Generál egy új objektumot és középen legfelülre helyezi a táblán
    generateTetrimino() {
        const index = Math.round(Math.random() * (this.objects.length - 1));
        this.tetrimino = new Tetrimino(this.objects[index]);
        this.x = Math.floor((this.columns - this.tetrimino.right + this.tetrimino.left) / 2);
        this.y = -this.tetrimino.bottom;

        for (let i = 0; i < Math.floor(Math.random() * 4); i++) {
            this.tetrimino.rotateLeft();
        }

        this.repaint(() => { });

        this.objectCount++;
        this.objectCountChanged();
    }

    //Az aktuális objektumot kitörli, majd meghívja a megadott callback függvényt és utána kirajzolja újra az objektumot
    repaint(callback) {
        this.tetrimino.iterateOnlyFullItems((x, y) => {
            if (this.y + y >= 0) {
                this.clearBlock(this.x + x, this.y + y);
            }
        });
        callback();
        this.tetrimino.iterateOnlyFullItems((x, y) => {
            if (this.y + y >= 0) {
                this.drawBlock(this.x + x, this.y + y, this.tetrimino.color);
            }
        });
    }

    //Ha a megadott pontba kerülne az aktuális objektum, akkor ütközne-e a táblán szereplő másik objektummal?
    isCrash(newX, newY) {
        let result = false;
        this.tetrimino.iterateOnlyFullItems((x, y) => {
            if (newY + y >= 0 && this.board[newY + y][newX + x] !== null) {
                result = true;
            }
        });
        return result;
    }

    put() {
        let gameOver = false;
        //Az objektum teli elemeit belerakja a tábla megfelelő részeibe
        this.tetrimino.iterateOnlyFullItems((x, y) => {
            if (this.y + y >= 0) {
                this.board[this.y + y][this.x + x] = this.tetrimino
            } else {
                gameOver = true;
            }
        });

        if(gameOver) {
            this.gameOver();
            return;
        }

        const fullRows = [];
        const topIndex = this.y + this.tetrimino.top;

        //Ha az új topIndex nagyobb a réginél kicseréli, mert akkor van magasabban objektum a táblán, mint eddig
        if (topIndex < this.topIndex) {
            this.topIndex = topIndex;
        }

        //Azokat a sorokat vizsgálja meg a ciklus, hogy teli sorok-e, amelyekre hatással van az objektum a lerakás után
        for (let y = this.y + this.tetrimino.bottom - 1; y >= this.y + this.tetrimino.top; y--) {
            if (this.isFullRow(y)) {
                //Feltölti a tömböt a teli sorokkal
                fullRows.push(y);
            }
        }

        //Ha van teli sor letörli azt egyesével animálva
        if (fullRows.length) {
            this.stopPlayer();
            let index = 0;

            //Ha letöröl egy sort, megnézi vannak-e még további sorok, majd a következőt is letörli, ha van
            const clearRowFinished = function () {
                //Az index értékét még hozzá kell adni a fullRows-ban tárolt y értékekhez,
                //mert minden törlés után eggyel lejjebb kerülnek a kitörölt sor felett lévő sorok
                this.collapseTo(fullRows[index] + index);
                index++;
                if (index < fullRows.length) {
                    this.clearRow(fullRows[index] + index, clearRowFinished);
                } else {
                    //Ha végig ment a tömbön, azaz minden sort kitörölt, amit kell, új objektumot rak a táblára
                    this.generateTetrimino();
                    this.start();
                }
            }.bind(this);

            this.clearRow(fullRows[0], clearRowFinished);
        } else {
            this.generateTetrimino();
        }
    }

    //Animálva kitöröl egy megadott sort, ha végzett meghívja az OnFinish függvényt
    clearRow(y, onFinish) {
        let x = this.columns - 1;
        const clearBlock = function () {
            this.board[x][y] = 0;
            this.clearBlock(x, y);
            x--;
            if (x < 0) {
                onFinish();
            } else {
                setTimeout(clearBlock, this.clearRowsItemDelay);
            }
        }.bind(this);
        setTimeout(clearBlock, this.clearRowsItemDelay);
    }

    //Ha a megadott sor teli (minden eleme a sornak hivatkozik egy objektumra), akkor igazzal tér vissza
    isFullRow(y) {
        return this.board[y].every((value) => value !== null);
    }

    //Teli sor kitörlése után ez a metódus hívodik meg, hogy a kitörölt sor feletti sorokat, lejjebb tolja eggyel
    collapseTo(bottom) {
        //A megadott sortól felfelé az összes sort megnézi a topIndex-ig (a legmagasabb pont, ahol már van objektum)
        //és az ott található értékeket az eggyel alatta lévő sorokba másolja
        for (let y = bottom - 1; y >= this.topIndex; y--) {
            this.board[y].forEach((value, x) => {
                this.board[y + 1][x] = value;
                if (value !== null) {
                    this.drawBlock(x, y + 1, value.color);
                } else {
                    this.clearBlock(x, y + 1);
                }
            });
        }
        //Kitörli a legfelső nem teljesen üres sort
        this.board[this.topIndex].forEach((value, x) => {
            this.board[this.topIndex][x] = null;
            this.clearBlock(x, this.topIndex);
        });
        //A topIndexet eggyel nagyobbra állítja, a legmagasabb pont eggyel lejjebb csúszott a kitörölt sor miatt
        this.topIndex++;
        this.rowCount++;
        this.rowCountChanged();
    }

    destroy() {
        this.stopPlayer();
    }
}

export default Player;