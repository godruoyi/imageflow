type Status = "success" | "fail" | "info" | "warn" | "todo";

const StatusEmoji = {
  success: "✅",
  fail: "🚨",
  info: "ℹ️",
  warn: "⚠️",
  todo: "☑️",
};

interface Stage {
  name: string;
  status: Status;
  logs: Log[];
}

interface Log {
  message: string;
  status: Status;
}

type MarkdownReader = (stages: Stage[]) => string;

class MarkdownLogger {
  private static instance: MarkdownLogger;

  private static markdownReader: MarkdownReader = defaultMarkdownReader;

  private readonly stages: Stage[];

  private constructor(stages: Stage[]) {
    this.stages = stages;
  }

  public static getInstance(stages: Stage[]): MarkdownLogger {
    if (!MarkdownLogger.instance) {
      MarkdownLogger.instance = new MarkdownLogger(stages);
    }

    return MarkdownLogger.instance;
  }

  public finish(stage: string): void {
    const stages = this.stages.filter((s) => s.name === stage);
    if (stages.length <= 0) {
      return;
    }

    stages[0].status = "success";
  }

  public log(stage: string, message: string, status: Status): void {
    const stages = this.stages.filter((s) => s.name === stage);
    if (stages.length > 0) {
      stages[0].logs.push({ message, status });
    }
  }

  public toMarkdown(): string {
    return MarkdownLogger.markdownReader(this.stages);
  }
}

const markdownLogger = (stages: Stage[]): MarkdownLogger => {
  return MarkdownLogger.getInstance(stages);
};

function defaultMarkdownReader(stages: Stage[]): string {
  const init = `
## Progressing image ![loading](https://images.godruoyi.com/loading.gif)

`;

  return stages.reduce((acc, s) => {
    const logs = s.logs.reduce((acc, l) => `${acc}\n  - ${StatusEmoji[l.status]} ${l.message}`, "");
    const newLine = `- ${StatusEmoji[s.status]} ${s.name}${logs}`;

    return `${acc}\n${newLine}`;
  }, init);
}

export default {
  markdownLogger,
};
