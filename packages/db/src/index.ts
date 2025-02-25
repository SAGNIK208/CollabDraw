import { PrismaClient,Shapes} from "@prisma/client";

export const prisma = new PrismaClient();

export const shapes = Shapes;