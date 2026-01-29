import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    const query = `
      mutation Signup($input: SignupInput!) {
        signup(input: $input) {
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
          input: { email, password, name },
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

    return NextResponse.json(data.data.signup);
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Signup failed' },
      { status: 500 }
    );
  }
}
