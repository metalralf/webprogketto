import Application from "./Application.js";
import Player from "../components/Player.js";

class PlayTetris extends Application {

    constructor(props) {
        super(props);
        this.name = "Play";
    }

    init() {
        this.canvas =  document.getElementById('canvas');

        /*

        A player egy canvas-t vár amire kirajzolhat

         */

        let player = new Player(
            {
                canvas: this.canvas,
                columns: 10,
                rows: 20,
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
            }
        );

        this.canvas.focus();
        this.canvas.focus();
        this.canvas.click();
        player.start();

        this.keyDown = function (event) {
            if (event.keyCode === 32) {
                if (player.isRunning()) {
                    player.rotate();
                } else {
                    player.start();
                }
            }

            switch (event.keyCode) {
                case 38:
                    // player.rotate();
                    break;
                case 40:
                    player.moveDown();
                    break; //down
                case 39:
                    player.moveRight();
                    break; //right
                case 37:
                    player.moveLeft();
                    break; //left
            }
        }.bind(this);

        document.addEventListener('keydown', this.keyDown);
    }

    destroy() {
        document.removeEventListener('keydown', this.keyDown)
        super.destroy();
    }

}

export default PlayTetris;

