import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { insertVipSignupSchema } from "@/shared/schema";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate using Zod schema
    const result = insertVipSignupSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid data", details: result.error.errors },
        { status: 400 }
      );
    }

    const data = result.data;

    // Check if email already exists
    const { data: existing, error: checkError } = await supabase
      .from('vip_signups')
      .select('id')
      .eq('email', data.email)
      .limit(1);

    if (checkError) {
      throw checkError;
    }

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: "Email already registered for VIP membership." },
        { status: 409 }
      );
    }

    // Insert into db
    const { data: newSignup, error: insertError } = await supabase
      .from('vip_signups')
      .insert([
        {
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone: data.phone || null,
        }
      ])
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    return NextResponse.json(
      { message: "VIP Signup successful", signup: newSignup },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("VIP Signup Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
