import { render, fireEvent } from '@testing-library/react';
import React from 'react';
import { Poll, Answer } from './Poll';

test('submit poll', () => {
  const answers = [
    { question: '1', votes: 0 },
    { question: '2', votes: 0 },
    { question: '3', votes: 0 },
    { question: '4', votes: 0 },
  ];
  const handler = jest.fn((i: number) => {
    answers[i].votes = answers[i].votes + 1;
  });
  const { getByText } = render(
    <Poll id="qwe" question="Question 1" onPollSubmit={handler}>
      {answers.map((answer: any, index: number) => (
        <Answer
          key={index}
          id={index}
          answer={answer.question}
          votes={answer.votes}
        />
      ))}
    </Poll>,
  );

  fireEvent.click(getByText('1'));
  fireEvent.click(getByText(/submit/i));

  expect(handler).toHaveBeenCalledTimes(1);
});
