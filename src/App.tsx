import { Router } from "./router/Router.tsx";
import { RouterProvider } from "react-router";

function App() {
  return <RouterProvider router={Router} />;
}

export default App;
