export class ImageUploadApi {
  public static uploadImage = async () => {
    await new Promise((r) => setTimeout(r, 500));
    return "/placeholder-image.jpg";
  };
}

export default ImageUploadApi;
