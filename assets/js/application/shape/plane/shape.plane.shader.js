SHAPE.plane.shader = {
    draw: {
        vertex: `
            varying vec2 v_uv;

            void main(){
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                v_uv = uv;
            }
        `,
        // fragment: `
        //     uniform vec3 u_color;
        //     uniform sampler2D previous;
        //     uniform sampler2D current;
        //     uniform float damping;

        //     varying vec2 v_uv;

        //     void main(){
        //         vec4 color = texture(previous, v_uv);

        //         gl_FragColor = vec4(color.xyz, 1.0);
        //     }
        // `


        fragment: `
            uniform vec3 u_color;
            uniform sampler2D previous;
            uniform sampler2D current;

            varying vec2 v_uv;

            void main(){
                vec4 color = texture(previous, v_uv);

                gl_FragColor = vec4(u_color, color.x);
            }
        `
    },
    previous: {
        // fragment: `
        //     uniform float delta;
        //     uniform float noise;
            
        //     float random(vec2 _st){
        //         return fract(sin(dot(_st.xy, vec2(12.9898,78.233))) * 43758.5453123);
        //     }

        //     void main(){
        //         vec2 uv = gl_FragCoord.xy / resolution.xy;

		// 		// vec4 tmpPos = texture2D( texturePosition, uv );
		// 		// vec3 position = tmpPos.xyz;
		// 		// vec3 velocity = texture2D( textureVelocity, uv ).xyz;

		// 		// float phase = tmpPos.w;

		// 		// phase = mod( ( phase + delta +
		// 		// 	length( velocity.xz ) * delta * 3. +
		// 		// 	max( velocity.y, 0.0 ) * delta * 6. ), 62.83 );

		// 		// gl_FragColor = vec4( position + velocity * delta * 15. , phase );

        //         // float rand = random(vec2(uv.x, delta));

        //         gl_FragColor = vec4(uv, noise, 1.0);
        //     }
        // `


        // water ripple 
        fragment: `
            // uniform float time;
            // uniform float delta;
            // uniform float noise;
            uniform float minDist;
            uniform float damping;
            uniform vec2 pos;

            float random(vec2 _st){
                return fract(sin(dot(_st.xy, vec2(12.9898,78.233))) * 43758.5453123);
            }
            
            void main(){
                vec2 pixel = 1.0 / resolution.xy;
                vec2 uv = gl_FragCoord.xy / resolution.xy;
                float distance = distance(uv, pos);

                vec4 map = texture(previous, uv);

                // map.x === previous
                // map.y === current

                vec4 top = texture(previous, uv + vec2(0.0, pixel.y));
                vec4 bottom = texture(previous, uv + vec2(0.0, -pixel.y));
                vec4 right = texture(previous, uv + vec2(pixel.x, 0.0));
                vec4 left = texture(previous, uv + vec2(-pixel.x, 0.0));

                float current = ((top.x + bottom.x + right.x + left.x) * 0.5 - map.y) * damping;
                if(distance < minDist) current += 2.0;

                map.y = map.x;
                map.x = current;
                
                gl_FragColor = map;
            }
        `
    }
}

// if(Math.random() > 0.8) {
//     const ratio = this.height / this.width
//     const wSeg = this.param.seg + 1
//     const hSeg = Math.floor(this.param.seg * ratio) + 1

//     const row = Math.floor(Math.random() * (hSeg - 20) + 10)
//     const col = Math.floor(Math.random() * (wSeg - 20) + 10)
//     this.previous[row][col] = 1.0
// }

// for(let i = 1; i < this.current.length - 1; i++){
//     for(let j = 1; j < this.current[0].length - 1; j++){
//         this.current[i][j] = (
//             this.previous[i - 1][j] + 
//             this.previous[i + 1][j] + 
//             this.previous[i][j - 1] +
//             this.previous[i][j + 1]) / 2 - 
//             this.current[i][j]
        
//         this.current[i][j] = this.current[i][j] * this.param.damping

//         const index = i * this.current[0].length + j
//         this.attr.opacity[index] = this.current[i][j]
//     }
// }

// opacity.needsUpdate = true

// const temp = this.previous
// this.previous = this.current
// this.current = temp