import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { verifyToken } from "@/lib/auth";

export async function GET(req, { params }) {
  const client = await clientPromise;
  const db = client.db();
  const user = await db
    .collection("users")
    .findOne({ _id: new ObjectId(params.id) });
  return new Response(JSON.stringify(user));
}

export async function PUT(req, { params }) {
  const auth = req.headers.get("authorization");
  const token = auth?.split(" ")[1];
  const payload = verifyToken(token);
  if (!payload) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const client = await clientPromise;
  const db = client.db();
  await db
    .collection("users")
    .updateOne({ _id: new ObjectId(params.id) }, { $set: body });
  return new Response(JSON.stringify({ message: "User updated" }));
}

export async function DELETE(req, { params }) {
  const auth = req.headers.get("authorization");
  const token = auth?.split(" ")[1];
  const payload = verifyToken(token);
  if (!payload) return new Response("Unauthorized", { status: 401 });

  const client = await clientPromise;
  const db = client.db();
  await db.collection("users").deleteOne({ _id: new ObjectId(params.id) });
  return new Response(JSON.stringify({ message: "User deleted" }));
}
