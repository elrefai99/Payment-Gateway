import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const poolConfig = {
     connectionString: process.env.DATABASE_URL!,
     ssl: true
};

const adapter = new PrismaNeon(poolConfig);
const prisma = new PrismaClient({ adapter });

export default prisma;
