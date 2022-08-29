import React from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { thunkActions } from '../../../data/redux';
import VideoSettingsModal from './VideoSettingsModal';
// import SelectVideoModal from './SelectVideoModal';
import * as module from './VideoEditorModal';

export const hooks = {
  initialize: (dispatch) => {
    React.useEffect(() => {
      dispatch(thunkActions.video.loadVideoData());
    }, []);
  },
};

const VideoEditorModal = ({
  close,
  error,
  isOpen,
}) => {
  const dispatch = useDispatch();
  module.hooks.initialize(dispatch);
  return (
    <VideoSettingsModal {...{ close, error, isOpen }} />
  );
  // TODO: add logic to show SelectVideoModal if no selection
};

VideoEditorModal.defaultProps = {
  error: {
    duration: null,
    handout: null,
    license: null,
    thumbnail: null,
    transcripts: null,
    videoSource: null,
  },
};
VideoEditorModal.propTypes = {
  close: PropTypes.func.isRequired,
  error: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
};
export default VideoEditorModal;
