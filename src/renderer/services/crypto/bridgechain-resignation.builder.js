import * as MagistrateCrypto from '@swipechain/core-magistrate-crypto'
import { TRANSACTION_TYPES } from '@config'
import store from '@/store'
import { CryptoUtils } from './utils'
import { TransactionSigner } from './transaction-signer'

export class BridgechainResignationBuilder {
  static async build (
    {
      address,
      fee,
      bridgechainId,
      passphrase,
      secondPassphrase,
      wif,
      networkWif,
      multiSignature,
      nonce
    },
    isAdvancedFee = false,
    returnObject = false
  ) {
    if (!store.getters['session/network'].constants.aip11) {
      throw new Error('AIP-11 transaction not supported on network')
    }

    const staticFee = store.getters['transaction/staticFee'](
      TRANSACTION_TYPES.GROUP_2.BRIDGECHAIN_RESIGNATION,
      2
    )
    if (!isAdvancedFee && fee.gt(staticFee)) {
      throw new Error(
               `Bridgechain Resignation fee should be smaller than ${staticFee}`
      )
    }

    const transaction = new MagistrateCrypto.Builders.BridgechainResignationBuilder()
      .bridgechainResignationAsset(bridgechainId)
      .fee(fee)

    passphrase = CryptoUtils.normalizePassphrase(passphrase)
    secondPassphrase = CryptoUtils.normalizePassphrase(secondPassphrase)

    return TransactionSigner.sign(
      {
        address,
        transaction,
        passphrase,
        secondPassphrase,
        wif,
        networkWif,
        multiSignature,
        nonce
      },
      returnObject
    )
  }
}
