import { CloudinaryProvider } from "./cloudinary.provider";

export function getImageProvider() {
    const provider = process.env.IMAGE_PROVIDER;

    switch (provider) {
        case "cloudinary":
            return new CloudinaryProvider();

        // future:
        // case "s3":
        //   return new S3Provider();

        default:
            throw new Error(`Unsupported IMAGE_PROVIDER: ${provider}`);
    }
}
