import UserService, {
  CreateUserPayload,
  GetUserTokenPayload,
} from "../../services/user";

const queries = {
  getUserToken: async (_: any, payload: GetUserTokenPayload) => {
    return await UserService.getUserToken(payload);
  },
  getLoggedInUser: async (_: any, payload: any, context: any) => {
    if (context && context.user) {
      const userFound = await UserService.getUserById(context.user.id);
      return userFound;
    } else {
      throw new Error("User not found");
    }
  },
};

const mutations = {
  createUser: async (_: any, payload: CreateUserPayload) => {
    const response = await UserService.createUser(payload);
    return response.id;
  },
};

export const resolvers = { queries, mutations };
