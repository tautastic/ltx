import { createImageUpload } from "ltx-editor/plugins";
import { useToast } from "~/components/ui/use-toast";

const onUpload = (file: File) => {
  const { toast } = useToast();
  const promise = fetch("/api/upload", {
    method: "POST",
    headers: {
      "content-type": file.type,
      "x-vercel-filename": file.name,
    },
    body: file,
  });

  return new Promise((resolve) => {
    promise.then(async (res) => {
      if (res.status === 200) {
        const { url } = await res.json();
        const image = new Image();
        image.src = url;
        image.onload = () => {
          resolve(url);
          toast({ title: "Image uploaded successfully." });
        };
      } else if (res.status === 401) {
        resolve(file);
        throw new Error("`BLOB_READ_WRITE_TOKEN` environment variable not found, reading image locally instead.");
      } else {
        toast({ title: "Error uploading image. Please try again." });
      }
    });
  });
};

export const uploadFn = createImageUpload({
  onUpload,
  validateFn: (file) => {
    const { toast } = useToast();
    if (!file.type.includes("image/")) {
      toast({
        title: "File type not supported.",
      });
      return false;
    }

    if (file.size / 1024 / 1024 > 20) {
      toast({
        title: "File size too big (max 20MB).",
      });
      return false;
    }
    return true;
  },
});
