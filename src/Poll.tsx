import React from 'react';

interface AnswerProps {
  answer: string;
  id: number;
  votes: number;
  onAnswer?: (id: number) => void;
}

export function Answer({ answer, id, onAnswer }: AnswerProps) {
  return (
    <li className="poll__answer">
      <button type="button" onClick={() => onAnswer && onAnswer(id)}>
        {answer}
      </button>
    </li>
  );
}

interface ResultProps {
  answer: string;
  votes: number;
  id: number;
}

function Result({ answer, id, votes }: ResultProps) {
  return (
    <li key={id}>
      {answer} - {votes}
    </li>
  );
}

interface IProps {
  onPollSubmit: (
    index: number,
    event: React.ChangeEvent<HTMLFormElement>,
  ) => void;
  id: string | number;
  totalVotes?: number;
  question: string;
  voted?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}
interface IState {
  voted: boolean;
  selectedAnswer: number | undefined;
  totalVotes: number;
}

export class Poll extends React.Component<IProps, IState> {
  private storage: string;

  constructor(props: IProps) {
    super(props);

    this.storage = localStorage.getItem('react_poll') || '[]';
    this.state = {
      voted: false,
      selectedAnswer: undefined,
      totalVotes: 0,
    };
  }
  componentDidMount() {
    const isInStorage = this.checkIfPollInStorage();

    if (this.props.voted !== undefined) {
      this.setState({ voted: this.props.voted });
    } else if (isInStorage) {
      this.setState({ voted: true });
    } else {
      this.setState({ voted: false });
    }
  }
  componentDidUpdate(prevProps: IProps, prevState: IState) {
    const totalVotes = this.getChildrenTotalVotes(this.props.children);

    if (prevState.totalVotes !== totalVotes) {
      this.setState({ totalVotes });
    }
  }
  getChildrenTotalVotes = (children: React.ReactNode) => {
    const votes = React.Children.map(children, child => {
      if (!React.isValidElement(child)) return;

      return child.props.votes;
    });

    const totalVotes = votes.reduce((acc: number, cur: number) => acc + cur, 0);
    return totalVotes;
  };
  checkIfPollInStorage = () =>
    JSON.parse(this.storage).some(
      (item: string | number) => item === this.props.id,
    );
  savePollToStorage = () => {
    const newStorage = JSON.parse(this.storage).push(this.props.id);
    localStorage.setItem('react_poll', JSON.stringify(newStorage));
  };
  submitPoll = (event: React.ChangeEvent<HTMLFormElement>) => {
    if (event) event.preventDefault();

    this.savePollToStorage();

    this.setState({ voted: true });

    typeof this.state.selectedAnswer === 'number' &&
      this.props.onPollSubmit(this.state.selectedAnswer, event);
  };
  onAnswerChange = (id: number, votes: number) => {
    this.setState({ selectedAnswer: id });
  };
  render() {
    const { question, voted, children } = this.props;
    const answersVotes = React.Children.map(children, child => {
      if (!React.isValidElement(child)) return;

      return (
        <Result
          id={child.props.id}
          answer={child.props.answer}
          votes={child.props.votes}
        />
      );
    });

    const childrenWithEvent = React.Children.map(children, child =>
      React.cloneElement(child as React.ReactElement<any>, {
        onAnswer: this.onAnswerChange,
      }),
    );

    return (
      <form onSubmit={this.submitPoll} className="poll__component">
        <span className="poll__title">{question}</span>
        <ul className="poll__answers">
          {!voted && !this.state.voted ? childrenWithEvent : answersVotes}
        </ul>
        <button type="submit">Submit</button>
      </form>
    );
  }
}
