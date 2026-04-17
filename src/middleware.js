import { authMiddleware } from "@clerk/nextjs/server";

// See https://clerk.com/docs/references/nextjs/auth-middleware
// for more information about configuring your Middleware

// This middleware is deprecated in Clerk 5.x, but we use the new clerkMiddleware if using 5.x.
// Let's check which version we installed by looking at package.json or using clerkMiddleware.
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/signals(.*)',
  '/compare(.*)',
  '/watchlist(.*)',
  '/token(.*)',
  '/pricing(.*)',
  '/api/webhooks(.*)',
  '/api/analyze(.*)',
  '/api/search(.*)',
  '/api/trending(.*)',
  '/api/signals(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
