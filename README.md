## Description

Process images using workflow.

Imageflow is a Raycast extension that allows you to process images using a custom workflow. You can resize, compress, convert image format, and upload images to S3 or Cloudflare R2 Storage.

> This extension still in development and does not submit to Raycast Extension yet, you can clone this repo and install it locally.

## Support Actions

- [x] 🌰 Resize And Compress Image by [sharp](https://sharp.pixelplumbing.com/)
- [x] 🐝 Convert Image Format by [sharp](https://sharp.pixelplumbing.com/)
- [x] 📦 Overwrite Original images
- [x] 🚀 Upload Image To S3
- [x] 🌈 Upload Image To Cloudflare R2 Storage
- [x] 🍮 Copy Image To Clipboard
- [x] 🐼 Convert Image To Markdown format

## Demo

https://github.com/user-attachments/assets/32e7ccbe-39be-431d-ae5a-97dfb6a45b94

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

    - name: Convert URL to Markdown format
      action: tomarkdown

    - name: Copy to clipboard
      action: clipboard 
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

## Actions

| Action     | Description                                 | Input           | Output          | Params                                                                                              |
|------------|---------------------------------------------|-----------------|-----------------|-----------------------------------------------------------------------------------------------------|
| resize     | Resize and compress image via sharp         | filepath or url | filepath        | width, height, type, see [request option](https://tinypng.com/developers/reference#request-options) |
| compress   | Compress image via sharp (only compress)    | filepath or url | filepath or url | output_type?: file or url                                                                           |
| convert    | Convert image format via sharp              | filepath or url | filepath        | format: jpeg, png, webp, avif                                                                       |
| overwrite  | Overwrite original images                   | filepath        | filepath        | -                                                                                                   |
| upload     | Upload image to S3 or Cloudflare R2 Storage | filepath        | url             | bucket, root?, cdn?                                                                                 |
| clipboard  | Copy image to clipboard                     | filepath or url | Input           | -                                                                                                   |
| tomarkdown | Convert image to markdown format            | filepath or url | markdown        | -                                                                                                   |


## TODO

- [ ] Introduction of sharp to process images locally
- [ ] OpenDAL
- [ ] Support more image processing actions like:
  - [ ] Rename image with uuid or date or something else 
  - [ ] Watermark
  - [ ] Move to folder
  - [ ] Upload to other cloud storage like Aliyun OSS, Qiniu, Tencent COS, but it's better to use OpenDAL if possible


## Development

Clone this repo and install it locally in developer mode.

You will need to have [Node.js](https://nodejs.org) and npm installed.

1. Clone this repo `git clone https://github.com/godruoyi/imageflow.git`
2. Go to the folder `cd imageflow`
3. Install dependencies `npm install && npm run dev`
4. Go to Raycast, run `Import Extension` and select the folder

## License

MIT License