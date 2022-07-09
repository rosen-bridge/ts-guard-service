import { PaymentTransactionModel, EventTriggerModel } from "./Interfaces";


/* tslint:disable:max-classes-per-file */
class EventTrigger implements EventTriggerModel {

    fromChain: string
    toChain: string
    fromAddress: string
    toAddress: string
    amount: string
    bridgeFee: string
    networkFee: string
    sourceChainTokenId: string
    targetChainTokenId: string
    sourceTxId: string
    sourceBlockId: string
    WIDs: string[]

    constructor(fromChain: string, toChain: string, fromAddress: string, toAddress: string, amount: string,
                bridgeFee: string, networkFee: string, sourceChainTokenId: string, targetChainTokenId: string,
                sourceTxId: string, sourceBlockId: string, WIDs: string[]) {
        this.fromChain = fromChain
        this.toChain = toChain
        this.fromAddress = fromAddress
        this.toAddress = toAddress
        this.amount = amount
        this.bridgeFee = bridgeFee
        this.networkFee = networkFee
        this.sourceChainTokenId = sourceChainTokenId
        this.targetChainTokenId = targetChainTokenId
        this.sourceTxId = sourceTxId
        this.sourceBlockId = sourceBlockId
        this.WIDs = WIDs
    }

    /**
     * @return id of event trigger
     */
    getId = () => {
        return this.sourceTxId
    }

}

class PaymentTransaction implements PaymentTransactionModel {

    network: string
    txId: string
    eventId: string
    txBytes: Uint8Array

    constructor(network: string, txId: string, eventId: string, txBytes: Uint8Array) {
        this.network = network
        this.txId = txId
        this.eventId = eventId
        this.txBytes = txBytes
    }

    /**
     * @return transaction hex string
     */
    getTxHexString = () => {
        return Buffer.from(this.txBytes).toString('hex')
    }

    /**
     * signs the json data alongside guardId
     * @param creatorId id of the creator guard
     * @return signature
     */
    declare signMetaData: (creatorId: number) => string // TODO: implement this (when migrating service from scala to ts)

    /**
     * verifies the signature over json data alongside guardId
     * @param creatorId id of the creator guard
     * @param signerId id of the signer guard
     * @param msgSignature hex string signature over json data alongside guardId
     * @return true if signature verified
     */
    declare verifyMetaDataSignature: (creatorId: number, signerId: number, msgSignature: string) => boolean // TODO: implement this (when migrating service from scala to ts)

}

export {
    EventTrigger,
    PaymentTransaction
}
