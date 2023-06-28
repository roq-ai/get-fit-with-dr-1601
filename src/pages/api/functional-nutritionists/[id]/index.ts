import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { functionalNutritionistValidationSchema } from 'validationSchema/functional-nutritionists';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.functional_nutritionist
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getFunctionalNutritionistById();
    case 'PUT':
      return updateFunctionalNutritionistById();
    case 'DELETE':
      return deleteFunctionalNutritionistById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getFunctionalNutritionistById() {
    const data = await prisma.functional_nutritionist.findFirst(
      convertQueryToPrismaUtil(req.query, 'functional_nutritionist'),
    );
    return res.status(200).json(data);
  }

  async function updateFunctionalNutritionistById() {
    await functionalNutritionistValidationSchema.validate(req.body);
    const data = await prisma.functional_nutritionist.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    if (req.body.name) {
      await roqClient.asUser(roqUserId).updateTenant({ id: user.tenantId, tenant: { name: req.body.name } });
    }
    return res.status(200).json(data);
  }
  async function deleteFunctionalNutritionistById() {
    const data = await prisma.functional_nutritionist.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
