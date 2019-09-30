import { LintResult, Result } from '..';
import chalk from 'chalk';

function PrintPlainTextResult(result: Result): void {
  let file;
  result.results.forEach((e): void => {
    if (file !== e.file) {
      file = e.file;
      console.log('');
      console.log(chalk.underline(e.file));
    }
    console.log(chalk.yellow(e.message));
  });
}

interface ResultLengths {
  line: number;
  code: number;
  message: number;
  column: number;
  level: number;
}

function GetMaxLengths(results: LintResult[]): ResultLengths {
  let lengths: ResultLengths = {
    code: 0,
    message: 0,
    line: 0,
    column: 0,
    level: 0,
  };

  results.forEach((result): void => {
    if (result.code.length > lengths.code) {
      lengths.code = result.code.length;
    }

    if (result.message.length > lengths.message) {
      lengths.message = result.message.length;
    }

    const lineString = result.line.toString(10);
    if (lineString.length > lengths.line) {
      lengths.line = lineString.length;
    }

    const columnString = result.column.toString(10);
    if (columnString.length > lengths.column) {
      lengths.column = columnString.length;
    }

    if (result.level.length > lengths.level) {
      lengths.level = result.level.length;
    }
  });

  return lengths;
}

function Pluralise(word: string, count: number): string {
  return count === 1 ? word : `${word}s`;
}

function PrintJsonResult(result: Result): void {
  const lengths = GetMaxLengths(result.results);

  let file;
  result.results.forEach((e): void => {
    if (file !== e.file) {
      file = e.file;
      console.log();
      console.log(chalk.underline(e.file));
    }

    let levelColour;
    switch (e.level) {
      case 'error':
        levelColour = 'red';
        break;
      case 'warning':
        levelColour = 'yellow';
        break;
      case 'info':
        levelColour = 'white';
        break;
      default:
        levelColour = 'yellow';
        break;
    }

    console.log(
      [
        '',
        chalk.dim(
          `${e.line.toString(10).padStart(lengths.line)}:${e.column
            .toString(10)
            .padEnd(lengths.column)}`
        ),
        chalk[levelColour](`${e.level.padEnd(lengths.level)}`),
        e.message.padEnd(lengths.message),
        chalk.dim(e.code),
      ].join('  ')
    );
  });
  console.log('');

  const total = result.summary.count.error + result.summary.count.warning;
  if (total > 0) {
    let summaryColour = 'yellow';
    if (result.summary.count.error) {
      summaryColour = 'red';
    }
    console.log(
      chalk[summaryColour].bold(
        [
          `✗ ${total} ${Pluralise('problem', total)}`,
          ` (${result.summary.count.error} `,
          Pluralise('error', result.summary.count.error),
          `, ${result.summary.count.warning} `,
          Pluralise('warning', result.summary.count.warning),
          ')\n',
        ].join('')
      )
    );
  }
}

export function ConsoleFormatter(result: Result): void {
  if (result.type === 'plain-text') {
    PrintPlainTextResult(result);
  } else {
    PrintJsonResult(result);
  }
}
