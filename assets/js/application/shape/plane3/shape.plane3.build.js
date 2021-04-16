SHAPE.plane3.build = class{
    constructor(group, size, renderer){
        this.#init(size, renderer)
        this.#create()
        this.#add(group)
    }


    // init
    #init(size, renderer){
        this.param = new SHAPE.plane3.param()
        this.renderer = renderer

        this.size = size
        
        this.clock = new THREE.Clock()
        this.delta = 0

        this.#initTexture()
    }
    #initTexture(){
        this.gpuCompute = new THREE.GPUComputationRenderer(this.size.el.w, this.size.el.h, this.renderer)

        // arrays
        const velX = this.gpuCompute.createTexture()
        const velY = this.gpuCompute.createTexture()
        const velX0 = this.gpuCompute.createTexture()
        const velY0 = this.gpuCompute.createTexture()
        const s = this.gpuCompute.createTexture()
        const density = this.gpuCompute.createTexture()

        // SHAPE.plane3.method.fillTexture(velX)
        // SHAPE.plane3.method.fillTexture(vel0)
        // SHAPE.plane3.method.fillTexture(s)
        // SHAPE.plane3.method.fillTexture(density)

        this.velXVariable = this.gpuCompute.addVariable('velX', SHAPE.plane3.shader.velX.fragment, velX)
        this.velYVariable = this.gpuCompute.addVariable('velY', SHAPE.plane3.shader.velY.fragment, velY)
        this.velX0Variable = this.gpuCompute.addVariable('velX0', SHAPE.plane3.shader.velX0.fragment, velX0)
        this.velY0Variable = this.gpuCompute.addVariable('velY0', SHAPE.plane3.shader.velY0.fragment, velY0)
        this.sVariable = this.gpuCompute.addVariable('s', SHAPE.plane3.shader.s.fragment, s)
        this.densityVariable = this.gpuCompute.addVariable('density', SHAPE.plane3.shader.density.fragment, density)

        this.gpuCompute.setVariableDependencies(this.velXVariable, [this.velXVariable])
        this.gpuCompute.setVariableDependencies(this.velYVariable, [this.velYVariable])
        this.gpuCompute.setVariableDependencies(this.velX0Variable, [this.velX0Variable])
        this.gpuCompute.setVariableDependencies(this.velY0Variable, [this.velY0Variable])
        this.gpuCompute.setVariableDependencies(this.sVariable, [this.sVariable])
        this.gpuCompute.setVariableDependencies(this.densityVariable, [this.densityVariable])

        this.velXUniforms = this.velXVariable.material.uniforms
        this.velYUniforms = this.velYVariable.material.uniforms

        this.velXUniforms['noise'] = {value: 0.0}
        this.velYUniforms['noise'] = {value: 0.0}

        
        // physics function

        // set boundary
        this.set_bndShader = this.gpuCompute.createShaderMaterial(SHAPE.plane3.shader.set_bnd.fragment, {
            b: {value: null},
            u_d: {value: null}
        })
        
        // advect
        this.advectShader = this.gpuCompute.createShaderMaterial(SHAPE.plane3.shader.advect.fragment, {
            dt: {value: this.param.dt},
            b: {value: null},
            u_d: {value: null},
            u_d0: {value: null},
            velX: {value: null},
            velY: {value: null}
        })

        // projection
        this.project1Shader = this.gpuCompute.createShaderMaterial(SHAPE.plane3.shader.project1.fragment, {
            u_div: {value: null},
            velX: {value: null},
            velY: {value: null}
        })

        this.project2Shader = this.gpuCompute.createShaderMaterial(SHAPE.plane3.shader.project2.fragment, {
            u_p: {value: null}
        })

        this.project3Shader = this.gpuCompute.createShaderMaterial(SHAPE.plane3.shader.project3.fragment, {
            vel: {value: null},
            u_p: {value: null},
            direction: {value: null}
        })

        // line solve
        this.lin_solveShader = this.gpuCompute.createShaderMaterial(SHAPE.plane3.shader.lin_solve.fragment, {
            b: {value: null},
            a: {value: null},
            c: {value: null},
            u_x: {value: null},
            u_x0: {value: null}
        })

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
        this.mesh = new THREE.Mesh(geometry, material)
    }
    #createGeometry(){
        return new THREE.PlaneGeometry(this.size.obj.w, this.size.obj.h, 1, 1)
    }
    #createMaterial(){
        return new THREE.ShaderMaterial({
            vertexShader: SHAPE.plane3.shader.draw.vertex,
            fragmentShader: SHAPE.plane3.shader.draw.fragment,
            transparent: true,
            uniforms: {
                u_color: {value: new THREE.Color(this.param.color)},
                opacity: {value: null}
            }
        })
    }


    // resize
    resize(size){
        this.size = size

        this.mesh.geometry.dispose() 
        this.mesh.geometry = this.#createGeometry()

        this.#initTexture()
    }


    // animate
    animate(){
        const delta = this.clock.getDelta()
        
        // this.velocityUniforms['time'].value = time * 0.001
        // this.velocityUniforms['delta'].value = delta * 0.01

        // this.gpuCompute.compute()

        // this.#step()
        // this.#render()
    }
    #step(){
        const {gpuCompute, velXVariable, velYVariable, velX0Variable, velY0Variable, sVariable, densityVariable} = this
        const {advectShader, set_bndShader, project1Shader, project2Shader, project3Shader, lin_solveShader} = this
        const {dt, diff, visc} = this.param

        SHAPE.plane3.method.diffuse({
            gpuCompute,
            lin_solve: lin_solveShader,
            set_bnd: set_bndShader,
            b: 1,
            dt,
            diff,
            x: velX0Variable,
            x0: velXVariable
        })
        SHAPE.plane3.method.diffuse({
            gpuCompute,
            lin_solve: lin_solveShader,
            set_bnd: set_bndShader,
            b: 2,
            dt,
            diff,
            x: velY0Variable,
            x0: velYVariable
        })

        SHAPE.plane3.method.project({
            gpuCompute,
            project1: project1Shader,
            project2: project2Shader,
            project3: project3Shader,
            lin_solve: lin_solveShader,
            set_bnd: set_bndShader,
            velX: velX0Variable,
            velY: velY0Variable,
            p: velXVariable,
            div: velYVariable
        })

        SHAPE.plane3.method.advect({
            gpuCompute, 
            advection: advectShader,
            set_bnd: set_bndShader,
            b: 1,
            dt,
            d: velXVariable,
            d0: velX0Variable,
            velX: velX0Variable,
            velY: velY0Variable
        })
        SHAPE.plane3.method.advect({
            gpuCompute, 
            advection: advectShader,
            set_bnd: set_bndShader,
            b: 2,
            dt,
            d: velXVariable,
            d0: velY0Variable,
            velX: velX0Variable,
            velY: velY0Variable
        })

        SHAPE.plane3.method.project({
            gpuCompute,
            project1: project1Shader,
            project2: project2Shader,
            project3: project3Shader,
            lin_solve: lin_solveShader,
            set_bnd: set_bndShader,
            velX: velXVariable,
            velY: velYVariable,
            p: velX0Variable,
            div: velY0Variable
        })
        SHAPE.plane3.method.diffuse({
            gpuCompute,
            lin_solve: lin_solveShader,
            set_bnd: set_bndShader,
            b: 0,
            dt,
            diff,
            x: sVariable,
            x0: densityVariable
        })
        SHAPE.plane3.method.advect({
            gpuCompute, 
            advection: advectShader,
            set_bnd: set_bndShader,
            b: 0,
            dt,
            d: densityVariable,
            d0: sVariable,
            velX: velXVariable,
            velY: velYVariable
        })
    }
    #render(){
        const uniforms = this.mesh.material.uniforms
        const time = window.performance.now()

        this.velXUniforms['noise'].value = SIMPLEX.noise2D(1 / 100, time * 0.001) 
        this.velYUniforms['noise'].value = SIMPLEX.noise2D(2 / 100, time * 0.001)

        uniforms['opacity'].value = this.gpuCompute.getCurrentRenderTarget(this.densityVariable).texture
    }
}