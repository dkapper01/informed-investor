import { parseWithZod } from '@conform-to/zod'
import { json, type ActionFunctionArgs } from '@remix-run/node'
import { z } from 'zod'
import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'

export const PropertyEditorSchema = z.object({
	id: z.string().optional(),
	name: z.string().min(1).max(255),
	address: z.string().min(1).max(255),
})

export async function action({ request }: ActionFunctionArgs) {
	const userId = await requireUserId(request)
	const formData = await request.formData()
	const submission = parseWithZod(formData, {
		schema: PropertyEditorSchema,
	})

	if (submission.status !== 'success') {
		return submission.reply()
	}

	const newProperty = await prisma.property.create({
		data: {
			name: submission.value.name,
			address: submission.value.address,
			ownerId: userId,
		},
	})

	return json({ submission, newProperty })
}
