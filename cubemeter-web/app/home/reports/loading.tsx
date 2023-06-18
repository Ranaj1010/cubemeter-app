"use client";

import { BreadCrumbComponent } from "@/components/breadcrumbs";
import { Placeholder, Stack } from "rsuite";

export default function Loading() {
	// You can add any UI inside Loading, including a Skeleton.
	return (
		<Stack direction="column" spacing={20} alignItems="stretch">
			<BreadCrumbComponent
				currentTitle="Reports"
				breadCrumbs={[
					{
						title: "Home",
						href: "/home/dashboard",
					},
					{
						title: "Reports",
						active: true,
					},
				]}
			/>
			<Placeholder.Grid></Placeholder.Grid>
		</Stack>
	);
}
