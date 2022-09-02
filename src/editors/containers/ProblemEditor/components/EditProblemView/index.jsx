import React from 'react';

import AnswerWidget from './AnswerWidget';
import SettingsWidget from './SettingsWidget';
import QuestionWidget from './QuestionWidget';
import { EditorContainer } from '../../../EditorContainer';
import { selectors } from '../../../../data/redux';
import { useSelector } from 'react-redux';
import { getEditorData } from '../../data/MarkDownParser';


export const EditProblemView = ({editorValue}) => {
  const problemType = useSelector(selectors.problem.problemType);
  const blockValue = useSelector(selectors.app.blockValue)
  const markdown = blockValue.data.metadata.markdown ? blockValue.data.metadata.markdown : "No Markdown";
  const olx = blockValue.data.data ? blockValue.data.data : "No OLX";
  const parsedData = useSelector(selectors.app.getParsedEditorData);
  console.log(parsedData);
  return (
      <EditorContainer getContent={() => ({})}>
        <div>
          <h1>
            Edit Problem View:
          </h1>
          <pre>
          <h3>OLX</h3>
          <br/>
          { olx }
          </pre>
          <pre>
          <h3>Markdown</h3>
          <br/>
          { markdown }
          </pre>
          <pre>
          <h3>Parsed Markdown</h3>
          <br/>
          { parsedData.editorData }
          <br/>
          </pre>
        </div>
        <AnswerWidget problemType={problemType} />
        <SettingsWidget />
        <QuestionWidget />
      </EditorContainer>
  );
};

export default EditProblemView;
