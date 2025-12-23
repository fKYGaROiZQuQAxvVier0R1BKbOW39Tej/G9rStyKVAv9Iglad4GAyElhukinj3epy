class ProcessManager {
    static _processList = []

    static _delta = 0
    static _lastTime = 0

    static register_process_node(node) {
        this._processList.push(node)
    }

    static _ready() {
        console.log("Process manager loaded")
    }

    static _process = (newTime) => {
        if (this._lastTime === 0) {
            this._lastTime = newTime
        }

        this._delta = Math.min(0.05, (newTime - this._lastTime) / 1000)
        this._lastTime = newTime

        for (let i = 0; i < this._processList.length; i++)
            this._processList[i]._process(this._delta)

        requestAnimationFrame(this._process)
    }

    static start_process_loop() {
        requestAnimationFrame(this._process)
    }

    static {
        this._ready()
    }
}