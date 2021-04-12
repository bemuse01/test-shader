new Vue({
    el: '#wrap',
    data(){
        return{

        }
    },
    mounted(){
        this.init()
    },
    methods: {
        // init
        init(){
            this.initThree()
            this.animate()

            window.addEventListener('resize', this.onWindowResize, false)
        },


        // three
        initThree(){
            OBJECT.app = new APP.build()

            this.createObject(OBJECT.app)
        },
        resizeThree(){
            const {app} = OBJECT

            for(let i in OBJECT) OBJECT[i].resize({app})
        },
        renderThree(){
            const {app} = OBJECT
            
            for(let i in OBJECT) OBJECT[i].animate({app})
        },
        createObject(app){
            this.createShape(app)
        },
        createShape(app){
            OBJECT.shape = new SHAPE.build(app)
        },


        // event
        onWindowResize(){
            WIDTH = window.innerWidth
            HEIGHT = window.innerHeight

            this.resizeThree()
        },


        // render
        render(){
            this.renderThree()
        },
        animate(){
            this.render()
            requestAnimationFrame(this.animate)
        }
    }
})