SHAPE.param = class{
    constructor(param = {}){
        this.fov = param.fov || 60
        this.near = param.near || 0.1
        this.far = param.far || 10000
        this.pos = param.pos || 1000
    }
}