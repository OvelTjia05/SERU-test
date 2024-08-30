import { Button } from "@/components/button";
import Loader from "@/components/loader";
import { Toaster } from "@/components/toaster";
import { useToast } from "@/components/use-toast";
import { FormState } from "@/redux/slices";
import { RootState } from "@/redux/store";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const path = ["/step-1", "/step-2", "/step-3"];
  const current = path.indexOf(location.pathname);
  const header = ["Identitas", "Foto", "Pratinjau"];
  const form = useSelector((state: RootState) => state.form);
  const [loading, setIsLoading] = useState(false);

  // prevent user reloading page
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      return "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleSubmit = () => {
    setIsLoading(true);
    console.log("submit :", form);
    setTimeout(() => {
      toast({
        title: "Sukses !!",
        description: "Data Berhasil Disimpan",
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleNavigate = (value: string) => {
    const requiredFieldsStep1: (keyof FormState)[] = [
      "firstName",
      "lastName",
      "biodata",
      "province",
      "city",
      "kecamatan",
      "kelurahan",
    ];
    const requiredFieldsStep2: (keyof FormState)[] = [
      "selfie",
      "KTP",
      "anyPhoto",
    ];

    if (value === "-") {
      navigate(path[current - 1 < 0 ? 0 : current - 1].split("/")[1]);
    } else {
      // validate every navigating step
      if (current === 0) {
        const step1FieldsFilled = requiredFieldsStep1.every(
          (field) => form[field],
        );

        if (!step1FieldsFilled) {
          toast({
            title: "Error",
            description: "Harap isi semua field identitas",
            variant: "destructive",
          });
          return;
        }
      } else if (current === 1) {
        const step2FieldsFilled = requiredFieldsStep2.every(
          (field) => form[field] !== null,
        );

        if (!step2FieldsFilled) {
          toast({
            title: "Error",
            description: "Harap isi semua field foto",
            variant: "destructive",
          });
          return;
        }
      }

      // submit if it's the last step, otherwise navigate to the next step
      if (current === path.length - 1) {
        handleSubmit();
      } else {
        navigate(path[current + 1].split("/")[1]);
      }
    }
  };

  return (
    <div className="relative mx-auto flex min-h-screen max-w-screen-md flex-col py-4">
      <div className="fixed left-0 right-0 top-0 bg-background p-2">
        <div className="mx-auto flex w-full max-w-screen-md gap-3">
          <Button
            variant={"link"}
            className="inline-flex h-fit p-0"
            onClick={() => handleNavigate("-")}
          >
            <ArrowLeft className="h-8 w-8 rounded-full stroke-primary stroke-[3px] shadow" />
          </Button>
          <h1 className="text-2xl font-bold leading-none text-primary">
            {header[current]}
          </h1>
        </div>
      </div>
      <div className="px-2 pb-16 pt-10">
        <Outlet />
      </div>
      <Button
        disabled={loading}
        className={`absolute bottom-4 left-1/2 -translate-x-1/2`}
        onClick={() => handleNavigate("+")}
      >
        {current === path.length - 1 ? "Kirim" : "Selanjutnya"}
      </Button>
      <Toaster />
      {loading && <Loader label="Loading..." />}
    </div>
  );
};
export default Layout;
