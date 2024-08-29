import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "./pages/Layout";
import FormBiodata from "./pages/FormBiodata";
import FormPhoto from "./pages/FormPhoto";
import FormPreview from "./pages/FormPreview";

export const routerList = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="step-1" replace />,
      },
      {
        path: "step-1",
        element: <FormBiodata />,
      },
      {
        path: "step-2",
        element: <FormPhoto />,
      },
      {
        path: "step-3",
        element: <FormPreview />,
      },
    ],
  },
]);
