import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { signToken } from "@/lib/auth";
import bcrypt from "bcrypt";

export async function POST(req) {
  const { email, password } = await req.json();

  await dbConnect();

  const user = await User.findOne({ email });

  if (!user) {
    return new Response("Invalid email or password", { status: 401 });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return new Response(
      JSON.stringify({ message: "Invalid email or password" }),
      { status: 401 }
    );
  }

  const token = signToken({ user_id: user._id.toString() });

  return new Response(
    JSON.stringify({
      message: "Login successful",
      token,
      user_id: user._id,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
