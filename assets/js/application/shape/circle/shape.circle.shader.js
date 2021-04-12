SHAPE.circle.shader = {
    vertex: `
        varying vec3 v_position;
        varying vec2 v_uv;

        void main(){
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            v_position = position;
            v_uv = uv;
        }
    `,


    // theta color
    // fragment: `
    //     uniform vec3 color;
    //     varying vec3 v_position;

    //     void main(){
    //         vec3 vec_x = vec3(1.0, 0, 0);
    //         float d = dot(vec_x, v_position);
    //         float l = length(vec_x) * length(v_position);
    //         float theta = acos(d / l);

    //         float x = cos(theta) * 0.5 + 0.5;
    //         float y = sin(theta) * 0.5 + 0.5;

    //         vec3 r_color = vec3(x, y, 0);
 
    //         gl_FragColor = vec4(r_color, 1.0);
    //     }
    // `


    // random opacity
    // fragment: `
    //     uniform vec3 color;
    //     varying vec3 v_position;

    //     float random(vec2 _st){
    //         return fract(sin(dot(_st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    //     }

    //     float normalize_f(float x, float a, float b, float min, float max){
    //         return (b - a) * (x - min) / (max - min) + a;
    //     }
        
    //     void main(){
    //         float r = random(v_position.xy);
    //         float n = normalize_f(r, 0.0, 1.0, -1.0, 1.0);

    //         gl_FragColor = vec4(color, r);
    //     }
    // `


    // varying uv
    // fragment: `
    //     uniform vec3 color;
    //     varying vec3 v_position;
    //     varying vec2 v_uv;

    //     void main(){
    //         vec2 top = v_uv + vec2(0, 1);
    //         vec2 bottom = v_uv - vec2(0, 1);
    //         vec2 right = v_uv + vec2(1, 0);
    //         vec2 left = v_uv - vec2(1, 0);
            
    //         gl_FragColor = vec4(0, v_uv, 1.0);
    //     }
    // `


    // texture and apply gaussian blur
    fragment: `
        uniform vec3 color;
        uniform sampler2D u_texture;
        uniform float u_filter[9];

        varying vec3 v_position;
        varying vec2 v_uv;

        void main(){
            vec2 pixel = vec2(1.0, 1.0) / vec2(textureSize(u_texture, 0));
            // vec2 pixel = vec2(1.0, 1.0) / 400.0;

            // vec4 t_color = texture(u_texture, v_uv);
            vec4 t_color =
                texture2D(u_texture, v_uv + pixel * vec2(-1, -1)) * u_filter[0] +
                texture2D(u_texture, v_uv + pixel * vec2( 0, -1)) * u_filter[1] +
                texture2D(u_texture, v_uv + pixel * vec2( 1, -1)) * u_filter[2] +
                texture2D(u_texture, v_uv + pixel * vec2(-1,  0)) * u_filter[3] +
                texture2D(u_texture, v_uv + pixel * vec2( 0,  0)) * u_filter[4] +
                texture2D(u_texture, v_uv + pixel * vec2( 1,  0)) * u_filter[5] +
                texture2D(u_texture, v_uv + pixel * vec2(-1,  1)) * u_filter[6] +
                texture2D(u_texture, v_uv + pixel * vec2( 0,  1)) * u_filter[7] +
                texture2D(u_texture, v_uv + pixel * vec2( 1,  1)) * u_filter[8] ;

            gl_FragColor = vec4(t_color.xyz, 1.0);
        }
    `
}