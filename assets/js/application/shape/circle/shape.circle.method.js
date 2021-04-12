SHAPE.circle.method = {
    createTexture(){
        const width = 512
        const height = 512

        const size = width * height
        const data = new Uint8Array(size * 3)

        for(let i = 0; i < size; i++){
            const index = i * 3

            const r = Math.floor(Math.random() * 150 + 105)
            const g = Math.floor(Math.random() * 150 + 105)
            const b = Math.floor(Math.random() * 150 + 105)

            data[index] = r
            data[index + 1] = g
            data[index + 2] = b
        }

        return new THREE.DataTexture(data, width, height, THREE.RGBFormat)
    }
}