import React, { useState } from "react";
import { PlusCircleIcon, Trash2Icon } from "lucide-react";
import { Label } from "./label";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setAnyPhoto, setKTP, setSelfie } from "@/redux/slices";
import { RootState } from "@/redux/store";

const ImageInput: React.FC<{
  label: "KTP" | "selfie" | "anyPhoto";
  title?: string;
}> = ({ label, title }) => {
  const dispatch = useDispatch();
  const imageStore = useSelector((state: RootState) => state.form[label]);
  const [image, setImage] = useState<string | null>(imageStore?.base64 || null);
  const [fileName, setFileName] = useState<string | null>(
    imageStore?.name || null,
  );
  const [fileSize, setFileSize] = useState<string | null>(
    imageStore?.size || null,
  );

  //convert to base64 and set to store
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64 = reader.result as string;
        const fileData = {
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
          base64,
        };
        setImage(base64);
        setFileName(fileData.name);
        setFileSize(fileData.size);
        if (label === "KTP") {
          dispatch(setKTP(fileData));
        } else if (label === "selfie") {
          dispatch(setSelfie(fileData));
        } else if (label === "anyPhoto") {
          dispatch(setAnyPhoto(fileData));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setFileName(null);
    setFileSize(null);
    if (label === "selfie") {
      dispatch(setSelfie(null));
    } else if (label === "KTP") {
      dispatch(setKTP(null));
    } else if (label === "anyPhoto") {
      dispatch(setAnyPhoto(null));
    }
  };

  return (
    <div className="grid gap-1.5">
      <Label htmlFor={label}>{title}</Label>
      <div className="relative flex h-24 w-full max-w-96 items-center justify-center rounded-lg border-2 px-4 py-2 shadow shadow-primary">
        {!image ? (
          <div className="h-full w-full text-center">
            <label
              htmlFor={label}
              className="flex h-full cursor-pointer items-center justify-center [&_svg]:hover:stroke-muted-foreground"
            >
              <PlusCircleIcon className="h-8 w-8" />
            </label>
            <input
              id={label}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              hidden
            />
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-between gap-4">
            <div className="flex h-full items-center gap-4">
              <img
                src={image}
                alt="Preview"
                className="h-full w-16 object-cover"
              />
              <div className="">
                <p className="line-clamp-1 text-sm font-semibold">{fileName}</p>
                <p className="text-xs text-muted-foreground">{fileSize}</p>
              </div>
            </div>
            <Trash2Icon
              className="min-h-5 min-w-5 cursor-pointer stroke-destructive"
              onClick={handleRemoveImage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageInput;
