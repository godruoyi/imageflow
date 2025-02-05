import { showToast, Toast } from "@raycast/api";

export async function showError(e?: Error | undefined) {
  await showToast({
    style: Toast.Style.Failure,
    title: "Error",
    message: e instanceof Error ? e.message : "An error occurred",
  });
}
