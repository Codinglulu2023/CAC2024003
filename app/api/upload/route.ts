// app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Directory to save uploaded images
const uploadDirectory = path.join(process.cwd(), 'public', 'uploads');

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `${Date.now()}-${file.name}`;
  const filePath = path.join(uploadDirectory, fileName);

  // Ensure the upload directory exists
  await fs.mkdir(uploadDirectory, { recursive: true });

  // Write the file to the upload directory
  await fs.writeFile(filePath, buffer);

  return NextResponse.json({ filePath: `/uploads/${fileName}` });
}
