import classnames from 'classnames';
import QuizTabButton from '@component/quiz/QuizTabButton';
import Canvas from '@component/Canvas';
import styles from './QuizView.module.scss';

interface QuizViewProps {
  wrapperClass?: string;
  activate: boolean;
  userHtml: string;
  userCss: string;
  answerHtml: string;
  answerCss: string;
  handleActivate: (status: boolean) => void;
  iframeListenerReady: boolean;
}

export default function QuizView({ wrapperClass, activate, userHtml, userCss, answerHtml, answerCss, handleActivate, iframeListenerReady }: QuizViewProps) {
  return (
    <div className={classnames(styles.wrap, wrapperClass)}>
      <div className={styles.tab}>
        <QuizTabButton isActivate={activate} handleClick={handleActivate} activateTabType innerText="user" />
        <QuizTabButton isActivate={!activate} handleClick={handleActivate} activateTabType={false} innerText="answer" />
      </div>
      <div className={styles.result}>
        <div className={classnames(styles.code, { [styles.activate]: activate })}>
          <span className={styles.code_label}>user</span>
          <div className={styles.canvas}>
            <Canvas html={userHtml} css={userCss} />
          </div>
        </div>
        <div className={classnames(styles.code, { [styles.activate]: !activate })}>
          <span className={styles.code_label}>answer</span>
          <div className={styles.canvas}>
            <Canvas html={answerHtml} css={answerCss} />
          </div>
        </div>
      </div>
    </div>
  );
}
