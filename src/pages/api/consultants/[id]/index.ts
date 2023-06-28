import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { consultantValidationSchema } from 'validationSchema/consultants';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.consultant
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getConsultantById();
    case 'PUT':
      return updateConsultantById();
    case 'DELETE':
      return deleteConsultantById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getConsultantById() {
    const data = await prisma.consultant.findFirst(convertQueryToPrismaUtil(req.query, 'consultant'));
    return res.status(200).json(data);
  }

  async function updateConsultantById() {
    await consultantValidationSchema.validate(req.body);
    const data = await prisma.consultant.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteConsultantById() {
    const data = await prisma.consultant.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
