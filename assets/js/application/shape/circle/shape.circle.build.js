SHAPE.circle.build = class{
    constructor(group){
        this.#init()
        this.#create()
        this.#add(group)
    }


    // init
    #init(){
        this.param = new SHAPE.circle.param()
    }


    // add
    #add(group){
        group.add(this.mesh)
    }


    // create
    #create(){
        this.#createMesh()
    }
    #createMesh(){
        const geometry = this.#createGeometry()
        const material = this.#createMaterial()
        this.mesh = new THREE.Mesh(geometry, material)
    }
    #createGeometry(){
        const geometry = new THREE.CircleGeometry(this.param.radius, this.param.seg)

        return geometry
    }
    #createMaterial(){
        const texture = SHAPE.circle.method.createTexture()
        const filter = [
            0.045, 0.122, 0.045,
            0.122, 0.332, 0.122,
            0.045, 0.122, 0.045
        ]

        return new THREE.ShaderMaterial({
            vertexShader: SHAPE.circle.shader.vertex,
            fragmentShader: SHAPE.circle.shader.fragment,
            transparent: true,
            uniforms: {
                color: {value: new THREE.Color(this.param.color)},
                u_texture: {value: texture},
                u_filter: {value: filter}
            }
        })
    }
}