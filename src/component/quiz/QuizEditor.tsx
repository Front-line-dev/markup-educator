import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import classnames from 'classnames';
import Editor from '@component/Editor';
import QuizTabButton from '@component/quiz/QuizTabButton';
import styles from './QuizEditor.module.scss';

interface QuizEditorProps {
  wrapperClass?: string;
  activate: boolean;
  html: string;
  css: string;
  handleActivate: Dispatch<SetStateAction<boolean>>;
  handleHtml: Dispatch<SetStateAction<string>>;
  handleCss: Dispatch<SetStateAction<string>>;
  handleDebouncing?: Dispatch<SetStateAction<boolean>>;
  editable: boolean;
}

export default function QuizEditor({ wrapperClass, activate, html, css, handleActivate, handleHtml, handleCss, handleDebouncing, editable }: QuizEditorProps) {
  const [htmlDebouncing, setHtmlDebouncing] = useState(false);
  const [cssDebouncing, setCssDebouncing] = useState(false);

  useEffect(() => {
    if (handleDebouncing) {
      handleDebouncing(htmlDebouncing || cssDebouncing);
    }
  }, [htmlDebouncing, cssDebouncing, handleDebouncing]);

  return (
    <div className={classnames(wrapperClass)}>
      <div className={styles.tab}>
        <QuizTabButton isActivate={activate} handleClick={handleActivate} activateTabType innerText="HTML" />
        <QuizTabButton isActivate={!activate} handleClick={handleActivate} activateTabType={false} innerText="CSS" />
      </div>
      <div className={styles.editor}>
        <div className={classnames(styles.code, { [styles.activate]: activate })}>
          <span className={styles.code_label}>HTML</span>
          <div className={styles.code_inner}>
            <Editor lang="html" initialString={html} setString={handleHtml} setDebouncing={setHtmlDebouncing} editable={editable} />
          </div>
        </div>
        <div className={classnames(styles.code, { [styles.activate]: !activate })}>
          <span className={styles.code_label}>SCSS</span>
          <div className={styles.code_inner}>
            <Editor lang="css" initialString={css} setString={handleCss} setDebouncing={setCssDebouncing} editable={editable} />
          </div>
        </div>
      </div>
    </div>
  );
}
