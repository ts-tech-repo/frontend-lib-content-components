import React from 'react';
import { shallow } from 'enzyme';

import { formatMessage } from '../../../../../../../testUtils';
import { selectors } from '../../../../../../data/redux';
import { ThumbnailWidget, mapStateToProps, mapDispatchToProps } from '.';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(() => ({ thumbnail: ['error.thumbnail', jest.fn().mockName('error.setThumbnail')] })),
}));
jest.mock('../../../../../../data/redux', () => ({
  actions: {
    video: {
      updateField: jest.fn().mockName('actions.video.updateField'),
    },
  },
  selectors: {
    video: {
      allowThumbnailUpload: jest.fn(state => ({ allowThumbnailUpload: state })),
      thumbnail: jest.fn(state => ({ thumbnail: state })),
      videoId: jest.fn(state => ({ videoId: state })),
    },
    app: {
      isLibrary: jest.fn(state => ({ isLibrary: state })),
    },
  },
}));

describe('ThumbnailWidget', () => {
  const props = {
    error: {},
    title: 'tiTLE',
    intl: { formatMessage },
    isLibrary: false,
    allowThumbnailUpload: false,
    thumbnail: null,
    videoId: '',
    updateField: jest.fn().mockName('args.updateField'),
  };

  describe('snapshots', () => {
    test('snapshots: renders as expected with default props', () => {
      expect(
        shallow(<ThumbnailWidget {...props} />),
      ).toMatchSnapshot();
    });
    test('snapshots: renders as expected with isLibrary true', () => {
      expect(
        shallow(<ThumbnailWidget {...props} isLibrary />),
      ).toMatchSnapshot();
    });
    test('snapshots: renders as expected with a thumbnail provided', () => {
      expect(
        shallow(<ThumbnailWidget {...props} thumbnail="sOMeUrl" videoId="e0466f70-9fb0-40d0-bcd0-3a3f6e9fa890" />),
      ).toMatchSnapshot();
    });
    test('snapshots: renders as expected where thumbnail uploads are allowed', () => {
      expect(
        shallow(<ThumbnailWidget {...props} thumbnail="sOMeUrl" allowThumbnailUpload />),
      ).toMatchSnapshot();
    });
    test('snapshots: renders as expected where videoId is valid', () => {
      expect(
        shallow(<ThumbnailWidget {...props} thumbnail="sOMeUrl" allowThumbnailUpload videoId="e0466f70-9fb0-40d0-bcd0-3a3f6e9fa890" />),
      ).toMatchSnapshot();
    });
    test('snapshots: renders as expected where videoId is valid and no thumbnail', () => {
      expect(
        shallow(<ThumbnailWidget {...props} allowThumbnailUpload videoId="e0466f70-9fb0-40d0-bcd0-3a3f6e9fa890" />),
      ).toMatchSnapshot();
    });
  });
  describe('mapStateToProps', () => {
    const testState = { A: 'pple', B: 'anana', C: 'ucumber' };
    test('isLibrary from app.isLibrary', () => {
      expect(
        mapStateToProps(testState).isLibrary,
      ).toEqual(selectors.app.isLibrary(testState));
    });
    test('allowThumbnailUpload from video.allowThumbnailUpload', () => {
      expect(
        mapStateToProps(testState).allowThumbnailUpload,
      ).toEqual(selectors.video.allowThumbnailUpload(testState));
    });
    test('thumbnail from video.thumbnail', () => {
      expect(
        mapStateToProps(testState).thumbnail,
      ).toEqual(selectors.video.thumbnail(testState));
    });
    test('videoId from video.videoId', () => {
      expect(
        mapStateToProps(testState).videoId,
      ).toEqual(selectors.video.videoId(testState));
    });
  });
  describe('mapDispatchToProps', () => {
    test('mapDispatchToProps to equal an empty object', () => {
      expect(mapDispatchToProps).toEqual({});
    });
  });
});
