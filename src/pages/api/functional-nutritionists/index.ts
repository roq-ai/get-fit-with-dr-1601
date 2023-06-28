import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { functionalNutritionistValidationSchema } from 'validationSchema/functional-nutritionists';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getFunctionalNutritionists();
    case 'POST':
      return createFunctionalNutritionist();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getFunctionalNutritionists() {
    const data = await prisma.functional_nutritionist
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'functional_nutritionist'));
    return res.status(200).json(data);
  }

  async function createFunctionalNutritionist() {
    await functionalNutritionistValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.meal_plan?.length > 0) {
      const create_meal_plan = body.meal_plan;
      body.meal_plan = {
        create: create_meal_plan,
      };
    } else {
      delete body.meal_plan;
    }
    const data = await prisma.functional_nutritionist.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
