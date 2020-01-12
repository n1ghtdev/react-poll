import React from 'react';

interface Props {
  onSubmit: () => void;
  type: 'single' | 'multi';
  title: string;
  answers: [];
  voted: boolean;
  disabled?: boolean;
}

function Poll(props: Props) {
  const onAnswerChange = (e: React.MouseEvent<HTMLElement>) => {};
  const onSubmit = () => {};

  return (
    <div className="poll__component">
      <span className="poll__title">{props.title}</span>
      <ul className="poll__answers">
        {!props.voted
          ? props.answers.map((answer: any) => (
              <li className="poll__answer">
                <button onClick={onAnswerChange}>{answer.title}</button>
              </li>
            ))
          : null}
      </ul>
    </div>
  );
}

export default Poll;
