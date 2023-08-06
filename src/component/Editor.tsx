import React, { Dispatch, SetStateAction, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { okaidia } from '@uiw/codemirror-theme-okaidia';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';

interface EditorParams {
  lang: string;
  initialString: string;
  setString: Dispatch<SetStateAction<string>>;
  setDebouncing: Dispatch<SetStateAction<boolean>>;
  editable: boolean;
}

const LANG_MAP = {
  html: [html({ autoCloseTags: true })],
  css: [css()],
};

export default function Editor({ lang, initialString, setString, setDebouncing, editable }: EditorParams) {
  const [timer, setTimer] = useState(null);

  const handleUpdate = (editorString: string) => {
    setDebouncing(true);
    if (timer) {
      clearTimeout(timer);
    }

    setTimer(
      setTimeout(() => {
        setDebouncing(false);
        setString(editorString);
        setTimer(null);
      }, 1000)
    );
  };

  return (
    <CodeMirror value={initialString} theme={okaidia} width="100%" height="380px" extensions={LANG_MAP[lang]} onChange={handleUpdate} readOnly={!editable} />
  );
}
