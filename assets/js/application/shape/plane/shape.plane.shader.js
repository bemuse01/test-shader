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