import config from "config";

const getConfigIntKeyOrDefault = (key: string, defaultValue: number) => {
    const val: string = config.get(key)
    if (val) {
        const valNum = parseInt(val)
        if (isNaN(valNum)) {
            return defaultValue;
        }
        return valNum
    }
    return defaultValue
}

class Configs {

    static secret: Uint8Array = Uint8Array.from(Buffer.from(config.get?.('secret') as string, 'hex'))

    static expressPort = config.get<number>('express.port')
    private static expressBodyLimitValue = config.get<number>('express.jsonBodyLimit')
    static expressBodyLimit = `${this.expressBodyLimitValue}mb`

    // token configs
    static ergoRWT = config.get<string>('tokens.ergoRWT')
    static cardanoRWT = config.get<string>('tokens.cardanoRWT')
    static multiSigTimeout: number = getConfigIntKeyOrDefault('multiSigTimeout', 15 * 60 * 1000)

    // tss configs
    static tssUrl = config.get<string>('tss.url')
    static tssPort = config.get<string>('tss.port')
    static tssTimeout = config.get<number>('tss.timeout')
    static tssCallBackUrl = `localhost:${this.expressPort}/tssSign`

}

export default Configs
