export type PathOrUrl = string;
export type ImageType = "path" | "url";

export interface Image {
  type: ImageType;
  value: PathOrUrl;
}

export interface Input {
  image: Image;
}

export type Output = Input;

export type V = string | number | boolean;
export type Config = Record<string, V>;

export type ActionFn =
  | ((i: Input, config: Config) => Promise<Output>)
  | ((i: Input, config: Config, services: Record<string, Config>) => Promise<Output>)
  | ((i: Input, config: Config, services: Record<string, Config>, originImage: Image) => Promise<Output>);

export interface Node {
  action: string;
  name: string;
  params: Config;
}

export type WorkflowAlias = "default" | "one" | "two";

export interface Configs {
  workflows: Record<WorkflowAlias, Node[]>;
  services: Record<string, Config>;
}

export interface IWorkflow {
  run: (i: Input) => Promise<Output>;
}
