import { useEffect } from "react";
import { useRouter } from "next/router";
import { getUser } from "@/lib/auth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const user = getUser();
    if (user) {
      router.push("/attendance");
    } else {
      router.push("/login");
    }
  }, [router]);

  return null;
}
