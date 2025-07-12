import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/auth';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const APPLICATIONS_FILE = path.join(DATA_DIR, 'applications.json');

async function readApplications() {
  try {
    if (existsSync(APPLICATIONS_FILE)) {
      const data = await readFile(APPLICATIONS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading applications:', error);
  }
  return [];
}

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const token = request.cookies.get('admin-token')?.value;
    if (!token || !(await verifyAdminToken(token))) {
      return NextResponse.json(
        { error: 'Nicht autorisiert' },
        { status: 401 }
      );
    }

    const applications = await readApplications();
    
    // Calculate stats
    const stats = {
      total: applications.length,
      paid: applications.filter((app: any) => app.status !== 'pending').length,
      pending: applications.filter((app: any) => app.status === 'pending').length,
      revenue: applications.filter((app: any) => app.status !== 'pending').length * 14.99
    };

    // Sort applications by creation date (newest first)
    const sortedApplications = applications.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({ 
      applications: sortedApplications,
      stats 
    });
  } catch (error) {
    console.error('Error fetching admin applications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}