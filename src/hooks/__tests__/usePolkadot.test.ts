import {usePolkadot} from '@/hooks/usePolkadot'
import {renderHook} from '@testing-library/react-hooks'

jest.mock('@polkadot/extension-dapp', () => ({
  ...jest.requireActual('@polkadot/extension-dapp'),
  isWeb3Injected: false,
}))

describe('usePolkadot', () => {
  it('should return error when isWeb3Injected is false', () => {
    const {result} = renderHook(() => usePolkadot())

    expect(result.current.error).toEqual(new Error('NO_WEB3_INJECTED'))
  })
})
