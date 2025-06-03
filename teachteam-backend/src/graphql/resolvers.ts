import { Admin } from "../entity/Admin";
import { AppDataSource } from "../data-source";

const adminRepository = AppDataSource.getRepository(Admin);

export const resolvers = {
    Query: {
        admins: async () => {
            const admins = await adminRepository.find();
            return admins;
        }
    },
    Mutation: {

    },
};