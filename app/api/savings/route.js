import dbConnect from "@/lib/mongodb";
import Saving from "@/models/Saving";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { name, amount, savingType } = body;

    if (!name || !amount || !savingType) {
      return NextResponse.json(
        { success: false, error: "Name and target amount are required" },
        { status: 400 }
      );
    }

    const saving = new Saving({
      name,
      amount,
      savingType,
    });

    await saving.save();

    return NextResponse.json({
      success: true,
      data: saving,
    });
  } catch (error) {
    console.error("Error saving goal:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to save goal",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const search = searchParams.get("search");
    const goalType = searchParams.get("goalType");
    let query = {};

    if (search) {
      query = { $text: { $search: search } };
    }

    if (goalType) {
      query.savingType = goalType;
    }

    const [savings, total] = await Promise.all([
      Saving.find(query).skip(skip).limit(limit),
      Saving.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: savings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching savings:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch savings",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
