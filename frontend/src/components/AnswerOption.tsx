type Props = {
  text: string;
  index: number;
  selected: boolean;
  disabled: boolean;
  isCorrect: boolean;
  isWrong: boolean;
  onToggle: (index: number) => void;
};

export function AnswerOption(props: Props) {
  const { text, index, selected, disabled, isCorrect, isWrong, onToggle } = props;
  const classes = [
    "answer-option",
    selected ? "selected" : "",
    isCorrect ? "correct" : "",
    isWrong ? "wrong" : ""
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={classes}
      disabled={disabled}
      aria-pressed={selected}
      onClick={() => onToggle(index)}
    >
      {text}
    </button>
  );
}

