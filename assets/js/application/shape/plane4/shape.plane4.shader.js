SHAPE.plane4.shader = {
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
            uniform float mx;
            uniform float my;
            uniform float mousesize;

            const float PI = 3.1415926535897932384626433832795;
            const float RADIAN = PI / 180.0;

            void main(){
                vec2 pixel = 1.0 / resolution.xy;
                vec2 uv = gl_FragCoord.xy / resolution.xy;

                vec4 m = texture(map, uv);

                vec2 forePos = vec2(m.x + m.z, m.y + m.w);
                
                float dist = distance(forePos.xy, vec2(mx, my));

                if(dist <= mousesize){
                    vec2 nf = normalize(forePos.xy - vec2(mx, my));
                    vec2 nm = normalize(vec2(mx, 0));

                    float d = dot(nf, nm);
                    float theta = sign(forePos.y - my) * acos(d);

                    float x = cos(theta) * mousesize;
                    float y = sin(theta) * mousesize;

                    m.x = mx <= 0.0 ? -x + mx : x + mx;
                    m.y = y + my;
                }else{
                    m.x += m.z;
                    m.y += m.w;
                }

                if(m.x > width * 0.5) m.x = width * -0.5;
                if(m.x < width * -0.5) m.x = width * 0.5;
                
                if(m.y > height * 0.5) m.y = height * -0.5;
                if(m.y < height * -0.5) m.y = height * 0.5;

                gl_FragColor = m;
            }
        `


        // draw circle
        // fragment: `
        //     uniform float time;
        //     uniform float width;
        //     uniform float height;
        //     uniform float mx;
        //     uniform float my;
        //     uniform float mousesize;

        //     const float PI = 3.1415926535897932384626433832795;

        //     float random(vec2 _st){
        //         return fract(sin(dot(_st.xy, vec2(12.9898,78.233))) * 43758.5453123);
        //     }

        //     void main(){
        //         vec2 pixel = 1.0 / resolution.xy;
        //         vec2 uv = gl_FragCoord.xy / resolution.xy;

        //         vec4 m = texture(map, uv);

        //         vec2 nf = normalize(vec2(m.x - mx, m.y - my));
        //         vec2 nm = normalize(vec2(mx - 0.0, my - my));

        //         float lf = length(m.xy);
        //         float lm = length(vec2(mx, my));
        
        //         float d = dot(nf, nm);
        //         // float theta = lf <= lm ? acos(d) : acos(d) * PI;
        //         float theta = acos(d);

        //         float rand = random(uv) * PI * 2.0;

        //         float x = cos(theta) * 100.0;
        //         float y = sin(theta) * 100.0;

        //         m.x = x + mx;
        //         m.y = y + my;

        //         gl_FragColor = m;
        //     }
        // `
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

                float dist = distance(m.xy, vec2(mx, my));

                gl_FragColor = s;
            }  
        `
    }
}