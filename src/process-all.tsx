import { useEffect, useRef, useState } from "react";
import { showError } from "./supports/error";
import { Action, ActionPanel, Detail, getSelectedFinderItems, useNavigation } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { getWorkflowConfigs } from "./supports/workflow";
import { getFiles } from "./supports/image";
import { Image } from "./types";
import { processor } from "./processor";

export default function Index() {
  const { push } = useNavigation();
  const [markdown, setMarkdown] = useState("");
  const [workflowAlias, setWorkflowAlias] = useState([] as string[]);
  const [inputImage, setInputImage] = useState<Image>();
  const [error, setError] = useState<Error>();
  const hasRun = useRef(false);

  useEffect(() => {
    if (error) {
      showError(error);
      setMarkdown(`❌ Error: ${error.message}`);
    }
  }, [error]);

  const { isLoading } = usePromise(async () => {
    try {
      setWorkflowAlias(Object.keys((await getWorkflowConfigs()).workflows));
      const files = await getFiles();
      if (files.length == 0) {
        setError(new Error("No files found"));
        return;
      }

      setMarkdown(`✔︎ Selected file \`${files[0].value}\`\n\nPlease select a workflow to run on the file.`);
      setInputImage(files[0]);
    } catch (e) {
      setError(e instanceof Error ? e : new Error("An error occurred"));
    }
  }, []);

  return (
    <Detail
      isLoading={isLoading}
      navigationTitle="Process with specific workflow"
      markdown={markdown}
      actions={
        <ActionPanel>
          <ActionPanel.Submenu title="Select Workflow">
            <ActionPanel.Section key="workflow" title="Select which workflow to run">
              {workflowAlias.map((alias, index) => (
                <Action
                  key={index}
                  title={alias}
                  onAction={() => push(<Do workflow={alias} inputImage={inputImage} />)}
                />
              ))}
            </ActionPanel.Section>
          </ActionPanel.Submenu>
        </ActionPanel>
      }
    />
  );
}

function Do({ workflow, inputImage }: { workflow: string; inputImage?: Image }) {
  const { pop } = useNavigation();
  const hasRun = useRef(false);
  const [markdown, setMarkdown] = useState("");
  const [error, setError] = useState<Error>();

  useEffect(() => {
    if (error) {
      showError(error);
    }

    if (inputImage && workflow) {
      console.log(inputImage.value);
      console.log(workflow);
      console.log("-----");
    }
  }, [error, inputImage, workflow]);

  if (!inputImage) {
    setMarkdown("❌ Error: No input image found");
  }

  return (
    <Detail
      markdown={markdown}
      actions={
        <ActionPanel>
          <Action title="Pop" onAction={pop} />
        </ActionPanel>
      }
    />
  );
}
