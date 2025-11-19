import { Suspense } from "react";
import LoginGateClient from "./LoginGateClient";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginGateClient />
    </Suspense>
  );
}
