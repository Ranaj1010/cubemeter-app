"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader, Stack } from "rsuite";
import logo from "../public/cubemeter-temp-logo@2x.png";
export default function Page() {
	const router = useRouter();

	useEffect(() => {
		router.push("home/dashboard");
	}, []);

	return (
		<Stack justifyContent="center" alignItems="center" direction="column" spacing={100} style={{ height: "70vh" }}>
			<Image src={logo} alt="logo" width={200} height={200} />
			<Loader center vertical size="md" content="Loading. Please wait..." />
		</Stack>
	);
}
