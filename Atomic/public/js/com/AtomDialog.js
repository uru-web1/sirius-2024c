
export const AtomDialog = class extends Atom{

    constructor(props){
        super();  
        this.name = "AtomDialog";
        this._title = "";
        if(props){
            this.props = props;  
            if(props.id) this.id = props.id;
        }
        this._modal = false;
        this.built = ()=>{}; 
        this.closeButton = document.createElement('div');
        this.attachShadow({mode:'open'});
        this._showclosebutton = true;
        this._centerScreen = false;
        this.actualOpacity = 1;
        this.clickPressed = false;
        this._draggable = false;
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

    async #getCss(){ 
        return await atom.getCssFile("../js/css/","AtomDialog");
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
        if(this.props===undefined){
            this.mainElement.style.width = parseInt(window.getComputedStyle(this.mainElement).width, 10);
            this.mainElement.style.height = parseInt(window.getComputedStyle(this.mainElement).height, 10);
            let px = window.getComputedStyle(this).left;
            let py = window.getComputedStyle(this).top;
            this.setPosition(px,py);  
        } 
    }

    #checkProps(){
        if(this.props){
            for(let attr in this.props){
                switch(attr){
                    case 'style' :
                        for(let attrcss in this.props.style) {
                            switch(attrcss){
                                case "width" :
                                    this.mainElement.style.width = this.props.style[attrcss];
                                    break;
                                case "height" :
                                    this.mainElement.style.height = this.props.style[attrcss];
                                    break;
                            }
                            this.mainElement.style[attrcss] = this.props.style[attrcss];
                        }
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

     #render(css){   
        this.template = document.createElement('template');
        this.template.innerHTML = this.#getTemplate();
        let sheet = new CSSStyleSheet();
        sheet.replaceSync(css);
        this.shadowRoot.adoptedStyleSheets = [sheet];
        let tpc = this.template.content.cloneNode(true);  
        this.mainElement = tpc.firstChild.nextSibling;
        this.divButtonClose = this.mainElement.firstChild.nextSibling;
        this.titleDialog = this.divButtonClose.nextSibling.nextSibling;
        this.bodyDialog = this.titleDialog.nextSibling.nextSibling;
        this.footerDialog = this.bodyDialog.nextSibling.nextSibling;
        this.shadowRoot.appendChild(this.mainElement);  
        this.mainElement.id = this.id;
        this.mainElement.pointerEvents = 'none';
    }
    
    async connectedCallback(){
        let css = await this.#getCss()
        this.#render(css);
        this.#checkAttributes();
        this.#checkProps();
        this.#events();
        this.style.width = "0px";
        this.style.height = "0px";
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
        }, false);
        
        this.divButtonClose.addEventListener("pointerdown",(e) => {
            e.preventDefault();
            pointerDown(this.divButtonClose, e);
        },false);        

        this.titleDialog.addEventListener("pointerdown",(e) => {
            e.preventDefault();
            pointerDown(this.titleDialog, e);
        },false);  

        this.closeButton.addEventListener("pointerdown",(e) => {   
            e.preventDefault();       
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

    hide(){
        this.mainElement.style.animationName = "hide";
        setTimeout(()=> {super.hide()}, 600);
        this.mainElement.close();
    }

    show(){
        super.show();
        this.mainElement.style.animationName = "show";
    }

    get modal(){return this._modal}
    set modal(val){
        this._modal = val;
        if(val) this.mainElement.showModal();
        else this.show();
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
            this.mainElement.style.position = 'absolute';
            this.mainElement.style.left = "0px";
            this.mainElement.style.top = "0px";
            let cx = parseInt((window.innerWidth)/2,10);
            let cy = parseInt((window.innerHeight)/2,10);
            this.mainElement.style.width = parseInt(window.getComputedStyle(this.mainElement).width, 10);
            this.mainElement.style.height = parseInt(window.getComputedStyle(this.mainElement).height, 10);
            this.mainElement.style.left = cx+"px";
            this.mainElement.style.top = cy+"px";
            this.mainElement.style.transform = `translate(-50%,-50%)`;
            if(this.props){this.setPosition(0,0);}
            else{
                this.style.width = parseInt(window.getComputedStyle(this.mainElement).width, 10);
                this.style.height = parseInt(window.getComputedStyle(this.mainElement).height, 10);
                this.setPosition(cx/2,cy/2);  
                this.style.transform = `translate(-50%,-50%)`;
            }
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
}

customElements.define('atom-dialog', AtomDialog);