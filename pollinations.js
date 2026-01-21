class Pollinations {
    constructor(k) {
        self.key = k
        class Model {
            name = null
            supportsTools = null
            constructor(modelJSON) {
                self.model = modelJSON
                this.name = modelJSON.name
                this.supportsTools = modelJSON.tools
            }
            async ask(query, model, sysprompt) {
                const autofill = {
                    query: query,
                    model: (() => {
                        if (model !== undefined) {
                            return model
                        } else {
                            return "openai"
                        }
                    })(),
                    sysprompt: (() => {
                        if (sysprompt !== undefined) {
                            return sysprompt
                        } else {
                            return ""
                        }
                    })()
                }
                const modelRequest = await fetch(`https://gen.pollinations.ai/text/${encodeURI(query)}?model=${encodeURIComponent(autofill.model)}&system=${encodeURIComponent(autofill.sysprompt)}`, {
                    headers: {
                        Authorization: "Bearer " + self.key
                    }
                })
                const data = await modelRequest.text()
                return data
            }
        }
        self.modelClass = Model
    }
    async discoverTextModels() {
        const modelRequest = await fetch("https://gen.pollinations.ai/text/models", {
            headers: {
                Authorization: "Bearer " + self.key
            }
        })
        const models = await modelRequest.json()
        const modelClasses = []
        models.forEach(model => {
            modelClasses.push(new self.modelClass(model))
        });
        return modelClasses
    }
}







async function run() {
    console.log("loading models")
    const pollen = new Pollinations("sk_86vagR3T1ekSrnm1Aqnju3AvA16whdZx");
    const models = await pollen.discoverTextModels()
    console.log("loaded")
    models.forEach(model => {
        (async () => {
            if (model.supportsTools == true) {
                console.log(model.name)
            }
        })();
    });
}
run()