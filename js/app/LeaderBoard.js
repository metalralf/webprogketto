import Player from "../components/Player.js";
import { emptyElement, addElement } from "../utils/DOMUtils.js";
import Objects from "../components/Objects.js";

class LeaderBoard {

    constructor() {
        this.appName = 'Editor';
        this.init();
    }

    init() {
        this.playerContainer = document.getElementById('content-frame');
        if(this.playerContainer){
            this.destroy()
            const xhr = new XMLHttpRequest();

            xhr.open('GET', './js/app/LeaderBoard.html');

            xhr.addEventListener('load', function(evt){
                if(xhr.status === 200){
                    this.playerContainer.innerHTML = xhr.responseText;
                    const printBoard = document.getElementById('leaderBoard');
                    if(printBoard){
                        this.printScores();
                    }
                }
            }.bind(this));

            xhr.addEventListener('error', function(evt){
            }.bind(this));

            xhr.send();
        }        
    }

    newGame() {
        if(this.player && !this.player.isStarted){
            this.initPoints();
            this.player.start();
        }
    }
    getSortedScores(){
        const scores = localStorage.getItem('scores') ? JSON.parse(localStorage.getItem('scores')) : [];
        scores.sort((a,b) => (a.point < b.point) ? 1 : ((b.point < a.point) ? -1 : 0));
        return scores;
    }
    printScores(){
        const scores = this.getSortedScores();
        const e = document.getElementById('tableBody');
        if(e){
            emptyElement(e);
            for(let i = 0; i < scores.length; i++){
                const tr = document.createElement('tr');
                const th = document.createElement('th');
                th.scope = 'row';
                th.innerText = i+1;
                tr.appendChild(th);
                const tdName =  document.createElement('td');
                tdName.innerText = scores[i].name;
                tr.appendChild(tdName);
                const tdPoint =  document.createElement('td');
                tdPoint.innerText = scores[i].point;
                tr.appendChild(tdPoint);
                e.appendChild(tr);
            }
        }
    }
    destroy() {
        emptyElement(this.playerContainer);
    }
}

export default LeaderBoard;
