import React from "react";
import ReactDOM from "react-dom";
import { AuthProvider } from "./contexts/AuthProvider";

import App from "./App";
import "./index.css";
import "tailwindcss/tailwind.css";

ReactDOM.render(
     <AuthProvider>
          <App />
     </AuthProvider>,
     document.getElementById("root")
);
