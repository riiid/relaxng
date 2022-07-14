import { Span } from "https://deno.land/x/pbkit@v0.0.46/core/parser/recursive-descent-parser.ts";
import { AcceptFn, Parser } from "./index.ts";

type Accepts<T extends (AcceptFn<any>)[]> = {
  [key in keyof T]: NonNullable<ReturnType<T[key]>>;
};
export function accepts<T extends (AcceptFn<any>)[]>(
  parser: Parser,
  acceptFns: T,
): Accepts<T> | undefined {
  const result: any[] = [];
  const recovery = parser.loc;
  for (const acceptFn of acceptFns) {
    const token = acceptFn(parser);
    if (!token) return void (parser.loc = recovery);
    result.push(token);
    skipWsAndComments(parser);
  }
  return result as Accepts<T>;
}

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
    const singlelineComment = parser.accept(/^#.*(?:\r?\n|$)/);
    if (singlelineComment) continue;
    // TODO: comment
    break;
  }
}
