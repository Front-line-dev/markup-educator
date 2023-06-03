import React, { Dispatch, SetStateAction } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { okaidia } from '@uiw/codemirror-theme-okaidia';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';

const LANG_MAP = {
  html: [html({ autoCloseTags: true })],
  css: [css()],
};

export default function Editor({
  lang,
  initialString,
  setState,
  timer,
  setTimer,
}: {
  lang: string;
  initialString: string;
  setState: Dispatch<SetStateAction<string>>;
  timer: any;
  setTimer: any;
}) {
  const handleUpdate = (state) => {
    if (timer) {
      clearTimeout(timer);
    }

    setTimer(
      setTimeout(() => {
        // 리액트의 setState는 call 한 순서대로 변경되는가? 최소한 한 번에 변경한 state는 동시에 적용이 되어야지 버그없이 작동할 듯
        setState(state);
        setTimer(null);
      }, 1000)
    );
  };

  return <CodeMirror value={initialString} theme={okaidia} width="100%" height="380px" extensions={LANG_MAP[lang]} onChange={handleUpdate} />;
}
