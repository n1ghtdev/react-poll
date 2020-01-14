import React from 'react';
import ReactDOM from 'react-dom';
import { Poll, Answer } from 'react-poll';

const node = document.getElementById('root');

const App = () => {
  const [answers, setAnswers] = React.useState([
    { id: 0, question: '1', votes: 0 },
    { id: 1, question: '2', votes: 0 },
    { id: 2, question: '3', votes: 0 },
    { id: 3, question: '4', votes: 0 },
  ]);
  const onSubmit = (submitedAnswerIndex: number) => {
    setAnswers(prev => {
      const updatedAnswers = prev.map((item: any) =>
        item.id === submitedAnswerIndex
          ? { ...item, votes: item.votes + 1 }
          : item,
      );
      return updatedAnswers;
    });
  };
  return (
    <Poll id="qwe" question="Question 1" onPollSubmit={onSubmit}>
      {answers.map((answer: any, index: number) => (
        <Answer
          key={index}
          id={answer.id}
          answer={answer.question}
          votes={answer.votes}
        />
      ))}
    </Poll>
  );
};

ReactDOM.render(<App />, node);
