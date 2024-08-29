import { Button } from "@/components/button";
import { RootState } from "@/redux/store";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = ["/step-1", "/step-2", "/step-3"];
  const current = path.indexOf(location.pathname);
  const header = ["Identitas", "Foto", "Pratinjau"];
  const form = useSelector((state: RootState) => state.form);

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
    console.log("submit :", form);
  };

  const handleNavigate = (value: string) => {
    if (value === "-") {
      navigate(path[current - 1 < 0 ? 0 : current - 1].split("/")[1]);
    } else {
      if (current === path.length - 1) {
        handleSubmit();
      }
      navigate(
        path[
          current + 1 > path.length - 1 ? path.length - 1 : current + 1
        ].split("/")[1],
      );
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
        onClick={() => handleNavigate("+")}
        className="absolute bottom-4 left-1/2 -translate-x-1/2"
      >
        {current === path.length - 1 ? "Kirim" : "Selanjutnya"}
      </Button>
    </div>
  );
};

export default Layout;
