SHAPE.plane2.shader = {
    draw: {
        vertex: `
            uniform float u_size;
            uniform sampler2D u_map;
            attribute vec2 coord;

            void main(){
                vec3 newPosition = position;
                vec4 map = texture(u_map, coord);

                newPosition.xy = map.xy;

                gl_PointSize = u_size;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
            }
        `,

        
        // get center pixel
        // fragment: `
        //     uniform vec3 u_color;
        //     uniform sampler2D u_map;

        //     varying vec2 v_uv;

        //     void main(){
        //         vec2 pixel = 1.0 / vec2(textureSize(u_map, 0)); 

        //         float dist = distance(vec2(0.5, 0.5), v_uv);

        //         float opacity = dist <= length(pixel) ? 1.0 : 0.0;

        //         gl_FragColor = vec4(u_color, opacity);
        //     }
        // `


        fragment: `
            uniform vec3 u_color;

            void main(){
                gl_FragColor = vec4(u_color, 1.0);
            }
        `
    },
    map: {
        fragment: `
            // uniform float time;
            // uniform float delta;
            // uniform float noise;
            uniform float width;
            uniform float height;

            void main(){
                vec2 pixel = 1.0 / resolution.xy;
                vec2 uv = gl_FragCoord.xy / resolution.xy;

                vec4 m = texture(map, uv);
                
                m.x += m.z;
                m.y += m.w;

                if(m.x > width * 0.5) m.x = width * -0.5;
                if(m.x < width * -0.5) m.x = width * 0.5;
                
                if(m.y > height * 0.5) m.y = height * -0.5;
                if(m.y < height * -0.5) m.y = height * 0.5;

                gl_FragColor = m;
            }
        `
    }
}