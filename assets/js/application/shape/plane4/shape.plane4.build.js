SHAPE.plane4.build = class{
    constructor(group, size, renderer){
        this.#init(size, renderer)
        this.#create()
        this.#add(group)

        window.addEventListener('mousemove', (e) => this.#mousemove(e))
    }


    // init
    #init(size, renderer){
        this.param = new SHAPE.plane4.param()
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
        // const size = this.gpuCompute.createTexture()

        SHAPE.plane4.method.fillTexture(map, this.size.obj)
        // SHAPE.plane4.method.fillSizeTexture(size, this.param.size)

        this.mapVariable = this.gpuCompute.addVariable('map', SHAPE.plane4.shader.map.fragment, map)
        // this.sizeVariable = this.gpuCompute.addVariable('size', SHAPE.plane4.shader.size.fragment, size)

        this.gpuCompute.setVariableDependencies(this.mapVariable, [this.mapVariable])
        // this.gpuCompute.setVariableDependencies(this.sizeVariable, [this.mapVariable, this.sizeVariable])

        this.mapUniforms = this.mapVariable.material.uniforms
        // this.sizeUniforms = this.sizeVariable.material.uniforms

        const hx = this.size.el.w / 2
        const hy = this.size.el.h / 2

        const rx = Math.random() * this.size.el.w
        const ry = Math.random() * this.size.el.h

        const x = (rx - hx) / hx * (this.size.obj.w / 2)
        const y = (hy - ry) / hy * (this.size.obj.h / 2)

        console.log((rx - hx) / hx, (hy - ry) / hy)

        this.mapUniforms['time'] = {value: 0.0}
        this.mapUniforms['delta'] = {value: 0.0}
        this.mapUniforms['width'] = {value: this.size.obj.w}
        this.mapUniforms['height'] = {value: this.size.obj.h}
        this.mapUniforms['mx'] = {value: null}
        this.mapUniforms['my'] = {value: null}
        this.mapUniforms['mousesize'] = {value: this.param.mousesize}

        // this.sizeUniforms['mx'] = {value: null}
        // this.sizeUniforms['my'] = {value: null}
        // this.sizeUniforms['mousesize'] = {value: this.param.mousesize}

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

        const {position, coord} = SHAPE.plane4.method.createAttribute(this.param, this.size.obj)

        geometry.setAttribute('position', new THREE.BufferAttribute(position, 3))
        geometry.setAttribute('coord', new THREE.BufferAttribute(coord, 2))

        return geometry
    }
    #createMaterial(){
        return new THREE.ShaderMaterial({
            vertexShader: SHAPE.plane4.shader.draw.vertex,
            fragmentShader: SHAPE.plane4.shader.draw.fragment,
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


    // mouse move
    #mousemove(event){
        const hx = this.size.el.w / 2
        const hy = this.size.el.h / 2

        const x = (event.clientX - hx) / hx * (this.size.obj.w / 2)
        const y = (hy - event.clientY) / hy * (this.size.obj.h / 2)

        this.mapUniforms['mx'].value = x
        this.mapUniforms['my'].value = y
    }


    // animate
    animate(){
        const time = window.performance.now()
        const delta = this.clock.getDelta()

        const uniforms = this.mesh.material.uniforms
        
        this.mapUniforms['time'].value = time * 0.001
        // this.mapUniforms['delta'].value = delta * 0.01

        this.gpuCompute.compute()

        uniforms['u_map'].value = this.gpuCompute.getCurrentRenderTarget(this.mapVariable).texture
        // uniforms['u_size'].value = this.gpuCompute.getCurrentRenderTarget(this.sizeVariable).texture
    }
}