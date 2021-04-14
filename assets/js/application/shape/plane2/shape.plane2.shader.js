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
        // fragment: `
        //     uniform float time;
        //     // uniform float delta;
        //     // uniform float noise;
        //     uniform float width;
        //     uniform float height;


        //     void main(){
        //         vec2 pixel = 1.0 / resolution.xy;
        //         vec2 uv = gl_FragCoord.xy / resolution.xy;

        //         vec4 m = texture(map, uv);
                
        //         m.x += m.z;
        //         m.y += m.w;

        //         if(m.x > width * 0.5) m.x = width * -0.5;
        //         if(m.x < width * -0.5) m.x = width * 0.5;
                
        //         if(m.y > height * 0.5) m.y = height * -0.5;
        //         if(m.y < height * -0.5) m.y = height * 0.5;

        //         gl_FragColor = m;
        //     }
        // `


        // perlin noise
        // fragment: `
        //     uniform float time;
        //     // uniform float delta;
        //     // uniform float noise;
        //     uniform float width;
        //     uniform float height;
       
        //     float random(in vec2 st){
        //         return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
        //     }

        //     float noise(in vec2 st){
        //         vec2 i = floor(st);
        //         vec2 f = fract(st);

        //         float a = random(i);
        //         float b = random(i + vec2(1.0, 0.0));
        //         float c = random(i + vec2(0.0, 1.0));
        //         float d = random(i + vec2(1.0, 1.0));

        //         vec2 u = f*f*(3.0-2.0*f);

        //         return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
        //     }

        //     void main(){
        //         vec2 pixel = 1.0 / resolution.xy;
        //         vec2 uv = gl_FragCoord.xy / resolution.xy;

        //         vec4 m = texture(map, uv);

        //         float vx = 2.0 - noise(vec2(m.z, time * uv.x)) * 4.0;
        //         float vy = 2.0 - noise(vec2(m.w, time * uv.y)) * 4.0;
                
        //         m.x += vx;
        //         m.y += vy;

        //         if(m.x > width * 0.5) m.x = width * -0.5;
        //         if(m.x < width * -0.5) m.x = width * 0.5;
                
        //         if(m.y > height * 0.5) m.y = height * -0.5;
        //         if(m.y < height * -0.5) m.y = height * 0.5;

        //         gl_FragColor = m;
        //     }
        // `


        // set boundary
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

                if(m.x >= width * 0.5 || m.x <= width * -0.5) m.z *= -1.0;
                
                if(m.y >= height * 0.5 || m.y <= height * -0.5) m.w *= -1.0;

                gl_FragColor = m;
            }
        `
    }
}