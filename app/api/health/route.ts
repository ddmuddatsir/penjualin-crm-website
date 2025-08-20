// app/api/health/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    message: "Server is running",
    environment: process.env.NODE_ENV,
    firebase: {
      configured: !!(
        process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
        process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
      ),
      projectId:
        process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "not-configured",
    },
  });
}
