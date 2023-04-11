"use client";

import { BreadCrumbComponent } from "@/components/breadcrumbs";
import { Stack } from "rsuite";

export default function Page() {
	return (
		<Stack direction="column" spacing={20} alignItems="flex-start">
			<BreadCrumbComponent
				currentTitle="Dashboard"
				breadCrumbs={[
					{
						title: "Home",
						href: "/home",
					},
					{
						title: "Overview",
						href: "/home/dashboard",
						active: true,
					},
					{
						title: "Dashboard",
						active: true,
					},
				]}
			/>
		</Stack>
	);
}
