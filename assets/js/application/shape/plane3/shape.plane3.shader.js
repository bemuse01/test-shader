SHAPE.plane3.shader = {
    draw: {
        vertex: `
            varying vec2 v_uv;

            void main(){
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                v_uv = uv;
            }
        `,

        fragment: `
            uniform vec3 u_color;
            uniform sampler2D opacity;

            varying vec2 v_uv;

            void main(){
                vec4 o = texture(opacity, v_uv);

                gl_FragColor = vec4(u_color, o.x);
            }
        `
    },
    velX: {
        fragment: `
            uniform float noise;

            void main(){
                vec2 uv = gl_FragCoord.xy / resolution.xy;

                vec4 v = texture(velX, uv);

                float dist = distance(uv, vec2(0.5, 0.5));

                if(dist <= 0.0) v.x = noise;

                gl_FragColor = v;
            }
        `
    },
    velY: {
        fragment: `
            uniform float noise;

            void main(){
                vec2 uv = gl_FragCoord.xy / resolution.xy;

                vec4 v = texture(velY, uv);

                float dist = distance(uv, vec2(0.5, 0.5));

                if(dist <= 0.0) v.x = noise;

                gl_FragColor = v;
            }
        `
    },
    velX0: {
        fragment: `
            void main(){
                vec2 uv = gl_FragCoord.xy / resolution.xy;

                gl_FragColor = texture(velX0, uv);
            }
        `
    },
    velY0: {
        fragment: `
            void main(){
                vec2 uv = gl_FragCoord.xy / resolution.xy;

                gl_FragColor = texture(velY0, uv);
            }
        `
    },
    s: {
        fragment: `
            void main(){
                vec2 uv = gl_FragCoord.xy / resolution.xy;

                gl_FragColor = texture(s, uv);
            }
        `
    },
    density: {
        fragment: `
            void main(){
                vec2 uv = gl_FragCoord.xy / resolution.xy;

                vec4 d = texture(density, uv);

                float dist = distance(uv, vec2(0.5, 0.5));

                if(dist <= 0.0) d.x = 1.0;
                
                gl_FragColor = d;
            }
        `
    },
    set_bnd: {
        fragment: `
            uniform int b;
            uniform sampler2D u_d;

            float effection(float dist, vec2 pos, vec4 o){
                vec4 tmp = texture(u_d, pos);

                if(dist <= 0.0) return b == 1 || b == 2 ? -tmp.x : tmp.x;
                else return o.x;
            }
            
            float effection(float dist, vec4 pos, vec4 o){
                vec4 tmp1 = texture(u_d, pos.xy);
                vec4 tmp2 = texture(u_d, pos.zw);

                if(dist <= 0.0) return (tmp1.x + tmp2.x) * 0.5;
                else return o.x;
            }

            void main(){
                vec2 pixel = 1.0 / resolution.xy;
                vec2 uv = gl_FragCoord.xy / resolution.xy;

                vec4 map = texture(u_d, uv);


                // bnd
                float bnd[4] = float[4](
                    distance(vec2(uv.x, 0.0), uv), // top
                    distance(vec2(uv.x, 1.0), uv), // bottom
                    distance(vec2(1.0, uv.y), uv), // right
                    distance(vec2(0.0, uv.y), uv) // left
                );
                vec2 bnd_pos[4] = vec2[4](
                    vec2(uv.x, pixel.y), // top
                    vec2(uv.x, 1.0 - pixel.y), // bottom
                    vec2(1.0 - pixel.x, uv.y), // right
                    vec2(pixel.x, uv.y) // left
                );

                for(int i = 0; i < 4; i++){
                    map.x = effection(bnd[i], bnd_pos[i], map);
                }


                // edge
                float edge[4] = float[4](
                    distance(vec2(0.0, 0.0), uv), // top-left
                    distance(vec2(1.0, 0.0), uv), // top-right
                    distance(vec2(0.0, 1.0), uv), // bottom-left
                    distance(vec2(1.0, 1.0), uv) // bottom-right
                );
                vec4 edge_pos[4] = vec4[4](
                    vec4(vec2(pixel.x, 0.0), vec2(0.0, pixel.y)), // top-left
                    vec4(vec2(1.0 - pixel.x, 0.0), vec2(1.0, pixel.y)), // top-right
                    vec4(vec2(pixel.x, 1.0), vec2(0.0, 1.0 - pixel.y)), // bottom-left
                    vec4(vec2(1.0 - pixel.x, 1.0), vec2(1.0, 1.0 - pixel.y)) // bottom-right
                );
                
                for(int i = 0; i < 4; i++){
                    map.x = effection(edge[i], edge_pos[i], map);
                }


                gl_FragColor = map;
            }
        `
    },
    advect: {
        fragment: `
            uniform float dt;
            uniform sampler2D u_d;
            uniform sampler2D u_d0;
            uniform sampler2D velX;
            uniform sampler2D velY;

            void main(){
                vec2 pixel = 1.0 / resolution.xy;
                vec2 uv = gl_FragCoord.xy / resolution.xy;

                vec4 vx = texture(velX, uv);
                vec4 vy = texture(velY, uv);
                vec4 d = texture(u_d, uv);

                float xf = 1.0 - pixel.x * 2.0;
                float yf = 1.0 - pixel.y * 2.0;

                float dtx = dt * xf;
                float dty = dt * yf;

                float tmpx = dtx * vx.x;
                float tmpy = dty * vy.x;

                float x = uv.x - tmpx;
                float y = uv.y - tmpy;

                x = clamp(x, pixel.x * 0.5, xf + pixel.x * 0.5);
                y = clamp(y, pixel.y * 0.5, yf + pixel.y * 0.5);

                float x0 = floor(x * 100.0) / 100.0;
                float x1 = x0 + pixel.x;
                float y0 = floor(y * 100.0) / 100.0;
                float y1 = y0 + pixel.y;

                float s1 = x - x0;
                float s0 = pixel.x - s1;
                float t1 = y - y0;
                float t0 = pixel.y - t1;

                d.x = 
                s0 * (t0 * texture(u_d0, vec2(x0, y0)).x + t1 * texture(u_d0, vec2(x0, y1)).x) +
                s1 * (t0 * texture(u_d0, vec2(x1, y0)).x + t1 * texture(u_d0, vec2(x1, y1)).x);

                gl_FragColor = d;
            }
        `
    },
    project1: {
        fragment: `
            uniform sampler2D u_div;
            uniform sampler2D velX;
            uniform sampler2D velY;

            void main(){
                vec2 pixel = 1.0 / resolution.xy;
                vec2 uv = gl_FragCoord.xy / resolution.xy;

                vec4 div = texture(u_div, uv);
                vec4 top = texture(velY, vec2(uv.x, uv.y + pixel.y));
                vec4 bottom = texture(velY, vec2(uv.x, uv.y - pixel.y));
                vec4 right = texture(velX, vec2(uv.x + pixel.x, uv.y));
                vec4 left = texture(velX, vec2(uv.x - pixel.x, uv.y));

                div.x = -0.5 * (right.x - left.x + top.x - bottom.x);
                
                gl_FragColor = div;
            }
        `
    },
    project2: {
        fragment: `
            uniform sampler2D u_p;

            void main(){
                vec2 pixel = 1.0 / resolution.xy;
                vec2 uv = gl_FragCoord.xy / resolution.xy;

                vec4 p = texture(u_p, uv);
                
                p.x = 0.0;

                gl_FragColor = p;
            }
        `        
    },
    project3: {
        fragment: `
            uniform sampler2D vel;
            uniform sampler2D u_p;
            uniform bool direction;

            void main(){
                vec2 pixel = 1.0 / resolution.xy;
                vec2 uv = gl_FragCoord.xy / resolution.xy;

                vec4 v = texture(vel, uv);

                if(direction){
                    float right = texture(u_p, vec2(uv.x + pixel.x, uv.y)).x;
                    float left = texture(u_p, vec2(uv.x - pixel.x, uv.y)).x;

                    v.x -= 0.5 * (right - left);
                }else{
                    float top = texture(u_p, vec2(uv.x, uv.y + pixel.y)).x;
                    float bottom = texture(u_p, vec2(uv.x, uv.y - pixel.y)).x;

                    v.x -= 0.5 * (top - bottom);
                }

                gl_FragColor = v;
            }
        `
    },
    lin_solve: {
        fragment: `
            uniform float a;
            uniform float c;  
            uniform sampler2D u_x;
            uniform sampler2D u_x0;

            void main(){
                vec2 pixel = 1.0 / resolution.xy;
                vec2 uv = gl_FragCoord.xy / resolution.xy;

                float cRecip = 1.0 / c;

                vec4 x = texture(u_x, uv);
                vec4 x0 = texture(u_x0, uv);

                vec4 top = texture(u_x, vec2(uv.x, uv.y + pixel.y));
                vec4 bottom = texture(u_x, vec2(uv.x, uv.y - pixel.y));
                vec4 right = texture(u_x, vec2(uv.x + pixel.x, uv.y));
                vec4 left = texture(u_x, vec2(uv.x - pixel.x, uv.y));

                x.x = (x0.x + a + (top.x + bottom.x + right.x + left.x)) * cRecip;

                gl_FragColor = x;
            }
        `
    }
}