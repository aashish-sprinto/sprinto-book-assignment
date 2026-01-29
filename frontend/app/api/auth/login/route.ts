import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const query = `
      mutation Login($input: LoginInput!) {
        login(input: $input) {
          user {
            id
            email
            name
            role
          }
          accessToken
          refreshToken
        }
      }
    `;

    const response = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        variables: {
          input: { email, password },
        },
      }),
    });

    const data = await response.json();

    if (data.errors) {
      return NextResponse.json(
        { message: data.errors[0].message },
        { status: 400 }
      );
    }

    const { user, accessToken, refreshToken } = data.data.login;

    const res = NextResponse.json({ user, accessToken }, { status: 200 });

    // Minimal cookie attributes to work on same-host deployments.
    // Use HttpOnly for refresh token. SameSite=lax is safe for same-site flows.
    const maxAge = 7 * 24 * 60 * 60; // 7 days
    res.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      path: '/',
      maxAge,
      sameSite: 'lax',
    });

    // Optionally set accessToken as a readable cookie for client JS (not HttpOnly)
    res.cookies.set('accessToken', accessToken, {
      httpOnly: false,
      path: '/',
      maxAge,
      sameSite: 'lax',
    });

    return res;
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { message: 'Authentication failed' },
      { status: 500 }
    );
  }
}
