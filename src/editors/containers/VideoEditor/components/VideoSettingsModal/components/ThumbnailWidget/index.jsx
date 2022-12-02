import React from 'react';
import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  injectIntl,
  intlShape,
} from '@edx/frontend-platform/i18n';
import {
  Image,
  Stack,
  Button,
  Icon,
  IconButtonWithTooltip,
  Alert,
} from '@edx/paragon';
import { Delete, FileUpload } from '@edx/paragon/icons';

import { selectors } from '../../../../../../data/redux';
import { acceptedImgKeys } from './constants';
import * as hooks from './hooks';
import messages from './messages';

import CollapsibleFormWidget from '../CollapsibleFormWidget';
import FileInput from '../../../../../../sharedComponents/FileInput';
import ErrorAlert from '../../../../../../sharedComponents/ErrorAlerts/ErrorAlert';
import { ErrorContext } from '../../../../hooks';

/**
 * Collapsible Form widget controlling video thumbnail
 */
export const ThumbnailWidget = ({
  // injected
  intl,
  // redux
  isLibrary,
  allowThumbnailUpload,
  thumbnail,
  videoType,
}) => {
  const dispatch = useDispatch();
  const [error] = React.useContext(ErrorContext).thumbnail;
  const imgRef = React.useRef();
  const [thumbnailSrc, setThumbnailSrc] = React.useState(thumbnail);
  const { fileSizeError } = hooks.fileSizeError();
  const fileInput = hooks.fileInput({
    setThumbnailSrc,
    imgRef,
    fileSizeError,
  });
  const deleteThumbnail = hooks.deleteThumbnail({ dispatch });
  const isEdxVideo = videoType === 'edxVideo';
  const getSubtitle = () => {
    if (isEdxVideo) {
      if (thumbnail) {
        return intl.formatMessage(messages.yesSubtitle);
      }
      return intl.formatMessage(messages.noneSubtitle);
    }
    return intl.formatMessage(messages.unavailableSubtitle);
  };
  return (!isLibrary ? (
    <CollapsibleFormWidget
      isError={Object.keys(error).length !== 0}
      title={intl.formatMessage(messages.title)}
      subtitle={getSubtitle()}
    >
      <ErrorAlert
        dismissError={fileSizeError.dismiss}
        hideHeading
        isError={fileSizeError.show}
      >
        <FormattedMessage {...messages.fileSizeError} />
      </ErrorAlert>
      {isEdxVideo ? null : (
        <Alert variant="light">
          <FormattedMessage {...messages.unavailableMessage} />
        </Alert>
      )}
      {thumbnail ? (
        <Stack direction="horizontal" gap={3}>
          <Image
            thumbnail
            fluid
            className="w-75"
            ref={imgRef}
            src={thumbnailSrc || thumbnail}
            alt={intl.formatMessage(messages.thumbnailAltText)}
          />
          { (allowThumbnailUpload && isEdxVideo) ? (
            <IconButtonWithTooltip
              tooltipPlacement="top"
              tooltipContent={intl.formatMessage(messages.deleteThumbnail)}
              iconAs={Icon}
              src={Delete}
              onClick={deleteThumbnail}
            />
          ) : null }
        </Stack>
      ) : (
        <Stack gap={3}>
          <div className="text-center">
            <FormattedMessage {...messages.addThumbnail} />
          </div>
          <div className="text-center text-primary-300">
            <FormattedMessage {...messages.aspectRequirements} />
          </div>
          <FileInput fileInput={fileInput} acceptedFiles={Object.values(acceptedImgKeys).join()} />
          <Button
            className="text-primary-500 font-weight-bold justify-content-start pl-0"
            size="sm"
            iconBefore={FileUpload}
            onClick={fileInput.click}
            variant="link"
            disabled={!isEdxVideo}
          >
            <FormattedMessage {...messages.uploadButtonLabel} />
          </Button>
        </Stack>
      )}
    </CollapsibleFormWidget>
  ) : null);
};

ThumbnailWidget.propTypes = {
  // injected
  intl: intlShape.isRequired,
  // redux
  isLibrary: PropTypes.bool.isRequired,
  allowThumbnailUpload: PropTypes.bool.isRequired,
  thumbnail: PropTypes.string.isRequired,
  videoType: PropTypes.string.isRequired,
};
export const mapStateToProps = (state) => ({
  isLibrary: selectors.app.isLibrary(state),
  allowThumbnailUpload: selectors.video.allowThumbnailUpload(state),
  thumbnail: selectors.video.thumbnail(state),
  videoType: selectors.video.videoType(state),
});

export const mapDispatchToProps = {};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(ThumbnailWidget));
