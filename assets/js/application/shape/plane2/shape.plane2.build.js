SHAPE.plane2.build = class{
    constructor(group, size, renderer){
        this.#init(size, renderer)
        this.#create()
        this.#add(group)
    }


    // init
    #init(size, renderer){
        this.param = new SHAPE.plane2.param()
        this.renderer = renderer

        this.size = size
        
        this.clock = new THREE.Clock()
        this.delta = 0

        this.#initTexture()
    }
    #initTexture(){
        const len = Math.sqrt(this.param.count)

        this.gpuCompute = new THREE.GPUComputationRenderer(len, len, this.renderer)

        const map = this.gpuCompute.createTexture()

        SHAPE.plane2.method.fillTexture(map, this.size.obj)

        this.mapVariable = this.gpuCompute.addVariable('map', SHAPE.plane2.shader.map.fragment, map)

        this.gpuCompute.setVariableDependencies(this.mapVariable, [this.mapVariable])

        this.mapUniforms = this.mapVariable.material.uniforms

        this.mapUniforms['time'] = {value: 0.0}
        this.mapUniforms['delta'] = {value: 0.0}
        this.mapUniforms['width'] = {value: this.size.obj.w}
        this.mapUniforms['height'] = {value: this.size.obj.h}

        this.mapVariable.wrapS = THREE.RepeatWrapping
        this.mapVariable.wrapT = THREE.RepeatWrapping

        this.gpuCompute.init()
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
        this.mesh = new THREE.Points(geometry, material)
    }
    #createGeometry(){
        const geometry = new THREE.BufferGeometry()

        const {position, coord} = SHAPE.plane2.method.createAttribute(this.param, this.size.obj)

        geometry.setAttribute('position', new THREE.BufferAttribute(position, 3))
        geometry.setAttribute('coord', new THREE.BufferAttribute(coord, 2))

        return geometry
    }
    #createMaterial(){
        return new THREE.ShaderMaterial({
            vertexShader: SHAPE.plane2.shader.draw.vertex,
            fragmentShader: SHAPE.plane2.shader.draw.fragment,
            transparent: true,
            uniforms: {
                u_color: {value: new THREE.Color(this.param.color)},
                u_map: {value: null},
                u_size: {value: this.param.size}
            }
        })
    }


    // resize
    resize(size){
        this.size = size

        this.mesh.geometry.dispose() 
        this.mesh.geometry = this.#createGeometry()

        this.mapUniforms['width'].value = this.size.obj.w
        this.mapUniforms['height'].value = this.size.obj.h

        this.#initTexture()
    }


    // animate
    animate(){
        const time = window.performance.now()
        const delta = this.clock.getDelta()

        const uniforms = this.mesh.material.uniforms
        
        // this.mapUniforms['time'].value = time * 0.001
        // this.mapUniforms['delta'].value = delta * 0.01

        this.gpuCompute.compute()

        uniforms['u_map'].value = this.gpuCompute.getCurrentRenderTarget(this.mapVariable).texture
    }
}