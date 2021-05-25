import Player from "../components/Player.js";
import { emptyElement, addElement } from "../utils/DOMUtils.js";
import Objects from "../components/Objects.js";

class PlayTetris {

    constructor() { 
        this.init();
    }

    init() {
        this.playerContainer = document.getElementById('content-frame');
        this.rowStat = document.getElementById('rowCount');
        this.objStat = document.getElementById('objCount');
        this.pointStat = document.getElementById('pointCount');

        this.rowCount = 0;
        this.objCount = 0;
        this.pointCount = 0;
        this.recalculatePoints();
        
        if(this.playerContainer){
            emptyElement(this.playerContainer);

            this.player = new Player(
                {
                    parent: this.playerContainer,
                    columns: 15,
                    rows: 30,
                    backgroundColor: 'black',
                    objects: Objects,
                    onGameOver: () => this.onGameOver(),
                    onRowCountChanged: (rowCount) => this.setRowCount(rowCount),
                    onObjectCountChanged: (objCount) => this.setObjectCount(objCount)
                }
            );

        }

        this.resizeCanvas = function () {
            this.player.invalidate();
        }.bind(this);

        window.addEventListener('resize', this.resizeCanvas);

        this.keyDown = function (event) {
            if (event.keyCode === 32) {
                if (this.player.isRunning()) {
                    this.player.rotate();
                } else {
                    this.player.start();
                }
            }

            switch (event.keyCode) {
                case 38:
                    // player.rotate();
                    break;
                case 40:
                    this.player.moveDown();
                    break; //down
                case 39:
                    this.player.moveRight();
                    break; //right
                case 37:
                    this.player.moveLeft();
                    break; //left
            }
        }.bind(this);

        document.addEventListener('keydown', this.keyDown);
    }

    newGame() {
        if(this.player && !this.player.isStarted){
            this.initPoints();
            this.player.start();
        }
    }

    restartGame() {
        if(this.player && this.player.isStarted){
            this.initPoints();
            this.player.stop();
            this.player.restart();
        }
    }

    pauseGame() {
        if(this.player && this.player.isStarted){
            this.player.stop();
        }
    }

    continueGame(){
        if(this.player && !this.player.isRunning() && this.player.isStarted){
            this.player.start();
        }
    }

    leaderboard() {
    }

    editor() {
    }

    setRowCount(rowCount) {
        this.rowCount = rowCount;
        this.rowStat.textContent = this.rowCount;
        this.recalculatePoints();
    }

    setObjectCount(objCount) {
        this.objCount = objCount;
        this.objStat.textContent = this.objCount;
        this.recalculatePoints();
    }

    recalculatePoints() {
        if(this.rowCount != 0) {
            this.pointCount += this.objCount * this.rowCount;
        } else {
            this.pointCount += this.objCount;
        }

        this.pointStat.textContent = parseInt(this.pointCount);
    }

    initPoints() {
        this.objCount = 0;
        this.rowCount = 0;
        this.pointCount = 0;
    }

    onGameOver() {
        const name = prompt("Játék vége, a pontszámod: " + this.pointCount + "\n\nKérlek add meg a neved a ranglétrához:", "Anon");
        
        if(name && (name.length > 0)){
            this.insertIntoLeaderBoard(name, this.pointCount);
        }
    }

    insertIntoLeaderBoard(name, point){

    }
    destroy() {
        document.removeEventListener('keydown', this.keyDown)
        window.removeEventListener('resize', this.resizeCanvas);
        emptyElement(this.playerContainer);
    }
}

export default PlayTetris;
