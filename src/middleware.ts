import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 暂时移除所有中间件逻辑
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 