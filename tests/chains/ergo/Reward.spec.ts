import { EventTrigger } from "../../../src/models/Models";
import TestBoxes from "./testUtils/TestBoxes";
import Reward from "../../../src/chains/ergo/Reward";
import { expect } from "chai";
import { CoveringErgoBoxes } from "../../../src/chains/ergo/models/Interfaces";
import { beforeEach } from "mocha";
import { mockGetCoveringErgAndTokenForErgoTree, resetMockedExplorerApi } from "./mocked/MockedExplorer";
import Utils from "../../../src/chains/ergo/helpers/Utils";
import { mockGetEventBox, mockGetEventValidCommitments, resetMockedRewardBoxes } from "./mocked/MockedRewardBoxes";
import { anything } from "ts-mockito";

describe("Reward", () => {
    const testBankAddress = "9hPoYNQwVDbtAyt5uhYyKttye7ZPzZ7ePcc6d2rgKr9fiZm6DhD" // TODO: use test config
    const testBankErgoTree: string = Utils.addressStringToErgoTreeString(testBankAddress)

    describe("generateTransaction", () => {
        // mock getting boxes
        const bankBoxes: CoveringErgoBoxes = TestBoxes.mockBankBoxes()
        const eventBoxAndCommitments = TestBoxes.mockEventBoxWithSomeCommitments()

        beforeEach("mock ExplorerApi", function() {
            resetMockedExplorerApi()
            mockGetCoveringErgAndTokenForErgoTree(testBankErgoTree, bankBoxes)
            resetMockedRewardBoxes()
            mockGetEventBox(anything(), eventBoxAndCommitments[0])
            mockGetEventValidCommitments(anything(), eventBoxAndCommitments.slice(1))
        })

        /**
         * Target: testing generateTransaction
         * Dependencies:
         *    ExplorerApi
         *    RewardBoxes
         * Expected Output:
         *    The function should construct a valid tx successfully
         *    It should also verify it successfully
         */
        it("should generate an erg distribution tx and verify it successfully", async () => {
            // mock erg payment event
            const mockedEvent: EventTrigger = TestBoxes.mockErgRewardEventTrigger()

            // run test
            const reward = new Reward()
            const tx = await reward.generateTransaction(mockedEvent)

            // verify tx
            const isValid = reward.verifyTransactionWithEvent(tx, mockedEvent)
            expect(isValid).to.be.true
        })

        /**
         * Target: testing generateTransaction
         * Dependencies:
         *    ExplorerApi
         *    RewardBoxes
         * Expected Output:
         *    The function should construct a valid tx successfully
         *    It should also verify it successfully
         */
        it("should generate a token distribution tx and verify it successfully", async () => {
            // mock token payment event
            const mockedEvent: EventTrigger = TestBoxes.mockTokenRewardEventTrigger()

            // run test
            const reward = new Reward()
            const tx = await reward.generateTransaction(mockedEvent)

            // verify tx
            const isValid = reward.verifyTransactionWithEvent(tx, mockedEvent)
            expect(isValid).to.be.true
        })

    })

    describe("verifyTransactionWithEvent", () => {
        // mock getting boxes
        const eventBoxAndCommitments = TestBoxes.mockEventBoxWithSomeCommitments()

        beforeEach("mock ExplorerApi", function() {
            resetMockedRewardBoxes()
            mockGetEventBox(anything(), eventBoxAndCommitments[0])
            mockGetEventValidCommitments(anything(), eventBoxAndCommitments.slice(1))
        })

        /**
         * Target: testing verifyTransactionWithEvent
         * Dependencies:
         *    RewardBoxes
         * Expected Output:
         *    It should NOT verify the transaction
         */
        it("should reject an erg reward distribution tx that transferring token", () => {
            // mock erg payment event
            const mockedEvent: EventTrigger = TestBoxes.mockErgRewardEventTrigger()
            const tx = TestBoxes.mockTokenTransferringErgDistributionTransaction(mockedEvent, eventBoxAndCommitments)

            // run test
            const reward = new Reward()
            const isValid = reward.verifyTransactionWithEvent(tx, mockedEvent)
            expect(isValid).to.be.false
        })

        /**
         * Target: testing verifyTransactionWithEvent
         * Dependencies:
         *    RewardBoxes
         * Expected Output:
         *    It should NOT verify the transaction
         */
        it("should reject a reward distribution tx that transferring to wrong WID", () => {
            // mock erg payment event
            const mockedEvent: EventTrigger = TestBoxes.mockTokenRewardEventTrigger()
            const tx = TestBoxes.mockTransferToIllegalWIDDistributionTransaction(mockedEvent, eventBoxAndCommitments)

            // run test
            const reward = new Reward()
            const isValid = reward.verifyTransactionWithEvent(tx, mockedEvent)
            expect(isValid).to.be.false
        })

        /**
         * Target: testing verifyTransactionWithEvent
         * Dependencies:
         *    RewardBoxes
         * Expected Output:
         *    It should NOT verify the transaction
         */
        it("should reject a reward distribution tx that missing a valid commitment box when distributing rewards", () => {
            // mock erg payment event
            const mockedEvent: EventTrigger = TestBoxes.mockTokenRewardEventTrigger()
            const tx = TestBoxes.mockMissingValidCommitmentDistributionTransaction(mockedEvent, eventBoxAndCommitments.slice(0, eventBoxAndCommitments.length - 1))

            // run test
            const reward = new Reward()
            const isValid = reward.verifyTransactionWithEvent(tx, mockedEvent)
            expect(isValid).to.be.false
        })

        /**
         * Target: testing verifyTransactionWithEvent
         * Dependencies:
         *    RewardBoxes
         * Expected Output:
         *    It should NOT verify the transaction
         */
        it("should reject a reward distribution tx that change box address is not bank address", () => {
            // mock erg payment event
            const mockedEvent: EventTrigger = TestBoxes.mockTokenRewardEventTrigger()
            const tx = TestBoxes.mockIllegalChangeBoxDistributionTransaction(mockedEvent, eventBoxAndCommitments)

            // run test
            const reward = new Reward()
            const isValid = reward.verifyTransactionWithEvent(tx, mockedEvent)
            expect(isValid).to.be.false
        })

        /**
         * Target: testing verifyTransactionWithEvent
         * Dependencies:
         *    RewardBoxes
         * Expected Output:
         *    It should NOT verify the transaction
         */
        it("should reject a reward distribution tx that transferring wrong token", () => {
            // mock erg payment event
            const mockedEvent: EventTrigger = TestBoxes.mockTokenRewardEventTrigger()
            const tx = TestBoxes.mockWrongTokenDistributionTransaction(mockedEvent, eventBoxAndCommitments)

            // run test
            const reward = new Reward()
            const isValid = reward.verifyTransactionWithEvent(tx, mockedEvent)
            expect(isValid).to.be.false
        })

        /**
         * Target: testing verifyTransactionWithEvent
         * Dependencies:
         *    RewardBoxes
         * Expected Output:
         *    It should NOT verify the transaction
         */
        it("should reject a reward distribution tx that transferring wrong amount of target token", () => {
            // mock erg payment event
            const mockedEvent: EventTrigger = TestBoxes.mockTokenRewardEventTrigger()
            const tx = TestBoxes.mockWrongAmountTokenDistributionTransaction(mockedEvent, eventBoxAndCommitments)

            // run test
            const reward = new Reward()
            const isValid = reward.verifyTransactionWithEvent(tx, mockedEvent)
            expect(isValid).to.be.false
        })

    })

})