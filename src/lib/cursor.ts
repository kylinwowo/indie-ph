export type CursorPayload = {
  createdAt: string;
  id: number;
};

export function encodeCursor(payload: CursorPayload): string {
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

export function decodeCursor(cursor: string | null): CursorPayload | null {
  if (!cursor) return null;
  try {
    const json = Buffer.from(cursor, 'base64').toString('utf8');
    const obj = JSON.parse(json) as CursorPayload;
    if (
      typeof obj === 'object' &&
      obj !== null &&
      typeof obj.createdAt === 'string' &&
      typeof obj.id === 'number'
    ) {
      return obj;
    }
    return null;
  } catch {
    return null;
  }
}
