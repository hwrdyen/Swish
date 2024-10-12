import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { AuthContextProvider } from "./context/AuthContext.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.tsx";
import "./index.scss";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0, // Disable retries for failed queries
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GCLIENT_ID}>
      <AuthContextProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </AuthContextProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
