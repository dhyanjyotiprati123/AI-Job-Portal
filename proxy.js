
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function proxy(request) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/auth/login")) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    const role = payload.role;

    if (pathname.startsWith("/dashboard/student") && role !== "student") {
      return NextResponse.redirect(new URL("/dashboard/recruiter", request.url));
    }

    if (pathname.startsWith("/dashboard/recruiter") && role !== "recruiter") {
      return NextResponse.redirect(new URL("/dashboard/student", request.url));
    }

    if (pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/auth/admin", request.url));
    }

  } catch (error) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
  ],
};

