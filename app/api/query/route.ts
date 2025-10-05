import { NextResponse } from 'next/server';

const TARGET = 'https://nasa-hsbkagbvffb9d8dp.canadacentral-01.azurewebsites.net/api/v1/query';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const resp = await fetch(TARGET, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const text = await resp.text();
    // Try parse JSON, otherwise return raw text in a field
    let data: any;
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = { raw: text };
    }

    if (!resp.ok) {
      return NextResponse.json({ error: data, status: resp.status }, { status: 502 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}
