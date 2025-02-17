## Description

Process images using workflow.

Imageflow is a Raycast extension that allows you to process images using a custom workflow. You can resize, compress, convert image format, and upload images to S3 or Cloudflare R2 Storage.

## Features

- [x] 🌰 Resize And Compress Image by [sharp](https://sharp.pixelplumbing.com/)
- [x] 🐝 Convert Image Format by [sharp](https://sharp.pixelplumbing.com/)
- [x] 📦 Overwrite Original images
- [x] 🚀 Upload Image To S3
- [x] 🌈 Upload Image To Cloudflare R2 Storage
- [x] 🍮 Custom workflow configuration, see [demo](#demo)

## Demo

https://github.com/user-attachments/assets/1e3dc861-dfd8-4604-bdec-cf4deb7f92e3

Demo yaml configuration file:

```yaml
workflows:
  default:
    - name: Resize And Compress Image to 1200x800
      action: resize
      params:
        type: cover
        width: 1200
        height: 800

    - name: Convert Image To AVIF
      action: convert
      params:
        format: avif

    - name: Overwrite Original images
      action: overwrite

    - name: Upload Image To S3
      action: upload
      params:
        root: hello/tmp
        bucket: gblog-images
        cdn: https://images.godruoyi.com
        service: s3
services:
  s3:
    # example to upload file to cloudflare R2 storage
    endpoint: https://your-account-id.r2.cloudflarestorage.com
    region: auto
    access_key_id: id
    secret_access_key: key
  tinypng:
    apiKey: x
```

## Development

Clone this repo and install it locally in developer mode.

You will need to have [Node.js](https://nodejs.org) and npm installed.

1. Clone this repo `git clone https://github.com/godruoyi/imageflow.git`
2. Go to the folder `cd imageflow`
3. Install dependencies `npm install && npm run dev`
4. Go to Raycast, run `Import Extension` and select the folder

## FQA

- Q: 403 Forbidden, API rate limit exceeded for your IP address.
- A: We use the GitHub API to retrieve the latest Laravel tips data. If you encounter this issue, please refer to the
  GitHub [documentation](https://docs.github.com/rest/overview/resources-in-the-rest-api#rate-limiting) to solve it. you
  can create a personal access token and set it to the extension settings.

## License

MIT License