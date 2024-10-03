import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/prisma/prisma-client";
 
export async function GET() {
  try {
     const settings = await prisma.settings.findUnique({
      where: {
        id: 1,
      },
    });
    return NextResponse.json(
      {
        settings,
      },
       {
         status: 200,
       },
   );
  } catch (error) { 
    return NextResponse.json({ error: 'Failed to fetch account data' }, { status: 500 });
  }
}

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  const id = 1;
  const settings = body?.settings as any;
  console.log({ settings });
  if (!settings) {
    return NextResponse.json(
      {
        error: "Settings are required",
      },
      {
        status: 400,
      },
    );
  } else {
    await prisma.settings.upsert({
      where: {
        id,
      },
      update: {
        ...settings,
      },
      create: {
        ...settings,
        id,
      },
    });
    
    return NextResponse.json(
      {
        message: "Settings updated",
      },
      {
        status: 200,
      },
    );
  }
}