import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Label } from "@/components/label";

const FormPreview = () => {
  const form = useSelector((state: RootState) => state.form);

  return (
    <div className="mx-auto max-w-4xl rounded-lg p-8 shadow-md">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div className="flex flex-col gap-4 [&>div]:grid [&>div]:gap-1.5">
          <div>
            <Label>Nama Depan</Label>
            <p className="text-lg font-medium">{form.firstName}</p>
          </div>
          <div>
            <Label>Nama Belakang</Label>
            <p className="text-lg font-medium">{form.lastName}</p>
          </div>
          <div>
            <Label>Biodata</Label>
            <p className="text-lg font-medium">{form.biodata}</p>
          </div>
          <div>
            <Label>Provinsi</Label>
            <p className="text-lg font-medium">{form.province}</p>
          </div>
          <div>
            <Label>Kabupaten/Kota</Label>
            <p className="text-lg font-medium">{form.city}</p>
          </div>
          <div>
            <Label>Kecamatan</Label>
            <p className="text-lg font-medium">{form.kecamatan}</p>
          </div>
          <div>
            <Label>Kelurahan</Label>
            <p className="text-lg font-medium">{form.kelurahan}</p>
          </div>
        </div>
        <div className="flex flex-col gap-4 [&>div]:grid [&>div]:gap-1.5">
          <div>
            <Label>KTP</Label>
            {form.KTP ? (
              <img
                src={form.KTP.base64}
                alt="KTP Preview"
                className="h-auto w-full rounded-md shadow-md"
              />
            ) : (
              <p className="text-gray-500">Tidak ada gambar KTP</p>
            )}
          </div>
          <div>
            <Label>Selfie</Label>
            {form.selfie ? (
              <img
                src={form.selfie.base64}
                alt="Selfie Preview"
                className="h-auto w-full rounded-md shadow-md"
              />
            ) : (
              <p className="text-gray-500">Tidak ada gambar selfie</p>
            )}
          </div>
          <div>
            <Label>Foto Bebas</Label>
            {form.anyPhoto ? (
              <img
                src={form.anyPhoto.base64}
                alt="Foto Bebas Preview"
                className="h-auto w-full rounded-md shadow-md"
              />
            ) : (
              <p className="text-gray-500">Tidak ada gambar foto bebas</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormPreview;
