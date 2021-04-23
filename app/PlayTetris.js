import Application from "./Application.js";
import Player from "../components/Player.js";

class PlayTetris extends Application {

    constructor(props) {
        super(props);
        this.name = "Play";
    }

    init() {
        this.playerContainer = document.getElementById('canvas-container');
        this.playerContainer.style.width = '100%';
        this.playerContainer.style.height = '100%';

        this.player = new Player(
            {
                parent: this.playerContainer,
                columns: 10,
                rows: 30,
                backgroundColor: 'black',
                objects: [
                    {
                        color: "#00ff00",
                        matrix: [
                            [1, 1, 1],
                            [0, 1, 0],
                            [0, 0, 0],
                        ]
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
                        color: "#00ffff",
                        matrix: [
                            [1, 1, 0],
                            [0, 1, 0],
                            [0, 1, 0],
                        ]
                    },
                    {
                        color: "#ff00ff",
                        matrix: [
                            [0, 1, 0, 0],
                            [0, 1, 0, 0],
                            [0, 1, 0, 0],
                            [0, 1, 0, 0],
                        ]
                    },
                    {
                        color: "#ff0000",
                        matrix: [
                            [1, 1],
                            [1, 1],
                        ]
                    },
                ],
                onGameOver: () => console.log("Game Over"),
                onScoreChanged: (score) => console.log(score),
            }
        );

        this.player.start();

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


    destroy() {
        document.removeEventListener('keydown', this.keyDown)
        window.removeEventListener('resize', this.resizeCanvas);
        super.destroy();
    }

}

export default PlayTetris;

