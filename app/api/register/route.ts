import { NextRequest, NextResponse } from "next/server";
import { usersService } from "@/services/firebase";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["SALES", "MANAGER"]),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Data tidak valid" },
        { status: 400 }
      );
    }
    const { name, email, role } = parsed.data;

    // Check if user already exists
    const existingUsers = await usersService.getUsers();
    const existing = existingUsers.find((user) => user.email === email);
    if (existing) {
      return NextResponse.json(
        { message: "Email sudah terdaftar" },
        { status: 400 }
      );
    }

    // Create new user in Firebase
    const newUserId = await usersService.create({
      name,
      email,
      role: role === "SALES" ? "SALES_REP" : "MANAGER",
      avatar: undefined,
      isActive: true,
      lastLoginAt: undefined,
      settings: {
        timezone: "Asia/Jakarta",
        notifications: true,
        emailUpdates: true,
      },
    });

    return NextResponse.json(
      { message: "Registrasi berhasil", userId: newUserId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
