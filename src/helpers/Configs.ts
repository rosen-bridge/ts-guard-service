import config from "config";

class Configs {

    static expressPort = 8080

    // token configs
    static ergoRWT = config.get<string>('tokens.ergoRWT')
    static cardanoRWT = config.get<string>('tokens.cardanoRWT')

    // tss configs
    static tssUrl = config.get<string>('tss.url')
    static tssPort = config.get<string>('tss.port')
    static tssTimeout = config.get<number>('tss.timeout')
    static tssCallBackUrl = `localhost:${this.expressPort}/tssSign`

}

export default Configs
