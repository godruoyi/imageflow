import { showHUD } from "@raycast/api";

export async function showError(e?: Error | unknown) {
  await showHUD(e instanceof Error ? e.message : "An error occurred", {
    clearRootSearch: true,
  });

  // await showToast({
  //   style: Toast.Style.Failure,
  //   title: "Error",
  //   message: e instanceof Error ? e.message : "An error occurred",
  // });
}
