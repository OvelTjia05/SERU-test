import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import { Textarea } from "@/components/textarea";
import {
  setBiodata,
  setCity,
  setFirstName,
  setKecamatan,
  setKelurahan,
  setLastName,
  setProvince,
} from "@/redux/slices";
import { AppDispatch, RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ChevronsUpDown, Check } from "lucide-react";
import provinceData from "@/assets/data/province.json";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/command";

type Place = {
  id: string;
  nama: string;
};

const FormBiodata = () => {
  const dispatch: AppDispatch = useDispatch();
  const form = useSelector((state: RootState) => state.form);
  const [openProvince, setOpenProvince] = useState(false);
  const [openCity, setOpenCity] = useState(false);
  const [openKecamatan, setOpenKecamatan] = useState(false);
  const [openKelurahan, setOpenKelurahan] = useState(false);
  const [cityData, setCityData] = useState<Place[]>([]);
  const [kecamatanData, setKecamatanData] = useState<Place[]>([]);
  const [kelurahanData, setKelurahanData] = useState<Place[]>([]);

  useEffect(() => {
    const loadLocationData = async () => {
      try {
        // Load City Data based on Province
        if (form.province) {
          const provinceId = provinceData.find(
            (item) => item.nama === form.province,
          )?.id;
          if (provinceId) {
            const cityRes = await import(
              `@/assets/data/kabupaten/${provinceId}.json`
            );
            setCityData(cityRes.default);
          }
        }

        // Load Kecamatan Data based on City
        if (form.city) {
          const cityId = cityData.find((item) => item.nama === form.city)?.id;
          if (cityId) {
            const kecamatanRes = await import(
              `@/assets/data/kecamatan/${cityId}.json`
            );
            setKecamatanData(kecamatanRes.default);
          }
        }

        // Load Kelurahan Data based on Kecamatan
        if (form.kecamatan) {
          const kecamatanId = kecamatanData.find(
            (item) => item.nama === form.kecamatan,
          )?.id;
          if (kecamatanId) {
            const kelurahanRes = await import(
              `@/assets/data/kelurahan/${kecamatanId}.json`
            );
            setKelurahanData(kelurahanRes.default);
          }
        }
      } catch (error) {
        console.log("error", error);
      }
    };

    loadLocationData();
  }, [form.province, form.city, form.kecamatan, cityData, kecamatanData]);

  const handleSelectProvince = (value: string) => {
    const selectedProvince = provinceData.find((item) => item.nama === value);
    dispatch(setCity(""));
    dispatch(setKecamatan(""));
    dispatch(setKelurahan(""));
    dispatch(
      setProvince(
        form.province === selectedProvince?.nama
          ? ""
          : selectedProvince?.nama || "",
      ),
    );
    setOpenProvince(false);
  };

  const handleSelectCity = (value: string) => {
    const selectedCity = cityData.find((item) => item.nama === value);
    dispatch(setKecamatan(""));
    dispatch(setKelurahan(""));
    dispatch(
      setCity(form.city === selectedCity?.nama ? "" : selectedCity?.nama || ""),
    );
    setOpenCity(false);
  };

  const handleSelectKecamatan = (value: string) => {
    const selectedKecamatan = kecamatanData.find((item) => item.nama === value);
    dispatch(setKelurahan(""));
    dispatch(
      setKecamatan(
        form.kecamatan === selectedKecamatan?.nama
          ? ""
          : selectedKecamatan?.nama || "",
      ),
    );
    setOpenKecamatan(false);
  };

  const handleSelectKelurahan = (value: string) => {
    const selectedKelurahan = kelurahanData.find((item) => item.nama === value);
    dispatch(
      setKelurahan(
        form.kelurahan === selectedKelurahan?.nama
          ? ""
          : selectedKelurahan?.nama || "",
      ),
    );
    setOpenKelurahan(false);
  };

  return (
    <div className="flex flex-col gap-8 rounded-lg border border-secondary px-2 py-4 shadow-md shadow-secondary">
      <div className="grid gap-1.5">
        <Label htmlFor="first-name">Nama Depan</Label>
        <Input
          id="first-name"
          type="text"
          placeholder="Nama Depan"
          value={form.firstName}
          onChange={(e) => dispatch(setFirstName(e.target.value))}
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="last-name">Nama Belakang</Label>
        <Input
          id="last-name"
          type="text"
          placeholder="Nama Belakang"
          value={form.lastName}
          onChange={(e) => dispatch(setLastName(e.target.value))}
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="biodata">Biodata</Label>
        <Textarea
          id="biodata"
          placeholder="Biodata"
          value={form.biodata}
          onChange={(e) => dispatch(setBiodata(e.target.value))}
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="province">Provinsi</Label>
        <Popover open={openProvince} onOpenChange={setOpenProvince}>
          <PopoverTrigger id="province" asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openProvince}
              className={`justify-between ${form.province ? "text-white" : "text-muted-foreground"}`}
            >
              {form.province
                ? provinceData.find((item) => item.nama === form.province)?.nama
                : "Pilih Provinsi..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Command>
              <CommandInput placeholder="Cari provinsi..." />
              <CommandList>
                <CommandEmpty>Provinsi tidak ditemukan.</CommandEmpty>
                <CommandGroup>
                  {provinceData.map((item) => (
                    <CommandItem
                      key={item.id}
                      value={item.nama}
                      onSelect={handleSelectProvince}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          form.province === item.nama
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      {item.nama}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div
        title={!form.province ? "Pilih provinsi terlebih dahulu" : undefined}
        className={`grid gap-1.5 ${!form.province && "opacity-50 [&_*]:cursor-not-allowed"}`}
      >
        <Label htmlFor="city">Kabupaten/Kota</Label>
        <Popover open={openCity} onOpenChange={setOpenCity}>
          <PopoverTrigger id="city" asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openCity}
              className={`justify-between ${form.city ? "text-white" : "text-muted-foreground"}`}
            >
              {form.city
                ? cityData.find((item) => item?.nama === form.city)?.nama
                : "Pilih Kabupaten/Kota..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Command>
              <CommandInput placeholder="Cari kota..." />
              <CommandList>
                <CommandEmpty>Kota tidak ditemukan.</CommandEmpty>
                <CommandGroup>
                  {cityData.map((item) => (
                    <CommandItem
                      key={item.id}
                      value={item.nama}
                      onSelect={handleSelectCity}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          form.city === item.nama ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {item.nama}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div
        title={!form.city ? "Pilih kota terlebih dahulu" : undefined}
        className={`grid gap-1.5 ${!form.city && "opacity-50 [&_*]:cursor-not-allowed"}`}
      >
        <Label htmlFor="kecamatan">Kecamatan</Label>
        <Popover open={openKecamatan} onOpenChange={setOpenKecamatan}>
          <PopoverTrigger id="kecamatan" asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openKecamatan}
              className={`justify-between ${form.kecamatan ? "text-white" : "text-muted-foreground"}`}
            >
              {form.kecamatan
                ? kecamatanData.find((item) => item.nama === form.kecamatan)
                    ?.nama
                : "Pilih Kecamatan..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Command>
              <CommandInput placeholder="Cari kecamatan..." />
              <CommandList>
                <CommandEmpty>Kecamatan tidak ditemukan.</CommandEmpty>
                <CommandGroup>
                  {kecamatanData.map((item) => (
                    <CommandItem
                      key={item.id}
                      value={item.nama}
                      onSelect={handleSelectKecamatan}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          form.kecamatan === item.nama
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      {item.nama}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div
        title={!form.kecamatan ? "Pilih kecamatan terlebih dahulu" : undefined}
        className={`grid gap-1.5 ${!form.kecamatan && "opacity-50 [&_*]:cursor-not-allowed"}`}
      >
        <Label htmlFor="kelurahan">Kelurahan</Label>
        <Popover open={openKelurahan} onOpenChange={setOpenKelurahan}>
          <PopoverTrigger id="kelurahan" asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openKelurahan}
              className={`justify-between ${form.kelurahan ? "text-white" : "text-muted-foreground"}`}
            >
              {form.kelurahan
                ? kelurahanData.find((item) => item.nama === form.kelurahan)
                    ?.nama
                : "Pilih Kelurahan..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Command>
              <CommandInput placeholder="Cari kelurahan..." />
              <CommandList>
                <CommandEmpty>Kelurahan tidak ditemukan.</CommandEmpty>
                <CommandGroup>
                  {kelurahanData.map((item) => (
                    <CommandItem
                      key={item.id}
                      value={item.nama}
                      onSelect={handleSelectKelurahan}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          form.kelurahan === item.nama
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      {item.nama}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default FormBiodata;
