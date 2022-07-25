import { anything, deepEqual, instance, mock, spy, verify, when } from "ts-mockito";
import Dialer from "../../../src/communication/Dialer";

const mockedDialerInstance = mock(Dialer)
when(mockedDialerInstance.sendMessage(anything(), anything(), anything())).thenResolve()

const mockedDialer = spy(Dialer)
when(mockedDialer.getInstance()).thenResolve(instance(mockedDialerInstance))

/**
 * verifies Dialer sendMessage method called once for tx
 * @param channel
 * @param message
 */
const verifySendMessageCalledOnce = (channel: string, message: any): void => {
    verify(mockedDialerInstance.sendMessage(channel, deepEqual(message))).once()
}

/**
 * verifies Dialer sendMessage method called twice for tx
 * @param channel
 * @param message
 */
const verifySendMessageCalledTwice = (channel: string, message: any): void => {
    verify(mockedDialerInstance.sendMessage(channel, deepEqual(message))).twice()
}

/**
 * verifies Dialer sendMessage method called once for tx
 * @param channel
 * @param message
 * @param receiver
 */
const verifySendMessageWithReceiverCalledOnce = (channel: string, message: any, receiver: string): void => {
    verify(mockedDialerInstance.sendMessage(channel, deepEqual(message), receiver)).once()
}

/**
 * verifies Dialer sendMessage method didn't get called once for tx
 * @param channel
 * @param message
 * @param receiver
 */
const verifySendMessageDidntGetCalled = (channel: string, message: any, receiver?: string): void => {
    verify(mockedDialerInstance.sendMessage(channel, deepEqual(message))).never()
}

export {
    verifySendMessageCalledOnce,
    verifySendMessageCalledTwice,
    verifySendMessageWithReceiverCalledOnce,
    verifySendMessageDidntGetCalled
}
