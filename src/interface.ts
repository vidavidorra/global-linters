export interface Arguments {
  linter: string;
  fileAndOrGlob: string[];
  ignorePath?: string;
  range?: string;
  options?: string;
}

export interface LintResult {
  message: string;
  file: string;
  line?: number;
  column?: number;
  level?: string;
  code?: string;
}

export interface ResultSummary {
  count: {
    error: number;
    warning: number;
    info: number;
    other: number;
  };
}

export interface Result {
  type: 'JSON' | 'plain-text';
  results: LintResult[];
  summary: ResultSummary;
}
