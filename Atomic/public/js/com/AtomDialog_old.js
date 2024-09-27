export const AtomDialog = class extends Atom{

    constructor(props){
        super();  
        this.name = "AtomDialog";
        this._title = "";
        if(props){
            this.props = props;  
            if(props.id) this.id = props.id;
        }
        this.built = ()=>{}; 
        this.closeButton = document.createElement('div');
        this.attachShadow({mode:'open'});
        this._showclosebutton = true;
        this._centerScreen = false;
        this.actualOpacity = 1;
        this.clickPressed = false;
        this._draggable = false;
        this._modal = false;
        this.my = 0;
        this.mxini = 0;
        this.myini = 0;
        this.px = 0;
        this.py = 0;
        this.actZIdx = 0;
    }

    #getTemplate(){
        return `
            <dialog class='AtomDialog'>
                <div class = 'DivCloseButton'></div>
                <div class = 'Title'></div>
                <div class = 'BodyDialog'><slot name="bodyDialogSlot"></slot></div>
                <div class='Footer'><slot name="footerDialogSlot"></slot></div>
            </dialog>
        `        
    }
        
    #getCss(){
        return `.AtomDialog{
            display : grid;
            position:absolute;
            left:0px;
            top:0px;
            background-color:white;
            border-style:solid;
            border-color:rgba(100,100,100,0.5);
            border-width:1px;
            // width:650px;
            // height:500px;
            border-radius : 1em;
            box-shadow : 4px 4px 5px -2px rgba(33,33,33,0.5);
            grid-template-rows:0.05fr 0.15fr 0.8fr 0.1fr;
            overflow : hidden;
            resize:both;
            gap:2px;

            animation-name: show;
            animation-duration: 2s; 
            // animation-timing-function: ease-out; 
            animation-delay: 0s;
            // animation-direction: alternate;
            // animation-iteration-count: infinite;
            animation-fill-mode: none;
            // animation-play-state: running; 
        }
        .CloseButton{
            display:flex;
            font-size : 17px;
            color: black;
            font-family : Trebuchet MS;
            font-weight: bold;
            align-items : center;
            justify-content:center;
            padding : 3px;
            border-width : 0px;
        }
        .CloseButton:hover{
            cursor : pointer;
        }
        .DivCloseButton{
            display:flex;
            align-items : right;
            justify-content:right;
            width:100%;
            height:100%;
            // overflow : hidden;
            border-width : 0px;
        }
        .Title{
            display:flex;
            height : 100%;
            width : 100%;
            align-items:top;
            justify-content:center;
            font-family : Trebuchet MS;
            font-size : 20px;
            color : black;
            padding-bottom:5px;
            background-color : rgba(0,0,0,0);
            border-width : 0px;
        }
        .BodyDialog{
            display : grid;
            height : 100%;
            background-color : rgba(0,0,0,0);
            border-width : 0px;
        }
        .row{
            display : flex;
            background-color : rgba(0,0,0,0);;
            border-width : 0px;
            width : 100%;
            position : relative;
        }
        .Footer{
            display : flex;
            height:100%;
            background-color : rgba(0,0,0,0);
            border-width : 0px;
        }
        @keyframes show {
            from {
                opacity : 0%;
            }

            to {
                opacity : 100%;
            }
        } 
        `
    }

    #checkAttributes(){
        for(let attr of this.getAttributeNames()){          
            if(attr.substring(0,2)!="on"){
                this.mainElement.setAttribute(attr, this.getAttribute(attr));
                this[attr] = this.getAttribute(attr);
            }
            switch(attr){
                case 'id' : 
                    atom.createInstance('AtomDialog', {'id': this[attr]});
                    break;
            }
        }
    }

    #checkProps(){
        if(this.props){
            for(let attr in this.props){
                switch(attr){
                    case 'style' :
                        this.setPosition(0,0);
                        for(let attrcss in this.props.style) this.mainElement.style[attrcss] = this.props.style[attrcss];
                        break;
                    case 'events' : 
                        for(let attrevent in this.props.events){this.mainElement.addEventListener(attrevent, this.props.events[attrevent])}
                        break;
                    default : 
                        this.setAttribute(attr, this.props[attr]);
                        this[attr] = this.props[attr];
                        if(attr==='id')atom.createInstance('AtomDialog', {'id': this[attr]});
                }
            }
        };
    }

    #render(){
        let sheet = new CSSStyleSheet();
        sheet.replaceSync(this.#getCss());
        this.shadowRoot.adoptedStyleSheets = [sheet];
        this.template = document.createElement('template');
        this.template.innerHTML = this.#getTemplate();
        let tpc = this.template.content.cloneNode(true);  
        this.mainElement = tpc.firstChild.nextSibling;
        this.divButtonClose = this.mainElement.firstChild.nextSibling;
        this.titleDialog = this.divButtonClose.nextSibling.nextSibling;
        this.bodyDialog = this.titleDialog.nextSibling.nextSibling;
        this.footerDialog = this.bodyDialog.nextSibling.nextSibling
        this.shadowRoot.appendChild(this.mainElement);  
        this.mainElement.id = this.id;
        this.mainElement.pointerEvents = 'none';

    }
    
    connectedCallback(){
        this.#render();
        this.#checkAttributes();
        this.#checkProps();
        this.#events();
        this.built();
    }

    sendToFrom(){
        this.style.zIndex = this.actZIdx;
        this.style.opacity = this.actualOpacity;
        return this;
    }

    sendToBack(){
        this.actZIdx--;
        this.style.zIndex = this.actZIdx;
        this.style.opacity = this.actualOpacity;
        return this;
    }

    showModal(){ 
        this.mainElement.showModal();
        this.open = true;
        return this;
    }

    show(){
        super.show();
        this.open = true;
        return this;
    }

    hide(){
        super.hide();
        this.mainElement.close();
        this.open = false;
        return this;
    }

    #events(){
        let setCursor = (element,typeCursor)=>{
            if (this._draggable && !this.clickPressed) {
                element.style.cursor = typeCursor;
            }
        }

        let pointerDown = (element, e)=>{
            this.actZIdx = this.getMaxZIndex();
            element.style.zIndex = this.actZIdx;
            this.sendToFrom();
            if (this._draggable) {
                element.style.cursor = "grabbing";
                this.getMouseXY(e);
                this.mxini = this.mx;
                this.myini = this.my;
                this.clickPressed = true;
                this.actualOpacity = this.style.opacity;
                this.style.opacity = 0.5;
            }
        }

        this.ondragstart = ()=> {return false;};
        this.mainElement.ondragstart = ()=> {return false;};
        this.mainElement.ondragstart = ()=> {return false;};
        this.divButtonClose.ondragstart = ()=> {return false;};
        this.titleDialog.ondragstart = ()=> {return false;};
        this.divButtonClose.addEventListener("pointerover",(e) => {
            setCursor(this.divButtonClose,"move");
        },false);

        this.titleDialog.addEventListener('pointerover', (e)=>{
            setCursor(this.titleDialog,"move");
        });
        
        this.divButtonClose.addEventListener("pointerdown",(e) => {
            pointerDown(this.divButtonClose, e);
        },false);        

        this.titleDialog.addEventListener("pointerdown",(e) => {
            pointerDown(this.titleDialog, e);
        },false);  

        this.closeButton.addEventListener("click",(e) => { 
            this.hide();       
        },false); 
        
        document.addEventListener("pointerup",(e) => {
            this.clickPressed = false;
            this.style.opacity = this.actualOpacity;
            setCursor(this.divButtonClose,"default");
        },false);        
        
        document.addEventListener("pointermove",(e) => {
            if (this.clickPressed) {
                this.mainElement.style.zIndex = this.actZIdx;
                let dx = this.mx - this.mxini;
                let dy = this.my - this.myini;
                this.px = this.getBoundingClientRect().left;
                this.py = this.getBoundingClientRect().top;
                if (this._draggable) {
                    this.px = this.px + dx;
                    this.py = this.py + dy;
                    this.setPosition(this.px+'px', this.py+'px');
                    this.mxini = this.mx;
                    this.myini = this.my;
                    this.getMouseXY(e);
                }
            }
        },false);
    }

    addToBody(){document.body.appendChild(this);}

    /**
     * @description Este método ubica al dialogo en la posicion indicada por x e y
     * @param {string} x - es la coortdenada x que indica la posición horizontal (left)
     * @param {string} y - es la coortdenada y que indica la posición vertical (top)
     * @return {object} - retorna la instancia de este objeto
    */
    setPosition(x, y) {
        this.style.position = "absolute";
        this.style.left = x;
        this.style.top = y;
        return this;
    }

    /**
     * @description Este método obtiene las coordenadas actuales del raton y las graba eb mx y my
     * @param {object} e - es el objeto del evento
     * @return {object} - retorna este objeto.
    */
    getMouseXY(e) {
        this.mx = e.clientX;
        this.my = e.clientY;
        return this;
    }

    #add(target, objElement){
        let row = document.createElement('div');
        row.className = "row";
        for(let attr in objElement){
            switch(attr){
                case 'elements' : {
                    objElement.elements.forEach(element => {
                        row.appendChild(element);
                    });
                    break;
                }
                case 'style' : {
                    for(let attr in objElement.style){
                        row.style[attr] = objElement.style[attr];
                    }
                    break;
                }
            }
        }
        target.appendChild(row);
    }

    addRowBody(objElement){
        this.#add(this.bodyDialog, objElement);
        return this;
    }

    addRowFooter(objElement){
        this.#add(this.footerDialog, objElement);
        return this;
    }

    addXY(x,y,element){
        element.style.position = 'absolute';
        element.style.left = x;
        element.style.top = y;
        this.mainElement.appendChild(element);
        return this;
    }
  
    get title(){return this._title}
    set title(val){
        this._title = val;
        this.titleDialog.innerText = val;
    }
    get showclosebutton() { return this._showclosebutton;}
    set showclosebutton(val){
        this._showclosebutton=val;
        if(val){
            this.closeButton.innerText = "X";
            this.divButtonClose.appendChild(this.closeButton);
            this.divButtonClose.setAttribute('innerText', "X");
        }            
        else {
            this.divButtonClose.innerText = "";
            this.divButtonClose.setAttribute('innerText', "");
        }
        this.closeButton.className = "CloseButton";
    }
    get centerscreen(){return this._centerScreen}
    set centerscreen(val){
        this._centerScreen = val;
        if(val){
            this.style.position = 'absolute';
            this.style.left = '0px';
            this.style.top = '0px';  
            let cx = parseInt((window.innerWidth)/2,10);
            let cy = parseInt((window.innerHeight)/2,10);
            this.mainElement.style.position = "absolute";
            this.mainElement.style.left = cx+"px";
            this.mainElement.style.top = cy+"px";
            this.mainElement.style.transform = `translate(-50%,-50%)`;        

        }
    }
    /**
    * @property {string} draggable Si es "true" permite arrastrar y soltar el diálogo, en "false" no lo permite, por defecto es "true"
    */
    get draggable(){return this._draggable;}
    set draggable(val){
        this._draggable = val;
        this.setAttribute('draggable', val);
    }

    get modal(){return this._modal;}
    set modal(val){ 
        this._modal = val;
        if(this._modal) this.showModal();
        this.setAttribute('modal', val);
    }

    get open(){return this.mainElement.open;}
    set open(val){
        this.mainElement.open = val;
        this.setAttribute('open', val);
    }
}

customElements.define('atom-dialog', AtomDialog);