"use client";

import { Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import UpdateSubmissionForm from "../forms/update-submission-form";

export default function UpdateSubmissionDialog({ id }: { id: string }) {
	const [open, setOpen] = useState(false);

	return (
		<>
			<Button variant="outline" size="sm" onClick={() => setOpen(true)}>
				<Pencil className="mr-2 size-4" />
				Edit
			</Button>

			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
					<DialogHeader>
						<DialogTitle>Edit project submission</DialogTitle>
						<DialogDescription>
							Update your project details, technologies, links, and screenshots.
						</DialogDescription>
					</DialogHeader>

					<UpdateSubmissionForm id={id} onCancel={() => setOpen(false)} />
				</DialogContent>
			</Dialog>
		</>
	);
}
