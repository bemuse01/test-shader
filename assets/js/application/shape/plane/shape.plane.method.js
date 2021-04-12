SHAPE.plane.method = {
    fillTexture(texture){
        const data = texture.image.data

        for(let i = 0; i < data.length / 4; i++){
            const index = i * 4

            // data[index] = Math.random() > 0.9999 ? 2.0 : 0
            data[index] = 0
            data[index + 1] = 0
            data[index + 2] = 0
            data[index + 3] = 0
        }
    }
}