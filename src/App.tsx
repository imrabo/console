import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import AppProviders from "../../frontend/src/providers/AppProviders";

function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
}

export default App;
