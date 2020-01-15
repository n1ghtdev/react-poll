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

const initialState: IState = {
  voted: false,
  selectedAnswer: undefined,
  totalVotes: 0,
};

export class Poll extends React.Component<IProps, IState> {
  private storage: number[];

  constructor(props: IProps) {
    super(props);

    /* set initial value of storage to localStorage 'react_poll' item */
    this.storage = this.loadLocalStorage();

    this.state = initialState;
  }

  /* verify if user has voted on this poll already */
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

  /* update totalVotes state if votes has changed */
  componentDidUpdate(prevProps: IProps, prevState: IState) {
    const totalVotes = this.getChildrenTotalVotes(this.props.children);

    if (prevState.totalVotes !== totalVotes) {
      this.setState({ totalVotes });
    }
  }

  /* iterates over children prop and collects total number of votes */
  getChildrenTotalVotes = (children: React.ReactNode) => {
    const votes = React.Children.map(children, child => {
      if (!React.isValidElement(child)) return;

      return child.props.votes;
    });

    const totalVotes = votes.reduce((acc: number, cur: number) => acc + cur, 0);
    return totalVotes;
  };

  /* checks if props.id (Poll ID) is in localStorage */
  checkIfPollInStorage = () => {
    if (this.storage.length > 0) {
      return this.storage.some(
        (item: string | number) => item === this.props.id,
      );
    }
    return false;
  };

  /* load localStorage */
  loadLocalStorage = () => {
    try {
      const storage = JSON.parse(localStorage.getItem('react_poll') || '[]');
      return storage;
    } catch (err) {
      console.error(err);
    }
    return [];
  };

  /* saves props.id to localStorage */
  saveToLocalStorage = () => {
    const newStorage = [...this.storage, this.props.id];
    localStorage.setItem('react_poll', JSON.stringify(newStorage));
  };

  /* form submit event handler */
  /* fires saveToLocalStorage saves props.id to localStorage */
  /* set voted state to true */
  /* if typeof selectedAnswer === number fire onPollSubmit prop event 
     with selectedAnswer and event passed */
  submitPoll = (event: React.ChangeEvent<HTMLFormElement>) => {
    if (event) event.preventDefault();

    this.saveToLocalStorage();

    this.setState({ voted: true });

    typeof this.state.selectedAnswer === 'number' &&
      this.props.onPollSubmit(this.state.selectedAnswer, event);
  };

  /* set selected answer's id to state */
  onAnswerChange = (id: number, votes: number) => {
    this.setState({ selectedAnswer: id });
  };
  render() {
    // TODO: {state, props} = this instead
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

    const canVote =
      voted !== undefined ? (!voted ? true : false) : !this.state.voted;
    return (
      <form onSubmit={this.submitPoll} className="poll__component">
        <span className="poll__title">{question}</span>
        <ul className="poll__answers">
          {canVote ? childrenWithEvent : answersVotes}
        </ul>
        <button type="submit">Submit</button>
      </form>
    );
  }
}
