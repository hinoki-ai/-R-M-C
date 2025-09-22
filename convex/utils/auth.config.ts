import { Auth } from 'convex/server';

// Utility function to get the current user ID from Clerk auth
export const getUserId = async (ctx: { auth: Auth }) => {
  return (await ctx.auth.getUserIdentity())?.subject;
};

export default {
    providers: [
      {
        domain: process.env.NEXT_PUBLIC_CLERK_FRONTEND_API_URL,
        applicationID: 'convex',
      },
    ]
  };