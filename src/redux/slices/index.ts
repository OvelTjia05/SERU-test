import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type FileData = {
  name: string;
  size: string;
  base64: string;
};

export type FormState = {
  firstName: string;
  lastName: string;
  biodata: string;
  province: string;
  city: string;
  kecamatan: string;
  kelurahan: string;
  selfie: FileData | null;
  KTP: FileData | null;
  anyPhoto: FileData | null;
};

const initialState: FormState = {
  firstName: "",
  lastName: "",
  biodata: "",
  province: "",
  city: "",
  kecamatan: "",
  kelurahan: "",
  selfie: null,
  KTP: null,
  anyPhoto: null,
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setFirstName: (state, action: PayloadAction<string>) => {
      state.firstName = action.payload;
    },
    setLastName: (state, action: PayloadAction<string>) => {
      state.lastName = action.payload;
    },
    setBiodata: (state, action: PayloadAction<string>) => {
      state.biodata = action.payload;
    },
    setProvince: (state, action: PayloadAction<string>) => {
      state.province = action.payload;
    },
    setCity: (state, action: PayloadAction<string>) => {
      state.city = action.payload;
    },
    setKecamatan: (state, action: PayloadAction<string>) => {
      state.kecamatan = action.payload;
    },
    setKelurahan: (state, action: PayloadAction<string>) => {
      state.kelurahan = action.payload;
    },
    setSelfie: (state, action: PayloadAction<FileData | null>) => {
      state.selfie = action.payload;
    },
    setKTP: (state, action: PayloadAction<FileData | null>) => {
      state.KTP = action.payload;
    },
    setAnyPhoto: (state, action: PayloadAction<FileData | null>) => {
      state.anyPhoto = action.payload;
    },
  },
});

export const {
  setFirstName,
  setLastName,
  setBiodata,
  setProvince,
  setCity,
  setKecamatan,
  setKelurahan,
  setSelfie,
  setKTP,
  setAnyPhoto,
} = formSlice.actions;

export default formSlice.reducer;
