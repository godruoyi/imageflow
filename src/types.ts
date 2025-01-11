export interface Input {
  images: string[];
}

export interface Output {
  images: string[];
}

export type V = string | number | boolean;
export type Config = Record<string, V>;

export interface Action {
  execute: (i: Input) => Promise<Output>;
}

export interface Node {
  action: Action;
  name: string;
  params: Config;
}

export type WorkflowAlias = "default" | "one" | "two";

export interface Configs {
  workflows: Record<WorkflowAlias, Node[]>;
  services: Record<"s3", Config>;
}

export interface IWorkflow {
  run: (i: Input) => Promise<Output>;
}
