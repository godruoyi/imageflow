import React, { useEffect, useRef, useState } from "react";
import { Detail } from "@raycast/api";
import { showError } from "./supports/error";
import { usePromise } from "@raycast/utils";
import { processor } from "./processor";

export default function Index() {
  const [markdown, setMarkdown] = useState("");
  const hasRun = useRef(false);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error]);

  usePromise(async () => {
    if (hasRun.current) {
      return;
    }
    hasRun.current = true;

    await processor(setMarkdown, setError, "image");
  }, []);

  return <Detail markdown={markdown} />;
}
