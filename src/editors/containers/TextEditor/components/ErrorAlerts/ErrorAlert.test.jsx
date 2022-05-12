import React from 'react';
import { shallow } from 'enzyme';
import * as module from './ErrorAlert';
import { MockUseState } from '../../../../../testUtils';

const { ErrorAlert } = module;

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useRef: jest.fn(val => ({ current: val })),
  useEffect: jest.fn(),
  useCallback: (cb, prereqs) => ({ cb, prereqs }),
}));

const state = new MockUseState(module.hooks);
let hook;
const testValue = 'testVALUE';

describe('ErrorAlert component', () => {
  describe('Hooks', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    describe('state hooks', () => {
      state.testGetter(state.keys.isDismissed);
    });
    describe('using state', () => {
      beforeEach(() => { state.mock(); });
      afterEach(() => { state.restore(); });
      describe('dismissalHooks', () => {
        const props = {
          dismissError: jest.fn(),
          isError: testValue,
        };
        beforeEach(() => {
          hook = module.hooks.dismissalHooks(props);
        });
        it('returns isDismissed value, initialized to false', () => {
          expect(state.stateVals.isDismissed).toEqual(hook.isDismissed);
        });
        test('dismissAlert sets isDismissed to true and calls dismissError', () => {
          hook.dismissAlert();
          expect(state.setState.isDismissed).toHaveBeenCalledWith(true);
          expect(props.dismissError).toHaveBeenCalled();
        });
        test('On Render, calls setIsDismissed', () => {
          expect(React.useEffect.mock.calls.length).toEqual(1);
          const [cb, prereqs] = React.useEffect.mock.calls[0];
          expect(prereqs[0]).toEqual(testValue);
          cb();
          expect(state.setState.isDismissed).toHaveBeenCalledWith(state.stateVals.isDismissed && !testValue);
        });
      });
    });
  });
  describe('Component', () => {
    describe('Snapshots', () => {
      let props;
      beforeAll(() => {
        props = {
          dismissError: jest.fn(),
          hideHeading: false,
          isError: false,
        };
        jest.spyOn(module.hooks, 'dismissalHooks').mockImplementation((value) => ({ isError: value }));
      });
      afterAll(() => {
        jest.clearAllMocks();
      });
      test('snapshot:  is Null when no error (ErrorAlert)', () => {
        expect(shallow(<ErrorAlert {...props}> <p> An Error Message </p> </ErrorAlert>)).toMatchSnapshot();
      });
      test('snapshot: Loads children and component when error (ErrorAlert)', () => {
        expect(shallow(<ErrorAlert {...props} isError> <p> An Error Message </p> </ErrorAlert>)).toMatchSnapshot();
      });
      test('snapshot: Does not load heading when hideHeading is true', () => {
        expect(shallow(<ErrorAlert {...props} hideHeading> <p> An Error Message </p> </ErrorAlert>));
      });
    });
  });
});
