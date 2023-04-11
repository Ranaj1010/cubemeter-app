"use client";

import { BreadCrumbComponent } from "@/components/breadcrumbs";
import { Button, Stack } from "rsuite";
const Page = () => {
	return (
		<Stack direction="column" spacing={20} alignItems="flex-start">
			<BreadCrumbComponent
				currentTitle="Meters"
				breadCrumbs={[
					{
						title: "Home",
						href: "/home/dashboard",
					},
					{
						title: "Meters",
						active: true,
					},
				]}
			/>
			<Button appearance="primary">Create Meter</Button>
		</Stack>
	);
};

export default Page;
