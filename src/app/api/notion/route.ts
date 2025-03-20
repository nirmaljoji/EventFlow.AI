import { NotionAPI } from 'notion-client';
import { NextResponse } from 'next/server';

const notion = new NotionAPI();

export async function GET() {
  try {
    const pageId = process.env.NEXT_PUBLIC_NOTION_PAGE_ID;
    if (!pageId) {
      throw new Error('Notion page ID not configured');
    }

    // Remove any hyphens from the page ID
    const cleanPageId = pageId.replace(/-/g, '');

    try {
      const recordMap = await notion.getPage(cleanPageId);
      return NextResponse.json(recordMap);
    } catch (notionError: any) {
      console.error('Notion API Error:', notionError);
      return NextResponse.json(
        { 
          error: 'Notion API Error',
          details: notionError.message,
          code: notionError.code
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Server Error:', error);
    return NextResponse.json(
      { 
        error: 'Server Error',
        details: error.message
      },
      { status: 500 }
    );
  }
} 