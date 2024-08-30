import React, { useState } from "react";
import { PlusCircleIcon, Trash2Icon } from "lucide-react";
import { Label } from "./label";
import { useSelector, useDispatch } from "react-redux";
import { setAnyPhoto, setKTP, setSelfie } from "@/redux/slices";
import { RootState } from "@/redux/store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/dialog";
import { Slider } from "./slider";

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
  const [zoom, setZoom] = useState<number>(50);
  const [position, setPosition] = useState({ x: 0, y: 0 });

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

  const handleMoveImageTouch = (e: React.TouchEvent<HTMLImageElement>) => {
    handleMoveImage(e, "touch");
  };

  const handleMoveImageMouse = (e: React.MouseEvent<HTMLImageElement>) => {
    e.preventDefault();
    handleMoveImage(e, "mouse");
  };

  const handleMoveImage = (
    e: React.TouchEvent<HTMLImageElement> | React.MouseEvent<HTMLImageElement>,
    type: "touch" | "mouse",
  ) => {
    const image = e.target as HTMLImageElement;
    if (!image) return;
    image.style.cursor = "grabbing";

    const isTouchEvent = type === "touch";
    const startX = isTouchEvent
      ? (e as React.TouchEvent).touches[0].clientX - position.x
      : (e as React.MouseEvent).clientX - position.x;
    const startY = isTouchEvent
      ? (e as React.TouchEvent).touches[0].clientY - position.y
      : (e as React.MouseEvent).clientY - position.y;

    const handleMove = (event: TouchEvent | MouseEvent) => {
      const x =
        event instanceof TouchEvent
          ? event.touches[0].clientX - startX
          : (event as MouseEvent).clientX - startX;
      const y =
        event instanceof TouchEvent
          ? event.touches[0].clientY - startY
          : (event as MouseEvent).clientY - startY;
      setPosition({ x, y });
    };

    const endDragging = () => {
      if (isTouchEvent) {
        document.removeEventListener("touchmove", handleMove);
        document.removeEventListener("touchend", endDragging);
      } else {
        document.removeEventListener("mousemove", handleMove);
        document.removeEventListener("mouseup", endDragging);
      }
      image.style.cursor = "grab";
    };

    if (isTouchEvent) {
      document.addEventListener("touchmove", handleMove);
      document.addEventListener("touchend", endDragging);
    } else {
      document.addEventListener("mousemove", handleMove);
      document.addEventListener("mouseup", endDragging);
    }
  };

  const handleOpenDialog = () => {
    setZoom(50);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div className="grid w-full max-w-96 gap-1.5">
      <Label htmlFor={label}>{title}</Label>
      <div className="relative flex h-24 w-full items-center justify-center rounded-lg border-2 px-4 py-2 shadow shadow-primary">
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
              <Dialog onOpenChange={handleOpenDialog}>
                <DialogTrigger className="h-full">
                  <img
                    src={image}
                    alt="Preview"
                    title="klik untuk memperbesar"
                    className="h-full w-16 object-cover"
                  />
                </DialogTrigger>
                <DialogContent
                  onOpenAutoFocus={(e) => e.preventDefault()}
                  className="max-w-lg rounded border-none bg-transparent p-2"
                >
                  <DialogTitle hidden></DialogTitle>
                  <DialogDescription hidden></DialogDescription>
                  <div className="relative min-h-96 w-full cursor-grab overflow-clip rounded-lg border backdrop-blur">
                    <img
                      src={image}
                      alt="Preview"
                      className="absolute h-full w-full rounded object-contain"
                      style={{
                        transform: `scale(${zoom / 50})`,
                        left: `${position.x}px`,
                        top: `${position.y}px`,
                      }}
                      onTouchStart={handleMoveImageTouch}
                      onMouseDown={handleMoveImageMouse}
                    />
                  </div>
                  <DialogFooter>
                    <Slider
                      value={[zoom]}
                      min={1}
                      max={100}
                      step={1}
                      onValueChange={(value) => setZoom(value[0])}
                      className="mt-2 w-11/12 self-center"
                    />
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
