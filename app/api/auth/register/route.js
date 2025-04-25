import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcrypt";

export async function POST(req) {
  const { name, email, password } = await req.json();

  await dbConnect();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return new Response(JSON.stringify({ message: "User already exists" }), {
      status: 400,
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });

  const savedUser = await newUser.save();

  return new Response(
    JSON.stringify({
      message: "User registered",
      userId: savedUser._id,
    }),
    { status: 201 }
  );
}
