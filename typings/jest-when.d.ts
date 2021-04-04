// rewrite of the jest-when types to remove requirement that the function
// passed into `when` is annotated as a jest.MockInstance so that we can do:
//
// import { when } from 'jest-when
// import { getFoo } from '../getFoo'
// jest.mock('../getFoo')
// when(getFoo).calledWith('foo').mockReturnValue('bar')
//
// Notice the lack of any need to cast `getFoo`. `when` will complain loudly
// at runtime if you forget to `jest.mock`.

declare module 'jest-when' {
  export interface WhenMock<T = any, Y extends any[] = any>
    extends jest.MockInstance<T, Y> {
    calledWith: (...matchers: Y) => this
    expectCalledWith: (...matchers: Y) => this
    mockReturnValue: (value: T) => this
    mockReturnValueOnce: (value: T) => this
    mockResolvedValue: (value: jest.ResolvedValue<T>) => this
    mockResolvedValueOnce: (value: jest.ResolvedValue<T>) => this
    mockRejectedValue: (value: jest.RejectedValue<T>) => this
    mockRejectedValueOnce: (value: jest.RejectedValue<T>) => this
    mockImplementation: (fn: (...args: Y) => T) => this
    mockImplementationOnce: (fn?: (...args: Y) => T) => this
  }

  export type When = <T, Y extends any[]>(
    fn: (...args: Y) => T
  ) => WhenMock<T, Y>

  export const when: When
  export function resetAllWhenMocks(): void
  export function verifyAllWhenMocksCalled(): void
}
