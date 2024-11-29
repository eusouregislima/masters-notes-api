import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { Article } from '../../../database/models/article';

export async function listMy(request: FastifyRequest, reply: FastifyReply) {
	const schema = z.object({
		title: z.string().max(255).optional(),
		tags: z.string().max(255).optional(),
		page: z.coerce.number().positive().optional(),
	});

	const filters = schema.parse(request.query);

	const { title, tags, page } = filters;

	const pageLimit = 3;
	const pageNumber = page ?? 1;
	const offset = pageLimit * (pageNumber - 1);

	const query = {
		'author._id': (request.user as Record<string, unknown>).id as string,
		...(title && {
			title: {
				$regex: title, // método do mongo para pesquisar pelo título
				$options: 'i', // insensitive - ignora letra maiúscula
			},
		}),
		...(tags && {
			tags: {
				$all: tags.split(',').map((tag) => tag.toLowerCase().trim()),
			},
		}),
	};

	const articles = await Article.find(query, {
		content: 0, // Faz um select - 0 não quero, 1 quero
	})
		.skip(offset)
		.limit(pageLimit);

	const articlesCount = await Article.find(query).countDocuments();

	return reply.status(200).send({
		data: articles,
		page: {
			number: pageNumber,
			totalPages: Math.ceil(articlesCount / pageLimit),
			items: articles.length,
			totalItems: articlesCount,
		},
	});
}
