SHAPE.plane4.shader = {
    draw: {
        vertex: `
            // uniform float u_size;
            uniform sampler2D u_map;
            uniform sampler2D u_size;
            attribute vec2 coord;

            void main(){
                vec3 newPosition = position;
                vec4 map = texture(u_map, coord);
                vec4 size = texture(u_size, coord);

                newPosition.xy = map.xy;

                gl_PointSize = size.x;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
            }
        `,
        fragment: `
            uniform vec3 u_color;

            void main(){
                gl_FragColor = vec4(u_color, 1.0);
            }
        `
    },
    map: {
        fragment: `
            uniform float time;
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
    },
    size: {
        fragment: `
            uniform float mx;
            uniform float my;
            uniform float mousesize;

            void main(){
                vec2 pixel = 1.0 / resolution.xy;
                vec2 uv = gl_FragCoord.xy / resolution.xy;

                vec4 m = texture(map, uv);
                vec4 s = texture(size, uv);


                float dist = distance();

                gl_FragColor = s;
            }  
        `
    }
}