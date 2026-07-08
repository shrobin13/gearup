import { PrismaPg } from "@prisma/adapter-pg";
import config from '../config/index.js';
import { PrismaClient } from "@prisma/client/extension";

const connectionString = config.database_url;

const adapter = new PrismaPg({ connectionString });
const prisma = PrismaClient({ adapter });

export { prisma };

