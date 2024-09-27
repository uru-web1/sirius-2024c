export const AtomGroup = class extends Atom{
    static observedAttributes = ["caption"];

    constructor(props){
        super();  
        this.name = "AtomGroup";
        this.props = props;     
        this.built = ()=>{}; 
        this.attachShadow({mode:'open'});
    }

    #getTemplate(){
        return `
        <div class="AtomGroupContainer">
            <div class = "ContainerHead">
                <div class = "HeadLineInit"></div>
                <div class = "captionPanel"></div>
                <div class = "HeadLineEnd"></div>
            </div>
            <div class = "ElementContainer"></div>
        </div>
        `        
    }
        
    #getCss(){
        return `
            .AtomGroupContainer {
                display: grid;
                position:relative;
                background-color: rgba(0,0,0,0);
                border-style : solid;
                border-width : 1px;
                border-color: rgba(0,0,0,0.4);
                border-top : none;
                border-radius:1em;
                width : 450px;
                height : 300px;
                grid-template-rows: 0.05fr 1fr;
            }
            
            .ElementContainer{
                display:grid;
                background-color: rgba(0,0,0,0);
                over-flow:hidden;
                width:100%;
                height : 100%;
                item-align : left;
                justify-content : center;
                align-items : center;
            }

            .ContainerHead{
                display: flex;
                flex : 0.15 0.25 0.6;
                align-items: left;
                width: 100%;
                height : 100%;
                background-color : rgba(0,0,0,0);
            }

            .HeadLineInit{
                border-style : solid;
                border-width : 1px;
                border-color: rgba(0,0,0,0.4);
                border-left : none;
                border-right : none;
                border-bottom : none;
                border-top-left-radius:1em;
                position: relative;
                left:0px;
                height : 50%;
                width:10%;
            }

            .HeadLineEnd{
                border-style : solid;
                border-width : 1px;
                border-color: rgba(0,0,0,0.4);
                border-left : none;
                border-right : none;
                border-bottom : none;
                position: relative;
                left:0px;
                width:100%;
                height : 50%;
                border-top-right-radius:1em;
            }
            
            .captionPanel {
                display:flex;
                background-color : rgba(0,120,90,0.6);
                position : relative;
                font-size : 12px;
                font-family : Trebuchet MS;
                line-height : 14px;
                color : white;
                top : -12.5px;
                border-radius: 0.5em;
                align-items: center;
                justify-content: center;
                height:25px;
                width:100%;
            }  
            
            .Row{
                background-color : rgba(0,0,0,0);
                display: flex;
                position:relative;
                left:0px;
                width:100%;
            }
        `
    }
    
    async connectedCallback(){
        let sheet = new CSSStyleSheet();
        sheet.replaceSync(this.#getCss());
        this.shadowRoot.adoptedStyleSheets = [sheet];
        this.template = document.createElement('template');
        this.template.innerHTML = this.#getTemplate();
        let tpc = this.template.content.cloneNode(true);  
        this.mainElement = tpc.firstChild.nextSibling;
        this.containerHead = this.mainElement.firstChild.nextSibling;
        this.shadowRoot.appendChild(this.mainElement);
        this.headLineInit = this.containerHead.firstChild.nextSibling;
        this.divCaption = this.headLineInit.nextSibling.nextSibling;
        this.headLineEnd = this.divCaption.nextSibling.nextSibling;   
        this.bodyContainer = this.mainElement.firstChild.nextSibling.nextSibling.nextSibling;  
        for(let attr of this.getAttributeNames()){          
            if(attr.substring(0,2)!="on"){
                this.setAttribute(attr, this.getAttribute(attr));
                this[attr] = this.getAttribute(attr);
            }
            switch(attr){
                case 'id' : 
                    atom.createInstance('AtomGroup', {'id': this[attr]});
                    this.mainElement.id = this['id'];
                    break;
                case 'style': {
                    this.mainElement.style = this.getAttribute(attr);
                    this.style.width = '0px';
                    this.style.height = '0px';
                    this.style.left = '0px';
                    this.style.top = '0px';
                    break;
                }
            }
        }
        if(this.props){
            for(let attr in this.props){
                switch(attr){
                    case 'style' :
                        for(let attrcss in this.props.style){
                            this.mainElement.style[attrcss] = this.props.style[attrcss];
                        } 
                        break;
                    case 'events' : 
                        for(let attrevent in this.props.events){
                            this.mainElement.addEventListener(attrevent, this.props.events[attrevent], false)
                        }
                        break;
                    default : 
                        this.setAttribute(attr, this.props[attr]);
                        this[attr] = this.props[attr];
                        if(attr==='id'){
                            atom.createInstance('AtomGroup', {'id': this[attr]});
                            this.mainElement.id = this[attr];
                        }
                }
            }
        }
        this.builtEvents(),      
        this.built();
    }

    builtEvents(){
        this.mainElement.addEventListener('keyup', (ev)=>{
            ev.preventDefault(); if(ev.key === 'Enter'){
                if(this.checked)this.checked = false; else this.checked=true; 
                this.dispatchEvent(new CustomEvent("enter", {bubbles: true})); 
            };
        }, false);  
    }

    addToBody(){document.body.appendChild(this);}

    addRow(props){
        let layer = document.createElement('div');
        layer.className = 'Row';
        if(props){
            if(props.styleRow){
                for(let attr in props.styleRow){
                    layer.style[attr] = props.styleRow[attr];
                }
            }
        }
        
        props.elements.forEach(element => {
            layer.appendChild(element);
        });
        this.bodyContainer.appendChild(layer);
        return this;
    }
    get caption (){return this.radioElement.value}
    set caption(val){
        this.setAttribute('caption', val);
        this.divCaption.innerText = val;
        let t = val.length*12;
        this.divCaption.style.width = t+'px';
        this.dispatchEvent(new CustomEvent("changeCaption", {bubbles: true}));
    }
}

customElements.define('atom-group', AtomGroup);