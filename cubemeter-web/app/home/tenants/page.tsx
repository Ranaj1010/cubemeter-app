"use client";

import { BreadCrumbComponent } from "@/components/breadcrumbs";
import { Button, Stack } from "rsuite";
const Page = () => {
	return (
		<Stack direction="column" spacing={20} alignItems="flex-start">
			<BreadCrumbComponent
				currentTitle="Tenants"
				breadCrumbs={[
					{
						title: "Home",
						href: "/home/dashboard",
					},
					{
						title: "Tenants",
						active: true,
					},
				]}
			/>
			<Button appearance="primary">Create Tenant</Button>
		</Stack>
	);
};

export default Page;
