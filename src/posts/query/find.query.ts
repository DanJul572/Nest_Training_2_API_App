export const findMany = {
  include: {
    author: {
      select: {
        name: true,
        email: true,
      },
    },
  },
};
