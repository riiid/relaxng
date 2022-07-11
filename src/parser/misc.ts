import { Span } from "https://deno.land/x/pbkit@v0.0.46/core/parser/recursive-descent-parser.ts";
import { AcceptFn, Parser } from "./index.ts";

export function choice<T>(acceptFns: AcceptFn<T>[]): AcceptFn<T> {
  return function accept(parser) {
    for (const acceptFn of acceptFns) {
      const node = acceptFn(parser);
      if (node) return node;
    }
  };
}

export type Spans = (undefined | Span | (undefined | Span)[])[];
export function mergeSpans(spans: Spans): Span {
  let start = Infinity;
  let end = -Infinity;
  for (let i = 0; i < spans.length; ++i) {
    if (spans[i] == null) continue;
    const span = Array.isArray(spans[i])
      ? mergeSpans(spans[i] as Span[])
      : spans[i] as Span;
    start = Math.min(start, span.start);
    end = Math.max(end, span.end);
  }
  return { start, end };
}

const whitespacePattern = /^\s+/;
export function skipWsAndComments(parser: Parser): void {
  while (true) {
    const whitespace = parser.accept(whitespacePattern);
    if (whitespace) continue;
    // TODO: comment
    break;
  }
}
