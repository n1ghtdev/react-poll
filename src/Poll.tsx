import React from 'react';

interface AnswerProps {
  answer: string;
  id: number;
  onAnswer?: (id: number) => void;
}

export function Answer({ answer, id, onAnswer }: AnswerProps) {
  return (
    <li key={answer} className="poll__answer">
      <button type="button" onClick={() => onAnswer && onAnswer(id)}>
        {answer}
      </button>
    </li>
  );
}

function Result() {}

interface IProps {
  onPollSubmit: (
    event: React.ChangeEvent<HTMLFormElement>,
    index: number,
  ) => void;
  id: string | number;
  type?: 'single' | 'multi';
  question: string;
  answers: any[];
  voted?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
}
interface IState {
  voted: boolean;
  selectedAnswer: number | undefined;
}

export class Poll extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      voted: false,
      selectedAnswer: undefined,
    };
  }
  componentDidMount() {
    const storage = localStorage.getItem(`react_poll-${this.props.id}`);

    if (this.props.voted !== undefined) {
      this.setState({ voted: this.props.voted });
    } else if (storage) {
      this.setState({ voted: true });
    } else {
      this.setState({ voted: false });
    }
  }
  submitPoll = (event: React.ChangeEvent<HTMLFormElement>) => {
    if (event) event.preventDefault();

    localStorage.setItem(
      `react_poll-${this.props.id}`,
      this.props.id.toString(),
    );

    this.setState({ voted: true });

    typeof this.state.selectedAnswer === 'number' &&
      this.props.onPollSubmit(event, this.state.selectedAnswer);
  };
  onAnswerChange = (id: number) => {
    this.setState({ selectedAnswer: id });
  };
  render() {
    const { question, answers, voted } = this.props;
    const childrenWithEvent = React.Children.map(this.props.children, child =>
      React.cloneElement(child as React.ReactElement<any>, {
        onAnswer: this.onAnswerChange,
      }),
    );
    return (
      <form onSubmit={this.submitPoll} className="poll__component">
        <span className="poll__title">{question}</span>
        <ul className="poll__answers">
          {!voted && !this.state.voted ? (
            // (
            //   answers.map((answer: any, index: number) => (
            //     <Answer
            //       key={index}
            //       answer={answer.title}
            //       onAnswer={() => this.onAnswerChange(index)}
            //     />
            //   ))
            // )
            childrenWithEvent
          ) : (
            <div>votedalready</div>
          )}
        </ul>
        <button type="submit">Submit</button>
      </form>
    );
  }
}
