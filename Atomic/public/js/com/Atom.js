export const Atom = class extends HTMLElement{
    constructor(props){
        super();
        this.modules = new Map();
        this.instances = new Map();
        this.mapcallbackids = new Map();
        this._callBack = ()=>{};
        this.allBuilt = ()=>{};
        if(props) this.props = props;
        this.actZIndex = 0;
        this.cssFiles = new Map();
    }

    async getCssFile(path, fileName) {
        if(!this.cssFiles.has(fileName)){
            let css = await fetch(path+fileName+".css").then((response) => response.text());
            if(!this.cssFiles.has(fileName)) {this.cssFiles.set(fileName, css);};
            return css;
        }
        else{
            return this.cssFiles.get(fileName);
        }
    }

    getMaxZIndex(){
        atom.actZIdx++;
        return atom.actZIdx;
    }

    setCallBackBuilt(extFunct){
        this.callBack = extFunct;
        return this;
    }
    
    getInstance(id){
        if(this.instances.has(id)){ return this.instances.get(id) }
        else {
            let e = document.getElementById(id);
            if(e) return e; 
            else return null;
        }
    }

    async getClass(className){
        if(!this.modules.has(className)){
            let clase = await import('./'+className+'.js');
            this.modules.set(className, clase[className]); 
        }
        return  this.modules.get(className);
    }

    notifyBuilt(id){
        if(this.mapcallbackids.has(id)){ 
            this.mapcallbackids.delete(id)  
            if(this.mapcallbackids.size===0) this._callBack();
        }
        return this;
    }

    addHTMLInstance(obj){
        if(!this.instances.has(obj.id)){
            this.instances.set(obj.id, obj);
        }
        return this;
    }

    hide(){this.hidden = true;}
    show(){this.hidden = false;}

    // hide(){ 
    //     this.style.display = 'none'; 
    //     return this; 
    // }

    // show(display){ 
    //     if(!display) display = 'flex';
    //     this.style.display = display; 
    //     return this; 
    // }

    async createInstance(className, props){
        try{
            if(!this.instances.has(props.id)){
                props.notify = false;
                let newClass = await this.getClass(className);
                let i = new newClass(props);
                this.instances.set(props.id, i);
                return i;
            }
            else{return this.instances.get(props.id)}
        }
        catch(e){
            console.log('No se pudo crear la instancia');
            return null;
        }   
    } 
    set callback(val){this._callBack = val}
    get callback (){ return this.callback}
    get callbackids () {return this.mapcallbackids}
    set callbackids(arr){ for(let id of arr){this.mapcallbackids.set(id,{}); };
    }
}
customElements.define('x-atom', Atom);
window.Atom = Atom;
window.atom = new Atom();
atom.actZIdx = 0;

atom.react=()=>{
    for(let attr in atom){
        if(atom[attr]){
            if(atom[attr].value || atom[attr].equation) {
                if(atom[attr]._equation) {
                    atom[attr]._value = eval(atom[attr].equation.toString());
                };
            }
        }
    }
}

window.Any = class{
    static observedAttributes = ["equation", "value"];
    constructor(val){
        if(val)this._value = val;else this.value=null;
        this._equation =null;
    }
    get value(){return this._value}
    set value(val){this._value = val; this.react();}
    get equation(){return this._equation}
    set equation(val){this._equation = val; this.react();}
    react(){atom.react()}
}

window.Integer = class extends Any{
    constructor(val){super(val);}
    parse(val){this._value = val; return parseInt(this._value, 10)}
}

window.Float = class extends Any{
    constructor(val){super(val);super.add(this);}
    parse(val){this._value = val; return parseFloat(this._value)}
}

addEventListener("DOMContentLoaded", () => {
    if(atomInit) atomInit()
});
