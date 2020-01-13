import { render, fireEvent } from '@testing-library/react';
import React from 'react';
import { Poll, Answer } from './Poll';

test('submit poll and show results', () => {
  const answers = [
    { question: '1', votes: 0 },
    { question: '2', votes: 0 },
    { question: '3', votes: 0 },
    { question: '4', votes: 0 },
  ];
  const handler = jest.fn((e: any, i: any) => console.log(i));
  const { getByText } = render(
    <Poll
      id="qwe"
      question="Question 1"
      answers={answers}
      onPollSubmit={handler}
    >
      {answers.map((answer: any, index: number) => (
        <Answer key={index} id={index} answer={answer.question} />
      ))}
    </Poll>,
  );
  fireEvent.click(getByText('1'));
  fireEvent.click(getByText(/submit/i));

  const voted = getByText(/votedalready/i);

  expect(voted).toBeTruthy();
  expect(handler).toHaveBeenCalledTimes(1);
});
