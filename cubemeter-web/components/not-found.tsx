"use client";

import { useRouter } from "next/navigation";
import { Button, Stack } from "rsuite";

const NotFoundComponent = () => {
	const router = useRouter();

	return (
		<Stack direction="column" alignItems="flex-start" justifyContent="center" spacing={5}>
			<h2>Not Found</h2>
			<h5>Could not find requested resource</h5>
			<br />
			<Button appearance="primary" onClick={() => router.back()}>
				Go back
			</Button>
		</Stack>
	);
};

export default NotFoundComponent;
