const queries = {
  hello: () => {
    return "Hi GraphQL";
  },
};

const mutations = {
  createUser: async (_: any, {}: {}) => {
    return "randomid";
  },
};

export const resolvers = { queries, mutations };
