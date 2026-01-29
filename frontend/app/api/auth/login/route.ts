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
      console.error('Backend error:', data.errors);
      return NextResponse.json(
        { message: data.errors[0].message },
        { status: 400 }
      );
    }

    if (!data.data || !data.data.login) {
      console.error('Invalid response from backend:', data);
      return NextResponse.json(
        { message: 'Invalid login response' },
        { status: 400 }
      );
    }

    const { user, accessToken, refreshToken } = data.data.login;
    console.log('Login successful, setting cookies for user:', user.email);

    const res = NextResponse.json({ user, accessToken }, { status: 200 });

    // Set cookies for HTTP same-host
    const maxAge = 7 * 24 * 60 * 60; // 7 days

    res.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      path: '/',
      maxAge,
      sameSite: 'lax',
      secure: false,
    });

    res.cookies.set('accessToken', accessToken, {
      httpOnly: false,
      path: '/',
      maxAge,
      sameSite: 'lax',
      secure: false,
    });

    console.log('Cookies set:', ['refreshToken', 'accessToken']);
    return res;
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { message: 'Authentication failed' },
      { status: 500 }
    );
  }
}
