'use server';

import { prisma } from '@repo/database';

export async function checkDatabaseConnection() {
  const dbUrl = process.env.DATABASE_URL;
  console.log("🔍 ENV CHECK - DATABASE_URL:", dbUrl ? dbUrl : "UNDEFINED");

  try {
    const userCount = await prisma.profile.count();
    return { success: true, count: userCount, message: "Connected to Supabase via Prisma 7" };
  } catch (error) {
    console.error("Prisma Connection Error:", error);
    return { success: false, error: "Database connection failed" };
  }
}