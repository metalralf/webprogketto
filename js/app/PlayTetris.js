import Player from "../components/Player.js";
import { emptyElement, addElement } from "../utils/DOMUtils.js";
import Objects from "../components/Objects.js";

class PlayTetris {

    constructor() {
        this.appName = 'Game';
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
            const mergedObjects = this.mergeObjects();
            this.player = new Player(
                {
                    parent: this.playerContainer,
                    columns: 15,
                    rows: 30,
                    backgroundColor: 'black',
                    objects: mergedObjects,
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
            this.player.stopPlayer();
            this.player.restart();
        }
    }

    pauseGame() {
        if(this.player && this.player.isStarted){
            this.player.stopPlayer();
        }
    }

    continueGame(){
        if(this.player && !this.player.isRunning() && this.player.isStarted){
            this.player.start();
        }
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
        this.pointCount += this.objCount * (this.rowCount + 1);
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
        const scores = localStorage.getItem('scores') ? JSON.parse(localStorage.getItem('scores')) : [];
        scores.push({name: name, point: point});
        localStorage.setItem('scores', JSON.stringify(scores));
    }

    mergeObjects() {
        const customObjects = JSON.parse(localStorage.getItem('objects')) ? JSON.parse(localStorage.getItem('objects')) : {};
        const mergedObjects = [];
        if(customObjects.length){
            customObjects.forEach(element => {
                mergedObjects.push(element);
            });
        }
        if(Objects.length){
            Objects.forEach(element => {
                mergedObjects.push(element);
            });
        }

        return mergedObjects;
    }

    destroy() {
        document.removeEventListener('keydown', this.keyDown)
        window.removeEventListener('resize', this.resizeCanvas);
        this.player.destroy();
        this.player = null;
        emptyElement(this.playerContainer);
    }
}

export default PlayTetris;
