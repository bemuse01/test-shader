SHAPE.plane3.method = {
    fillTexture(texture){
        const data = texture.image.data

        for(let i = 0; i < data.length / 4; i++){
            const index = i * 4

            data[index] = 0
            data[index + 1] = 0
            data[index + 2] = 0
            data[index + 3] = 0
        }
    },
    // set_bnd({gpuCompute, set_bnd, b, d}){
    //     const current = gpuCompute.getCurrentRenderTarget(d)
    //     const alter = gpuCompute.getAlternateRenderTarget(d)

    //     // set bnd
    //     set_bnd.uniforms['b'].value = b

    //     set_bnd.uniforms['u_d'].value = current.texture
    //     gpuCompute.doRenderTarget(set_bnd, alter)

    //     set_bnd.uniforms['u_d'].value = alter.texture
    //     gpuCompute.doRenderTarget(set_bnd, current)
    // },
    // advect({gpuCompute, advection, set_bnd, b, dt, d, d0, velX, velY}){
    //     const u_d0 = gpuCompute.getCurrentRenderTarget(d0).texture
    //     const u_velX = gpuCompute.getCurrentRenderTarget(velX).texture
    //     const u_velY = gpuCompute.getCurrentRenderTarget(velY).texture

    //     const current = gpuCompute.getCurrentRenderTarget(d)
    //     const alter = gpuCompute.getAlternateRenderTarget(d)

    //     // advect
    //     advection.uniforms['dt'].value = dt
    //     advection.uniforms['u_d0'].value = u_d0 
    //     advection.uniforms['velX'].value = u_velX 
    //     advection.uniforms['velY'].value = u_velY

    //     advection.uniforms['u_d'].value = current.texture
    //     gpuCompute.doRenderTarget(advection, alter)

    //     advection.uniforms['u_d'].value = alter.texture
    //     gpuCompute.doRenderTarget(advection, current)

    //     // set bnd
    //     this.set_bnd({gpuCompute, set_bnd, b, d})
    // },
    // diffuse({gpuCompute, lin_solve, set_bnd, b, dt, diff, x, x0}){
    //     const a = dt * diff
    //     const c = 1 + 6 * a
    //     this.lin_solve({gpuCompute, lin_solve, set_bnd, b, x, x0, a, c})
    // },
    // lin_solve({gpuCompute, lin_solve, set_bnd, b, x, x0, a, c}){
    //     const u_x0 = gpuCompute.getCurrentRenderTarget(x0).texture

    //     const current = gpuCompute.getCurrentRenderTarget(x)
    //     const alter = gpuCompute.getAlternateRenderTarget(x)

    //     // line solve
    //     lin_solve.uniforms['a'].value = a
    //     lin_solve.uniforms['c'].value = c
    //     lin_solve.uniforms['u_x0'].value = u_x0

    //     lin_solve.uniforms['u_x'].value = current.texture
    //     gpuCompute.doRenderTarget(lin_solve, alter)

    //     lin_solve.uniforms['u_x'].value = alter.texture
    //     gpuCompute.doRenderTarget(lin_solve, current)

    //     // set bnd
    //     this.set_bnd({gpuCompute, set_bnd, b, d: x})
    // },
    // project({gpuCompute, project1, project2, project3, lin_solve, set_bnd, velX, velY, p, div}){
    //     const u_velX_current = gpuCompute.getCurrentRenderTarget(velX)
    //     const u_velX_alter = gpuCompute.getAlternateRenderTarget(velX)

    //     const u_velY_current = gpuCompute.getCurrentRenderTarget(velY)
    //     const u_velY_alter = gpuCompute.getAlternateRenderTarget(velY)

    //     const u_p_current = gpuCompute.getCurrentRenderTarget(p)
    //     const u_p_alter = gpuCompute.getAlternateRenderTarget(p)

    //     const u_div_current = gpuCompute.getCurrentRenderTarget(div)
    //     const u_div_alter = gpuCompute.getAlternateRenderTarget(div)


    //     // project 1
    //     project1.uniforms['velX'].value = u_velX_current.texture
    //     project1.uniforms['velY'].value = u_velY_current.texture

    //     project1.uniforms['u_div'].value = u_div_current.texture
    //     gpuCompute.doRenderTarget(project1, u_div_alter)

    //     project1.uniforms['u_div'].value = u_div_alter.texture
    //     gpuCompute.doRenderTarget(project1, u_div_current)


    //     // project 2
    //     project2.uniforms['u_p'].value = u_p_current.texture
    //     gpuCompute.doRenderTarget(project2, u_p_alter)

    //     project2.uniforms['u_p'].value = u_p_alter.texture
    //     gpuCompute.doRenderTarget(project2, u_p_current)


    //     // set bnd div
    //     this.set_bnd({gpuCompute, set_bnd, b: 0, d: div})


    //     // set bnd p
    //     this.set_bnd({gpuCompute, set_bnd, b: 0, d: p})


    //     // line solve p div
    //     this.lin_solve({gpuCompute, lin_solve, set_bnd, b: 0, x: p, x0: div, a: 1, c: 6})


    //     // project 3 x
    //     project3.uniforms['u_p'].value = u_p_current.texture
    //     project3.uniforms['direction'].value = true

    //     project3.uniforms['vel'].value = u_velX_current.texture
    //     gpuCompute.doRenderTarget(project3, u_velX_alter)

    //     project3.uniforms['vel'].value = u_velX_alter.texture
    //     gpuCompute.doRenderTarget(project3, u_velX_current)


    //     // project 3 y
    //     project3.uniforms['u_p'].value = u_p_current.texture
    //     project3.uniforms['direction'].value = false

    //     project3.uniforms['vel'].value = u_velY_current.texture
    //     gpuCompute.doRenderTarget(project3, u_velY_alter)

    //     project3.uniforms['vel'].value = u_velY_alter.texture
    //     gpuCompute.doRenderTarget(project3, u_velY_current)


    //     // set bnd velX
    //     this.set_bnd({gpuCompute, set_bnd, b: 1, d: velX})
        
        
    //     // set bnd velY 
    //     this.set_bnd({gpuCompute, set_bnd, b: 2, d: velY})
    // }
}