import type { FastifyReply, FastifyRequest } from 'fastify';
import { Types } from 'mongoose';
import slugify from 'slugify';
import { z } from 'zod';
import { Article } from '../../../database/models/article';
import { AppError } from '../../../errors/app-error';
import { BadRequestError } from '../../../errors/bad-request-error';

export async function create(request: FastifyRequest, reply: FastifyReply) {
	//TODO validar dados de entrada do usuário

	const schema = z.object({
		title: z.string().max(255),
		subtitle: z.string().max(500),
		content: z.string(),
		tags: z.array(z.string()),
	});

	const data = schema.parse(request.body);

	const { title, subtitle, content, tags } = data;

	const slug = slugify(title, {
		replacement: '-',
		remove: undefined,
		lower: true,
		strict: true,
		locale: 'vi',
		trim: true,
	});

	const author = {
		_id: new Types.ObjectId(),
		name: 'Regis Lima',
	};

	const uniqueSlug = `${slug}-${author._id}`;

	const findArticle = await Article.find({ slug: uniqueSlug });

	if (findArticle.length) {
		throw new BadRequestError('Article title already exists.');
	}

	console.log(findArticle);

	// TODO verificar se slug já foi criado

	const createdArticle = await Article.create({
		slug: uniqueSlug, //TODO melhorar hash do slug
		title,
		subtitle,
		content,
		tags,
		author,
	});

	return reply.status(201).send(createdArticle);
}
