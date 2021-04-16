SHAPE.build = class{
    constructor(app){
        this.#init()
        this.#create(app)
        this.#add()
    }


    // init
    #init(){
        this.param = new SHAPE.param()

        this.#initGroup()
        this.#initRenderObject()
    }
    #initGroup(){
        this.group = {
            circle: new THREE.Group(),
            plane: new THREE.Group(),
            plane2: new THREE.Group(),
            plane3: new THREE.Group()
        }

        this.build = new THREE.Group
    }
    #initRenderObject(){
        this.element = document.querySelector('.shape-object')

        const {width, height} = this.element.getBoundingClientRect()

        this.scene = new THREE.Scene()

        this.camera = new THREE.PerspectiveCamera(this.param.fov, width / height, this.param.near, this.param.far)
        this.camera.position.z = this.param.pos
        
        this.size = {
            el: {
                w: width,
                h: height
            },
            obj: {
                w: METHOD.getVisibleWidth(this.camera, 0),
                h: METHOD.getVisibleHeight(this.camera, 0)
            }
        }
    }
    #initComputeRenderer({renderer}){
    }


    // add
    #add(){
        for(let i in this.group) this.build.add(this.group[i])
        
        this.scene.add(this.build)
    }


    // create
    #create({renderer}){
        
        // this.#createCircle()
        this.#createPlane(renderer)
        // this.#createPlane2(renderer)
        // this.#createPlane3(renderer)
    }
    #createCircle(){
        new SHAPE.circle.build(this.group.circle)
    }
    #createPlane(renderer){
        this.plane = new SHAPE.plane.build(this.group.plane, this.size, renderer)
    }
    #createPlane2(renderer){
        this.plane2 = new SHAPE.plane2.build(this.group.plane2, this.size, renderer)
    }
    #createPlane3(renderer){
        this.plane3 = new SHAPE.plane3.build(this.group.plane3, this.size, renderer)
    }
    


    // animate
    animate({app}){
        this.#render(app)
        this.#animateObject()
    }
    #render(app){
        const rect = this.element.getBoundingClientRect()
        const width = rect.right - rect.left
        const height = rect.bottom - rect.top
        const left = rect.left
        const bottom = app.renderer.domElement.clientHeight - rect.bottom

        app.renderer.setViewport(left, bottom, width, height)
        app.renderer.setScissor(left, bottom, width, height)

        this.camera.lookAt(this.scene.position)
        app.renderer.render(this.scene, this.camera)

    }
    #animateObject(){
        // this.circle.animate()
        this.plane.animate()
        // this.plane2.animate()
        // this.plane3.animate()
    }


    // resize
    resize({app}){
        const rect = this.element.getBoundingClientRect()
        const width = rect.right - rect.left
        const height = rect.bottom - rect.top

        this.camera.aspect = width / height
        this.camera.updateProjectionMatrix()

        this.size = {
            el: {
                w: width,
                h: height
            },
            obj: {
                w: METHOD.getVisibleWidth(this.camera, 0),
                h: METHOD.getVisibleHeight(this.camera, 0)
            }
        }

        // this.circle.resize(this.width, this.height)
        this.plane.resize(this.size)
        // this.plane2.resize(this.size)
        // this.plane3.resize(this.size)
    }
}