SHAPE.plane4.method = {
    createAttribute(param, size){
        const position = [], coord = []

        const w = Math.sqrt(param.count)
        const h = w

        for(let i = 0; i < param.count; i++){
            // const x = Math.random() * size.w - size.w / 2
            // const y = Math.random() * size.h - size.h / 2

            position.push(0, 0, 0)

            const u = (i % w) / w
            const v = Math.floor(i / h) / h

            coord.push(u, v)
        }

        return {position: new Float32Array(position), coord: new Float32Array(coord)}
    },
    fillTexture(texture, size){
        const data = texture.image.data

        // console.log(texture.image)

        for(let i = 0; i < data.length / 4; i++){
            const index = i * 4

            // xy === position
            data[index] = Math.random() * size.w - size.w / 2
            data[index + 1] = Math.random() * size.h - size.h / 2

            // zw === velocity
            data[index + 2] = Math.random() * 1 - 0.5
            data[index + 3] = Math.random() * -0.5 - 0.5

            // data[index + 2] = Math.random() * 2 - 1
            // data[index + 3] = Math.random() * 2 - 1
        }
    },
    fillSizeTexture(texture, psize){
        const data = texture.image.data

        for(let i = 0; i < data.length / 4; i++){
            const index = i * 4

            data[index] = psize
            data[index + 1] = 0
            data[index + 2] = 0
            data[index + 3] = 0
        }
    }
}