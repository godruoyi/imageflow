import { statSync, createReadStream } from "fs";
import fetch from "node-fetch";

const ShortenURL = "https://api.tinify.com/shrink";

type ResponseScheme = {
  output: {
    size: number;
    url: string;
  };
  error?: string;
  message?: string;
};

export async function upload(file: string, key: string): Promise<string> {
  const { size } = statSync(file);
  const stream = createReadStream(file);

  const res = await fetch(ShortenURL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from("api:" + key).toString("base64")}`,
      contentLength: size.toString(),
    },
    body: stream,
  });

  const json = (await res.json()) as ResponseScheme;

  if ("error" in json && json.error) {
    throw new Error(`failed to upload image to tinypng, error: ${json.error}, message: ${json.message}`);
  }

  return json.output.url as string;
}

export async function download(url: string): Promise<NodeJS.ReadableStream | null> {
  const res = await fetch(url);

  return res.body;
}

export async function downloadAndResize(
  url: string,
  key: string,
  options: {
    method: string;
    width?: number;
    height?: number;
  },
): Promise<NodeJS.ReadableStream | null> {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from("api:" + key).toString("base64")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ resize: options }),
  });

  return res.body;
}
