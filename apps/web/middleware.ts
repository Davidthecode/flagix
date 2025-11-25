import axios from "axios";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface Session {
  user: {
    id: string;
    email: string;
    emailVerified?: boolean;
    name?: string;
  };
  session: {
    id: string;
    expires: string;
  };
}

export async function middleware(request: NextRequest) {
  let session: Session | null = null;

  try {
    const res = await axios.get(`${API_BASE_URL}/api/auth/get-session`, {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
      withCredentials: true,
    });

    session = res.data as Session;
  } catch (error: unknown) {
    console.log("error getting session =>", error);
    session = null;
  }

  console.log("session ==>", session);

  const path = request.nextUrl.pathname;
  const isAuthPage = path.startsWith("/login") || path.startsWith("/signup");
  const isPublicPath = path === "/";

  if (!session && !isAuthPage && !isPublicPath) {
    return NextResponse.redirect(new URL(`/login?from=${path}`, request.url));
  }

  if (session && isPublicPath) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (session && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
