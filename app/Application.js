import { emptyElement, addElement } from "../utils/DOMUtils.js";

/**
 * Base class for our applications.
 */
class Application {

    /**
     * Instantiates a new Application.
     */
    constructor(options) {
        const opts = options || {};

        // Egysoros komment
        this.name = 'App';

        if (typeof opts.target === 'string') {
            this.target = document.getElementById(opts.target);
        } else {
            this.target = opts.target;
        }

        if (typeof opts.statBar === 'string') {
            this.statBar = document.getElementById(opts.statBar);
        } else {
            this.statBar = opts.statBar;
        }
        
        for (let i in opts) {
            if(i !== 'statBar' && i !== 'target'){
                this[i] = opts[i];
            }
        }

        validate(this);

        this.loadTemplate();
    }

    init() {

    }

    loadTemplate(){
        const link = document.createElement('link');
        link.rel='stylesheet';
        link.type='text/css';
        link.href=`app/${this.constructor.name}.css`;
        document.head.appendChild(link);


        // load html template
        const xhr = new XMLHttpRequest();

        xhr.open('GET', `app/${this.constructor.name}.html`);

        xhr.addEventListener('load', function(evt){
            if(xhr.status === 200){
                this.target.innerHTML = xhr.responseText;
            }
            this.init();
        }.bind(this));

        xhr.addEventListener('error', function(evt){
            this.init();
        }.bind(this));

        xhr.send();
    }
    

    
    destroy() {
        // Remove CSS template
        const links = document.head.getElementsByTagName('link');

        for (let i = links.length-1; i >= 0 ; i--) {
            if(links[i].href.endsWith(`app/${this.constructor.name}.css`)){
                links[i].remove();
                break;
            }
        }

        emptyElement(this.target);
    }
}

function validate(app) {
    if (!(app.target instanceof HTMLElement)) {
        throw new Error('Target can only be a valid HTML element.');
    }

    if (app.statBar && !(app.target instanceof HTMLElement)) {
        throw new Error('Stat bar can only be a valid HTML element.');
    }
}

export default Application;
