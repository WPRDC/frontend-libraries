import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

export function parseAndSanitize(content: string) {
  return {
    __html: sanitizeHtml(marked.parse(content)),
  };
}
