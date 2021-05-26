import Player from "../components/Player.js";
import { emptyElement, addElement } from "../utils/DOMUtils.js";
import Objects from "../components/Objects.js";

class Editor {

    constructor() {
        this.appName = 'Editor';
        this.init();
    }

    init() {
        this.playerContainer = document.getElementById('content-frame');
        this.matrix = [];
        this.color = '#ff0000';
        if(this.playerContainer){
            this.destroy()
            const xhr = new XMLHttpRequest();

            xhr.open('GET', './js/app/Editor.html');

            xhr.addEventListener('load', function(evt){
                if(xhr.status === 200){
                    this.playerContainer.innerHTML = xhr.responseText;
                    const selectSize = document.getElementById('selectSize');
                    const coloringEditor = document.getElementById('itemColor');
                    const addBtn = document.getElementById('addBlock');
                    const printExistingBlocks = document.getElementById('blockList');
                    if(selectSize){
                        selectSize.addEventListener('change', () => {
                            this.matrix = [];
                            this.printEditor();
                        });
                    }
                    if(coloringEditor){
                        coloringEditor.addEventListener('change', () => {
                            this.coloringEditor();
                        });
                    }
                    if(addBtn){
                        addBtn.addEventListener('click', () => {
                            this.addBlock();
                        });
                    }
                    if(printExistingBlocks){
                        this.printExistingBlocks();
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
    deleteObject(object){
        const customObjects = localStorage.getItem('objects') ? JSON.parse(localStorage.getItem('objects')) : [];
        const result = customObjects.filter(obj => JSON.stringify(obj) != JSON.stringify(object));
        localStorage.setItem('objects', JSON.stringify(result));
        this.printExistingBlocks();
    }
    getSquare(isFilled, color){
        let square = document.createElement('div');
        if(isFilled == 0){
            square.classList.add('small-square');
        }else{
            square.classList.add('small-square');
            square.style.backgroundColor = color;
        }
        return square;
    }
    getLine(line, color){
        let squareLine = document.createElement('div');
        squareLine.classList.add('square-line');
        for(let i = 0; i < line.length; i++){
            squareLine.appendChild(this.getSquare(line[i], color));
        }
        return squareLine;
    }
    getBlock(object, deleteable){
        let block = document.createElement('div');
        block.classList.add('block');block.classList.add('d-flex');block.classList.add('align-center');block.classList.add('justify-content-center');block.classList.add('col-auto');
        if(deleteable){
            let emoji = document.createElement('div');
            emoji.classList.add('delete-emoji');
            emoji.innerText = '❌';
            emoji.addEventListener('click', () => this.deleteObject(object));
            block.appendChild(emoji);
        }
        let container = document.createElement('div');
        for(let i = 0; i < object.matrix.length; i++){
            container.appendChild(this.getLine(object.matrix[i], object.color));
        }
        block.appendChild(container);
        return block;
    }
    printExistingBlocks(){
        const e = document.getElementById('blockList');
        if(e){
            emptyElement(e);
            const objects = localStorage.getItem('objects') ? JSON.parse(localStorage.getItem('objects')) : [];
            for(let i = objects.length-1; i >= 0; i--){
                e.appendChild(this.getBlock(objects[i], true));
            }
            for(let i = 0; i < Objects.length; i++){
                e.appendChild(this.getBlock(Objects[i], false));
            }
        }
    }
    printEditor(){
        const e = document.getElementById('selectSize');
        const size = e.value;
        this.renderBox(size);
    }
    renderBox(size){
        const e = document.getElementById('shapeEditor');
        if(e){
            emptyElement(e);
            for(let i = 0; i < size; i++){
                this.matrix[i] = [];
                let line = document.createElement('div');
                line.classList.add('square-line');
                for(let j = 0; j < size; j++){
                    this.matrix[i][j] = 0;
                    let square = document.createElement('div');
                    square.id = `${i}_${j}`;
                    square.classList.add('square');
                    square.addEventListener('click', () => this.changeMatrix(i, j));
                    line.appendChild(square);
                }
                e.appendChild(line);
            }
        }
    }
    changeMatrix(i, j){
        const e = document.getElementById(`${i}_${j}`);
        if(e){
            if(this.matrix[i][j] == 0){
                this.matrix[i][j] = 1;
                e.className = 'square'
                e.style.backgroundColor = this.color;
            }else{
                this.matrix[i][j] = 0;
                e.className = 'square'
                e.style.backgroundColor = 'transparent';
            }
            const addBtn = document.getElementById('addBlock');
            if(this.checkNullMatrix()){
                addBtn.disabled = true;
            }else{
                addBtn.disabled = false;
            }
        }
    }
    checkNullMatrix(){
        for(let i = 0; i < this.matrix.length; i++){
            for(let j = 0; j < this.matrix.length; j++){
               if(this.matrix[i][j] == 1){
                   return false;
               }
            }
        }
        return true;
    }
    coloringEditor(){
        const e = document.getElementById("itemColor");
        this.color = e.value;
        element = document.getElementsByClassName('square');
        for(let i = 0; i < element.length; i++){
            element[i].style.backgroundColor = this.color;
        }
    }
    addBlock(){
        if(!this.isExistsMatrix()){
            const objects = localStorage.getItem('objects') ? JSON.parse(localStorage.getItem('objects')) : [];
            objects.push({color: this.color, matrix: this.matrix});
            localStorage.setItem('objects', JSON.stringify(objects));
            this.printExistingBlocks();
            alert('Ez az elem felkerült a listára!');
        }else{
            alert('Ez az elem már létezik!');
        }
    }
    isExistsMatrix(){
        for(let i = 0; i < Objects.length; i++){
            if(JSON.stringify(Objects[i].matrix) === JSON.stringify(this.matrix)){
                return true;
            }
        }
        const customObjects = localStorage.getItem('objects') ? JSON.parse(localStorage.getItem('objects')) : [];
        for(let i = 0; i < customObjects.length; i++){
            if(JSON.stringify(customObjects[i].matrix) === JSON.stringify(this.matrix)){
                return true;
            }
        }
        return false;
    }
    destroy() {
        emptyElement(this.playerContainer);
    }
}

export default Editor;
