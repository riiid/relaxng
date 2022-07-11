import {
  createRecursiveDescentParser,
  Pattern,
  RecursiveDescentParser,
  Span,
  SyntaxError,
  Token,
} from "https://deno.land/x/pbkit@v0.0.46/core/parser/recursive-descent-parser.ts";
import * as ast from "../ast/index.ts";
import { mergeSpans, skipWsAndComments } from "./misc.ts";

export type Parser = RecursiveDescentParser;

export type AcceptFn<T> = (parser: Parser) => T | undefined;
export type ExpectFn<T> = (parser: Parser) => T;

export interface ParseResult<T extends ast.AstNode = ast.Toplevel> {
  ast: T;
  parser: Parser;
  comments: Token[];
}
export function parse(text: string): ParseResult {
  const parser = createRecursiveDescentParser(text);
  const ast = expectToplevel(parser);
  const comments: Token[] = []; // TODO
  return { ast, parser, comments };
}

export const expectToplevel: ExpectFn<ast.Toplevel> = (parser) => {
  const stmts: ast.Toplevel["stmts"] = [];
  skipWsAndComments(parser);
  // TODO
  return { ...mergeSpans(stmts), type: "topLevel", stmts };
};

export const acceptQuotedidentifier: AcceptFn<ast.Quotedidentifier> = (
  parser,
) => {
  const backslash = parser.accept("\\");
  if (!backslash) return;
  const ncname = parser.expect("TODO");
  return {
    ...mergeSpans([backslash, ncname]),
    type: "quotedIdentifier",
    backslash,
    ncname,
  };
};

export const keywordPattern =
  /^(attribute|default|datatypes|div|element|empty|external|grammar|include|inherit|list|mixed|namespace|notAllowed|parent|start|string|text|token)\b/;
export const acceptKeyword: AcceptFn<ast.Keyword> = (parser) => {
  const keyword = parser.accept(keywordPattern);
  if (!keyword) return;
  return { ...keyword, type: "keyword" };
};
