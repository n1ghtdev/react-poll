import React from 'react';
import ReactDOM from 'react-dom';
import { Poll, Answer } from 'react-poll';

const node = document.getElementById('root');

const answers = [
  { question: '1', votes: 0 },
  { question: '2', votes: 0 },
  { question: '3', votes: 0 },
  { question: '4', votes: 0 },
];

ReactDOM.render(
  <Poll
    id="qwe"
    question="Question 1"
    answers={answers}
    onPollSubmit={() => console.log(1)}
  >
    {answers.map((answer: any, index: number) => (
      <Answer key={index} id={index} answer={answer.question} />
    ))}
  </Poll>,
  node,
);
