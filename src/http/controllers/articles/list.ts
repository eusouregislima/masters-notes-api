import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { Article } from '../../../database/models/article';

export async function list(request: FastifyRequest, reply: FastifyReply) {
	const schema = z.object({
		title: z.string().max(255).optional(),
	});

	const filters = schema.parse(request.query);

	const { title } = filters;

	const articles = await Article.find(
		{
			...(title && {
				title: {
					$regex: title, // método do mongo para pesquisar pelo título
					$options: 'i', // insensitive - ignora letra maiúscula
				},
			}),
		},
		{
			content: 0, // Faz um select - 0 não quero, 1 quero
		},
	);

	return reply.status(200).send({ data: articles });
}
