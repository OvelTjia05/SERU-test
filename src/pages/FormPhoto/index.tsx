import ImageInput from "@/components/image-input";

const FormPhoto = () => {
  return (
    <div className="flex flex-col gap-8 p-2">
      <ImageInput label="KTP" title="Foto KTP" />

      <ImageInput label="selfie" title="Foto Selfie" />

      <ImageInput label="anyPhoto" title="Foto Bebas" />
    </div>
  );
};

export default FormPhoto;
