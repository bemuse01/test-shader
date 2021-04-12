APP.build = class{
    constructor(){
        this.#init()
        this.#create()
    }


    // init
    #init(){
        this.wrap = document.getElementById('wrap')

        const {width, height} = this.wrap.getBoundingClientRect()

        this.width = width
        this.height = height
    }


    // create
    #create(){
        const canvas = document.querySelector('#canvas')

        this.scene = new THREE.Scene()
    
        this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true, canvas: canvas})
        this.renderer.setSize(this.width, this.height)
        this.renderer.setPixelRatio(RATIO)
        this.renderer.setClearColor(0x000000)
        this.renderer.setClearAlpha(0.0)
    }


    // render
    animate(){
        this.#render()
    }
    #render(){
        this.renderer.setScissorTest(false)
        this.renderer.clear()
        this.renderer.setScissorTest(true)
    }


    // resize
    resize(){
        const {width, height} = this.wrap.getBoundingClientRect()

        this.width = width
        this.height = height

        this.renderer.setSize(this.width, this.height)
    }
}