import z from 'zod'

const PostSchema = z.object({
  title: z.string().min(1).max(200).nonoptional(),
  content: z.string().min(1).max(10000).nonoptional(),
  category: z.string().min(1).max(50).nonoptional(),
  tags: z.array(z.string()).min(1).nonoptional(),
})

const updateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).max(10000).optional(),
  category: z.string().min(1).max(50).optional(),
  tags: z.array(z.string()).min(1).optional(),
})

export function createPostSchema(data: unknown) {
  return PostSchema.safeParse(data)
}

export function updatePostSchema(data: unknown) {
  return updateSchema.safeParse(data)
}
