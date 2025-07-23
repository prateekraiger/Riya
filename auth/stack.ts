import { StackClientApp } from "@stackframe/react";
import { useNavigate } from "react-router-dom";

export const stackClientApp = new StackClientApp({
  projectId: "9e5a717e-5280-4671-9e3b-35561dcd49d5",
  publishableClientKey: "pck_pn2hfm4v8k0bwvk8ytvk20ttr6gacfw2rkpa7pq76m4t8",
  tokenStore: "cookie",
  redirectMethod: {
    useNavigate,
  },
  redirectUrl: "/chat", // Redirect to chat page after authentication
});
