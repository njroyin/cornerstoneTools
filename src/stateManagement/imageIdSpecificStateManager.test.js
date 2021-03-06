import externalModules from './../externalModules.js';
import { newImageIdSpecificToolStateManager } from './imageIdSpecificStateManager.js';

jest.mock('./../externalModules.js');

describe('imageIdSpecificStateManager.add', () => {
  it('creates the toolState and adds the data', () => {
    const stateManager = newImageIdSpecificToolStateManager();
    const toolType = 'TestTool';
    const imageId = 'abc123';
    const testElement = {
      image: {
        imageId,
      },
    };

    externalModules.cornerstone.getEnabledElement.mockImplementationOnce(
      () => testElement
    );
    stateManager.add(testElement, toolType, 'data1');

    const allToolState = stateManager.saveToolState();

    expect(allToolState[imageId][toolType].data).toContain('data1');
  });

  it('adds data to the existing toolState', () => {
    const stateManager = newImageIdSpecificToolStateManager();
    const toolType = 'TestTool';
    const imageId = 'abc123';
    const testElement = {
      image: {
        imageId,
      },
    };

    externalModules.cornerstone.getEnabledElement.mockImplementationOnce(
      () => testElement
    );

    // Setup with some intial data
    stateManager.restoreImageIdToolState(imageId, {
      [toolType]: { data: ['initialData'] },
    });
    // Add more data
    stateManager.add(testElement, toolType, 'addedData');

    // Check the results
    const allToolState = stateManager.saveToolState();

    expect(allToolState[imageId][toolType].data).toEqual(
      expect.arrayContaining(['initialData', 'addedData'])
    );
  });

  describe('when the image is not yet defined', () => {
    it('returns without adding the data', () => {
      const stateManager = newImageIdSpecificToolStateManager();
      const toolType = 'TestTool';
      const imageId = 'abc123';
      const testElement = {
        image: undefined,
      };

      externalModules.cornerstone.getEnabledElement.mockImplementationOnce(
        () => testElement
      );

      // Add more data
      stateManager.add(testElement, toolType, 'testData');

      // Check the results
      const allToolState = stateManager.saveToolState();

      expect(allToolState[imageId]).toBeUndefined();
    });
  });
});
