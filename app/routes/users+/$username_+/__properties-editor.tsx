import {
	FormProvider,
	getFormProps,
	getInputProps,
	useForm,
} from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { type Property } from '@prisma/client'
import { type SerializeFrom } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'

import { z } from 'zod'
import { Field } from '#app/components/forms.tsx'
import { StatusButton } from '#app/components/ui/status-button.tsx'
import { useIsPending } from '#app/utils/misc.tsx'
import { type action } from './__note-editor.server.tsx'

export const PropertyEditorSchema = z.object({
	id: z.string().optional(),
	name: z.string().min(1).max(255),
	address: z.string().min(1).max(255),
})

export function PropertyEditor({
	property,
}: {
	property?: SerializeFrom<Property>
}) {
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()
	console.log('daniel', actionData)

	const [form, fields] = useForm({
		id: 'property-editor',
		constraint: getZodConstraint(PropertyEditorSchema),
		// lastResult: actionData?.result,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: PropertyEditorSchema })
		},
		defaultValue: property,
	})

	return (
		<div>
			<h1>Property Editor </h1>
			<FormProvider context={form.context}>
				<Form
					method="POST"
					className="flex h-full flex-col gap-y-4 overflow-y-auto overflow-x-hidden px-10 pb-28 pt-12"
					{...getFormProps(form)}
				>
					<Field
						labelProps={{ htmlFor: 'name' }}
						inputProps={{
							...getInputProps(fields.name, { type: 'text' }),
						}}
					/>
					<Field
						labelProps={{ htmlFor: 'address' }}
						inputProps={{
							...getInputProps(fields.address, { type: 'text' }),
						}}
					/>
					<StatusButton
						form={form.id}
						type="submit"
						status={isPending ? 'pending' : 'idle'}
					>
						Submit
					</StatusButton>
				</Form>
			</FormProvider>
		</div>
	)
}
