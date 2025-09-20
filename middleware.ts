// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server'

// const isPublicRoute = createRouteMatcher(["/"]); // Add public routes here

// export default clerkMiddleware((auth, req) => {
//   if (isPublicRoute(req)) return;
//   auth.protect();
// });

// export const config = {
//   matcher: [
//     "/((?!_next|.*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//     "/(api|trpc)(.*)",
//   ],
// };

export function middleware(request: Request) {
  const response = NextResponse.next()
  response.headers.set('Cache-Control', 'no-store, max-age=0')
  response.headers.set('Pragma', 'no-cache')
  return response
}