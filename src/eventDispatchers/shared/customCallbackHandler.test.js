import customCallbackHandler from './customCallbackHandler.js';
import { getters, state } from './../../store/index.js';
import getActiveToolsForElement from './../../store/getActiveToolsForElement.js';

jest.mock('./../../store/index.js', () => ({
  state: {
    isToolLocked: false,
    tools: [
      {
        aDifferentCustomFunctionName: jest.fn()
      },
      {
        customFunctionName: jest.fn()
      },
      {
        customFunctionName: jest.fn()
      }
    ]
  },
  getters: {
    touchTools: jest.fn(),
    mouseTools: jest.fn()
  }
}));

jest.mock('./../../store/getActiveToolsForElement.js', () => jest.fn());

describe('customCallbackHandler.js', () => {
  const firstToolWithCustomFunction = state.tools[1];
  const customFunction = 'customFunctionName';
  const fakeEvent = {
    detail: {
      element: {}
    }
  };

  beforeEach(() => {
    state.isToolLocked = false;

    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('returns false when "isToolLocked" is true', () => {
    state.isToolLocked = true;
    const result = customCallbackHandler(null, null, null);

    expect(result).toBe(false);
  });

  it('does not call a tool\'s customFunction when "isToolLocked" is true', () => {
    state.isToolLocked = true;
    customCallbackHandler(null, null, null);

    expect(
      firstToolWithCustomFunction.customFunctionName
    ).toHaveBeenCalledTimes(0);
  });

  it('gets mouse tools when handlerType is "Mouse"', () => {
    const handlerType = 'Mouse';

    getActiveToolsForElement.mockReturnValueOnce([]);
    customCallbackHandler(handlerType, customFunction, fakeEvent);

    expect(getters.mouseTools).toHaveBeenCalled();
  });

  it('gets touch tools when handlerType is "Touch"', () => {
    const handlerType = 'Touch';

    getActiveToolsForElement.mockReturnValueOnce([]);
    customCallbackHandler(handlerType, customFunction, fakeEvent);

    expect(getters.touchTools).toHaveBeenCalled();
  });

  it('returns false when "getActiveToolsForElements" returns an empty array', () => {
    getActiveToolsForElement.mockReturnValueOnce([]);
    const result = customCallbackHandler(null, customFunction, fakeEvent);

    expect(result).toBe(false);
  });

  it('returns false when no tools have a function with the customFunction name', () => {
    const toolWithoutCustomFunction = state.tools[0];

    getActiveToolsForElement.mockReturnValueOnce([toolWithoutCustomFunction]);
    const result = customCallbackHandler(null, customFunction, fakeEvent);

    expect(result).toBe(false);
  });

  it('calls the customFunction on the first active tool that implements it', () => {
    getActiveToolsForElement.mockReturnValueOnce(state.tools);
    customCallbackHandler(null, customFunction, fakeEvent);

    expect(firstToolWithCustomFunction.customFunctionName).toBeCalledWith(
      fakeEvent
    );
  });
});
