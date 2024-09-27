export const AtomCheck = class extends Atom{
    static observedAttributes = ["caption"];

    constructor(props){
        super();  
        this.name = "AtomCheck";
        this.props = props;     
        this.built = ()=>{}; 
        this.attachShadow({mode:'open'});
    }

    #getTemplate(){
        return `
        <label class="AtomCheck">
            <input type="checkbox">
            <span class="checkmark"></span>
            <label class="caption"></label>
        </label>
        `        
    }
        
    #getCss(){
        return `.AtomCheck {
            appearance: none;
            display: block;
            position: absolute;
            padding-left: 30px;
            cursor: pointer;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
          }

          .caption{
            font-size : 14px;
            font-family : Segoe UI;
            color : black;
          }
          
          .AtomCheck input {
            position: absolute;
            opacity: 0;
            cursor: pointer;
            height: 0;
            width: 0;
          }
          
          .checkmark {
            position: absolute;
            top: 0;
            left: 0;
            height: 16px;
            width: 16px;
            background-color: rgba(0,0,0,0);
            border-style : solid;
            border-width : 1px;
            border-color: rgba(0,0,0,0.3);
            border-radius : 0.3em;
          }
          
          .AtomCheck:hover input ~ .checkmark {
            border-style : solid;
            border-width : 1px;
            border-color: darkorange;
            background-color: #ccc;
          }
          
          .AtomCheck input:checked ~ .checkmark {
            border-style : solid;
            border-width : 1px;
            border-color:  rgba(0,150,160,1);
            background-color: rgba(0,150,160,1);
          }

          .AtomCheck input:focus ~ .checkmark {
            border-style : solid;
            border-width : 1px;
            border-color: darkorange;
          }
          
          .checkmark:after {
            content: "";
            position: absolute;
            display: none;
          }
          
          .AtomCheck input:checked ~ .checkmark:after {
            display: block;
          }          
          
          .AtomCheck .checkmark:after {
            left: 4px;
            top: 0px;
            width: 5px;
            height: 9px;
            border: solid white;
            border-width: 0 3px 3px 0;
            -webkit-transform: rotate(45deg);
            -ms-transform: rotate(45deg);
            transform: rotate(45deg);
            animation-name:rising;
            animation-duration: 0.5s; 
            animation-timing-function: ease-out; 
            animation-delay: 0s;
            animation-direction: alternate;
          }

          @keyframes rising {
            from {opacity: 0;}
            to {opacity: 1;}
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
        this.checkElement = this.mainElement.firstChild.nextSibling;
        this.labelElement = this.mainElement.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling;
        this.shadowRoot.appendChild(this.mainElement);        
        for(let attr of this.getAttributeNames()){          
            if(attr.substring(0,2)!="on"){
                this.setAttribute(attr, this.getAttribute(attr));
                this[attr] = this.getAttribute(attr);
            }
            switch(attr){
                case 'id' : 
                    atom.createInstance('AtomCheck', {'id': this[attr]});
                    this.mainElement.id = this[attr];
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
                        for(let attrevent in this.props.events){this.mainElement.addEventListener(attrevent, this.props.events[attrevent], false)}
                        break;
                    default : 
                        this.setAttribute(attr, this.props[attr]);
                        this[attr] = this.props[attr];
                        if(attr==='id'){
                            atom.createInstance('AtomCheck', {'id': this[attr]});
                            this.mainElement.id = this[attr];
                        }
                }
            }
        }
        this.builtEvents(),        
        this.built();
    }

    builtEvents(){
        this.checkElement.addEventListener('keyup', (ev)=>{
            ev.preventDefault(); if(ev.key === 'Enter'){
                if(this.checked)this.checked = false; else this.checked=true; 
                this.dispatchEvent(new CustomEvent("enter", {bubbles: true})); 
            };
        }, false);  
    }

    addToBody(){document.body.appendChild(this);}
    get caption (){return this.mainElement.innerText}
    set caption(val){
        this.setAttribute('caption', val);
        this.labelElement.innerText = val;
        this.dispatchEvent(new CustomEvent("changeCaption", {bubbles: true}));
    }
    get checked (){return this.checkElement.checked}
    set checked (val){this.checkElement.checked = val}
    get disabled (){return this.checkElement.disabled}
    set disabled(val){
        this.setAttribute('disabled', val);
        this.checkElement.disabled = val;    
    }
}

customElements.define('atom-check', AtomCheck);