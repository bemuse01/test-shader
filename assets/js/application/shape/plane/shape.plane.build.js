SHAPE.plane.build = class{
    constructor(group, size, gpuCompute){
        this.#init(size, gpuCompute)
        this.#create()
        this.#add(group)
    }


    // init
    #init(size, gpuCompute){
        this.param = new SHAPE.plane.param()

        this.gpuCompute = gpuCompute

        this.size = size
        
        this.clock = new THREE.Clock()
        this.delta = 0

        // this.ratio = this.height / this.width
        // this.col = this.param.seg
        // this.row = Math.floor(this.param.seg * this.ratio)

        this.#initTexture()
    }
    #initTexture(){
        const previous = this.gpuCompute.createTexture()

        SHAPE.plane.method.fillTexture(previous)

        this.previousVariable = this.gpuCompute.addVariable('previous', SHAPE.plane.shader.previous.fragment, previous)

        this.gpuCompute.setVariableDependencies(this.previousVariable, [this.previousVariable])

        this.previousUniforms = this.previousVariable.material.uniforms

        this.previousUniforms['time'] = {value: 0.0}
        this.previousUniforms['delta'] = {value: 0.0}
        this.previousUniforms['noise'] = {value: 0.0}
        this.previousUniforms['damping'] = {value: this.param.damping}
        this.previousUniforms['minDist'] = {value: this.param.minDist}
        this.previousUniforms['pos'] = {value: new THREE.Vector2(0, 0)}

        this.previousVariable.wrapS = THREE.RepeatWrapping
        this.previousVariable.wrapT = THREE.RepeatWrapping

        this.gpuCompute.init()

        // position = gpuCompute.createTexture();
        // const dtVelocity = gpuCompute.createTexture();
        // fillPositionTexture( dtPosition );
        // fillVelocityTexture( dtVelocity );

        // velocityVariable = gpuCompute.addVariable( "textureVelocity", document.getElementById( 'fragmentShaderVelocity' ).textContent, dtVelocity );
        // positionVariable = gpuCompute.addVariable( "texturePosition", document.getElementById( 'fragmentShaderPosition' ).textContent, dtPosition );

        // gpuCompute.setVariableDependencies( velocityVariable, [ positionVariable, velocityVariable ] );
        // gpuCompute.setVariableDependencies( positionVariable, [ positionVariable, velocityVariable ] );

        // positionUniforms = positionVariable.material.uniforms;
        // velocityUniforms = velocityVariable.material.uniforms;

        // positionUniforms[ "time" ] = { value: 0.0 };
        // positionUniforms[ "delta" ] = { value: 0.0 };
        // velocityUniforms[ "time" ] = { value: 1.0 };
        // velocityUniforms[ "delta" ] = { value: 0.0 };
        // velocityUniforms[ "testing" ] = { value: 1.0 };
        // velocityUniforms[ "separationDistance" ] = { value: 1.0 };
        // velocityUniforms[ "alignmentDistance" ] = { value: 1.0 };
        // velocityUniforms[ "cohesionDistance" ] = { value: 1.0 };
        // velocityUniforms[ "freedomFactor" ] = { value: 1.0 };
        // velocityUniforms[ "predator" ] = { value: new THREE.Vector3() };
        // velocityVariable.material.defines.BOUNDS = BOUNDS.toFixed( 2 );
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
        return new THREE.PlaneGeometry(this.size.obj.w, this.size.obj.h, 1, 1)
    }
    #createMaterial(){
        return new THREE.ShaderMaterial({
            vertexShader: SHAPE.plane.shader.draw.vertex,
            fragmentShader: SHAPE.plane.shader.draw.fragment,
            transparent: true,
            uniforms: {
                u_color: {value: new THREE.Color(this.param.color)},
                previous: {value: null},
                current: {value: null},
                damping: {value: this.param.damping}
            }
        })
    }


    // resize
    resize(size){
        this.size = size

        // this.ratio = this.height / this.width
        // this.col = this.param.seg
        // this.row = Math.floor(this.param.seg * this.ratio)

        this.mesh.geometry.dispose() 
        this.mesh.geometry = this.#createGeometry()
    }


    // animate
    animate(){
        const time = window.performance.now()
        const delta = this.clock.getDelta()

        const uniforms = this.mesh.material.uniforms
        
        const r = SIMPLEX.noise2D(1 / 100, time / 10000)
        const n = METHOD.normalize(r, 0, 1, -1, 1)

        // this.previousUniforms['time'].value = time * 0.001
        // this.previousUniforms['delta'].value = delta * 0.01
        // this.previousUniforms['noise'].value = n
        this.previousUniforms['pos'].value = new THREE.Vector2(Math.random(), Math.random())

        this.gpuCompute.compute()

        uniforms['previous'].value = this.gpuCompute.getCurrentRenderTarget(this.previousVariable).texture;
    }
}