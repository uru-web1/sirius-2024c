// import {Atom} from "../com/Atom.js";
export const AtomButton = class extends Atom{
    static observedAttributes = ["caption"];

    constructor(props){
        super();  
        this.name = "AtomButton";
        this.props = props;     
        this.built = ()=>{}; 
        this.attachShadow({mode:'open'});
    }

    #getTemplate(){
        return `
            <button class='AtomButton'></button>
        `        
    }
        
    #getCss(){
        return `.AtomButton{
            display : flex;
            height : 50px;
            padding : 15px;
            line-height: 50px;
            background-color : rgb(8, 143, 136);
            color : white;
            font-family : Trebuchet MS;
            font-size : 16px;
            align-items : center;
            justify-content : center;
            border : 0px;
            border-radius: 1em;
            transition: 0.1s box-shadow;
        }
        
        .AtomButton:active {
            transform: scale(0.98);
            box-shadow: 3px 2px 22px 1px rgba(0, 0, 0, 0.24);
            background-color: rgba(7, 102, 75, 0.911);
        }
        
        .AtomButton:enabled:hover {
            transition: all 0.2s ease-in-out;
            box-shadow: 3px 2px 22px 1px rgba(0, 0, 0, 0.24);
            color : orange;
            cursor:pointer;
        }
        .AtomButton:disabled{opacity : 0.3;}
        .AtomButton:enabled{opacity : 1;}
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
        this.shadowRoot.appendChild(this.mainElement);        
        for(let attr of this.getAttributeNames()){          
            if(attr.substring(0,2)!="on"){
                this.mainElement.setAttribute(attr, this.getAttribute(attr));
                this[attr] = this.getAttribute(attr);
            }
            switch(attr){
                case 'id' : 
                    atom.createInstance('AtomButton', {'id': this[attr]});
                    break;
            }
        }
        if(this.props){
            for(let attr in this.props){
                switch(attr){
                    case 'style' :
                        for(let attrcss in this.props.style) this.mainElement.style[attrcss] = this.props.style[attrcss];
                        break;
                    case 'events' : 
                        for(let attrevent in this.props.events){this.mainElement.addEventListener(attrevent, this.props.events[attrevent])}
                        break;
                    default : 
                        this.setAttribute(attr, this.props[attr]);
                        this[attr] = this.props[attr];
                        if(attr==='id')atom.createInstance('AtomButton', {'id': this[attr]});
                }
            }
        }
        this.built();
    }

    addToBody(){document.body.appendChild(this);}
    get caption (){return this.mainElement.innerText}
    set caption(val){
        this.setAttribute('caption', val);
        this.mainElement.innerText = val;
        this.dispatchEvent(new CustomEvent("changeCaption", {bubbles: true}));
    }
    get disabled (){return this.mainElement.disabled}
    set disabled(val){
        this.setAttribute('disabled', val);
        this.mainElement.disabled = val;    
    }
}

customElements.define('atom-button', AtomButton);