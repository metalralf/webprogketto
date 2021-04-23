import Application from "./Application.js";
import Player from "../components/Player.js";

class PlayTetris extends Application {

    constructor(props) {
        super(props);
        this.name = "Play";
    }

    init() {
        this.columns = 10;
        this.rows = 20;
        this.initCanvas();

        this.player = new Player(
            {
                canvas: this.canvas,
                columns: this.columns,
                rows: this.rows,
                backgroundColor: 'black',
                objects: [
                    {
                        color: "#00ff00",
                        matrix: [[1, 1, 1], [0, 1, 0], [0, 0, 0]]
                    },
                    {
                        color: "#0000ff",
                        matrix: [
                            [0, 1, 1],
                            [0, 1, 0],
                            [0, 1, 0],
                        ]
                    },
                    {
                        color: "#ff0000",
                        matrix: [[1, 1], [1, 1],]
                    },
                ],
                onGameOver: () => console.log("Game Over"),
                onScoreChanged: (score) => console.log(score),
            }
        );

        this.player.start();

        this.resizeCanvas = function () {
            this.recalculateCanvasSize();
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

    initCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvasContainer = document.getElementById('canvas-container');
        this.canvasContainer.style.width = '100%';
        this.canvasContainer.style.height = '100%';
        this.canvasContainer.append(this.canvas);
        this.recalculateCanvasSize();
    }

    recalculateCanvasSize(){
        const containerAspectRatio = this.canvasContainer.clientWidth / this.canvasContainer.clientHeight;
        const canvasAspectRatio = this.columns / this.rows;

        //Magassághoz igazít
        if (canvasAspectRatio < containerAspectRatio) {
            this.canvas.width = this.canvasContainer.clientHeight * canvasAspectRatio;
            this.canvas.height = this.canvasContainer.clientHeight;
            this.canvas.style.marginTop = '0';
            this.canvas.style.marginLeft = (this.canvasContainer.clientWidth - this.canvas.width) / 2 + 'px';
            //Szélességhez igazít
        } else {
            this.canvas.width = this.canvasContainer.clientWidth;
            this.canvas.height = this.canvasContainer.clientWidth / canvasAspectRatio;
            this.canvas.style.marginTop = (this.canvasContainer.clientHeight - this.canvas.height) / 2 + 'px';
            this.canvas.style.marginLeft = '0';
        }
    }

    destroy() {
        document.removeEventListener('keydown', this.keyDown)
        window.removeEventListener('resize', this.resizeCanvas);
        super.destroy();
    }

}

export default PlayTetris;

