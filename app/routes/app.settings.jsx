import {
  Box,
  Card,
  Page,
  Text,
  BlockStack,
  InlineGrid,
  TextField,
  Button,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useLoaderData, Form } from "@remix-run/react";
import { useState } from "react";

import prisma from "../db.server";

export async function loader() {
	let setting = await prisma.setting.findFirst();
	return Response.json(setting);
}

export async function action({ request }) {
	let setting = await request.formData();
	setting = Object.fromEntries(setting);

	await prisma.setting.upsert({
		where: {
			id: 1
		},
		update: {
			name: setting.name,
			description: setting.description
		},
		create: {
			name: setting.name,
			description: setting.description
		}
	});
	
	return Response.json(setting);
}

export default function SettingsPage() {

	const settings = useLoaderData();
	const [ formState, setFormState ] = useState(settings);

	return (
		<Page>
			<TitleBar title="Settings" />

			<BlockStack gap={{ xs: "800", sm: "400" }}>
				<InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
					<Box as="section" paddingInlineStart={{ xs: 400, sm: 0 }} paddingInlineEnd={{ xs: 400, sm: 0 }}>
						<BlockStack gap="400">
						<Text as="h3" variant="headingMd">
							Setting
						</Text>
						<Text as="p" variant="bodyMd">
							Update your settings
						</Text>
						</BlockStack>
					</Box>
					<Card roundedAbove="sm">

						<Form method="POST">
							<BlockStack gap="400">
								<TextField label="App Name" name="name" value={formState.name} onChange={(value) => setFormState({ ...formState, name: value })} />
								<TextField label="App description" name="description" value={formState.description} onChange={(value) => setFormState({ ...formState, description: value })} />
								<Button submit={true}>Save</Button>
							</BlockStack>
						</Form>

					</Card>
				</InlineGrid>
			</BlockStack>
		</Page>
	);
}
