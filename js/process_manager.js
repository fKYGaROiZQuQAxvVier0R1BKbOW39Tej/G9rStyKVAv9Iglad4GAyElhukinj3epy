class ProcessManager {
    // VARIABLES
    static #registeredNodes = []
    static #delta = 0
    static #lastTime = 0
    

    // PUBLIC
    static register_process_node(node) {
        this.#registeredNodes.push(node)
    }
    
    static unregister_process_node(node) {
        this.#registeredNodes.splice(this.#registeredNodes.indexOf(node), 1)
    }
    
    static start_process_loop() {
        this._process(0)
    }
    

    // PRIVATE
    static #ready() {
        console.log("Process manager loaded")
    }

    static _process = (now) => {
        this.#delta = Math.min(50, now - this.#lastTime)
        this.#lastTime = now
        this.#registeredNodes.forEach(node => node._process(this.#delta))
        requestAnimationFrame(this._process)
    }

    
    // INIT
    static {
        this.#ready()
    }
}