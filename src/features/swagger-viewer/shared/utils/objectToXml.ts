export function objectToXml(obj: unknown, rootTag = 'root', indent = 0): string {
  const pad = '  '.repeat(indent);

  if (obj === null || obj === undefined) {
    return `${pad}<${rootTag}/>`;
  }

  if (Array.isArray(obj)) {
    if (obj.length === 0) return `${pad}<${rootTag}/>`;
    return obj.map((item) => objectToXml(item, rootTag, indent)).join('\n');
  }

  if (typeof obj === 'object') {
    const entries = Object.entries(obj as Record<string, unknown>);
    if (entries.length === 0) return `${pad}<${rootTag}/>`;
    const children = entries.map(([key, val]) => objectToXml(val, key, indent + 1)).join('\n');
    return `${pad}<${rootTag}>\n${children}\n${pad}</${rootTag}>`;
  }

  return `${pad}<${rootTag}>${String(obj)}</${rootTag}>`;
}
