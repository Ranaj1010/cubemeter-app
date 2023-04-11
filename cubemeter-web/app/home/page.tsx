"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
	const router = useRouter();
	useEffect(() => {
		router.push("/home/dashboard");
	}, []);
	return <h1>This is Home Page</h1>;
}
