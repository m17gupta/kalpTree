import { getDatabase } from "@/lib/db/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { host: string } }) {
  const param = await params


  const db = await getDatabase();
  const collection = db.collection("websites");

 const website = await collection.findOne({
  primaryDomain: { $in: [param.host] }
});

  if(website){
   return NextResponse.json({ item: String(website._id) });
  }

  return  NextResponse.json({ item: null });
}
