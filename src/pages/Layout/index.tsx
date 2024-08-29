import { Button } from "@/components/button";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = ["/step-1", "/step-2", "/step-3"];
  const current = path.indexOf(location.pathname);
  const header = ["Identitas", "Foto", "Pratinjau"];

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

  const handleNavigate = (value: string) => {
    if (value === "-") {
      navigate(path[current - 1 < 0 ? 0 : current - 1]);
    } else {
      navigate(
        path[current + 1 > path.length - 1 ? path.length - 1 : current + 1],
      );
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col p-4">
      <div className="fixed left-0 right-0 top-0 flex items-center gap-3 bg-background px-6 py-2">
        <Button
          variant={"link"}
          className="inline-flex h-fit p-0"
          onClick={() => handleNavigate("-")}
        >
          <ArrowLeft className="h-8 w-8 rounded-full stroke-primary stroke-[3px] shadow" />
        </Button>
        <h1 className="text-2xl font-bold text-primary">{header[current]}</h1>
      </div>
      <div className="pb-12 pt-10">
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
