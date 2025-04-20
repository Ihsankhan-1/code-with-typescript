import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in',
  '/sign-up',
  '/api/clerk-webhook',
  '/api/drive-activity/notification',
  '/api/payment/success',
]);

const isIgnoredRoute = createRouteMatcher([
  '/api/auth/callback/discord',
  '/api/auth/callback/notion',
  '/api/auth/callback/slack',
  '/api/flow',
  '/api/cron/wait',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isIgnoredRoute(req)) return;

  if (!isPublicRoute(req)) {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }
    console.log('🔐 Is Public:', isPublicRoute(req));
    console.log('🕵️ Is Ignored:', isIgnoredRoute(req));
    console.log('👤 userId:', userId);
  }
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
