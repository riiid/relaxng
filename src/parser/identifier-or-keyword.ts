import { SyntaxError } from "https://deno.land/x/pbkit@v0.0.46/core/parser/recursive-descent-parser.ts";
import * as identifierOrKeyword from "../ast/identifier-or-keyword.ts";
import * as ast from "../ast/index.ts";
import { AcceptFn, acceptKeyword, ExpectFn, keywordPattern } from "./index.ts";
import { choice } from "./misc.ts";
import { acceptIdentifier } from "./identifier.ts";

export const acceptIdentifierIdentifierorkeyword: AcceptFn<
  identifierOrKeyword.IdentifierIdentifierorkeyword
> = (parser) => {
  const identifier = acceptIdentifier(parser);
  if (!identifier) return;
  const { start, end } = identifier;
  return {
    type: "identifierOrKeyword",
    kind: "identifier",
    identifier,
    start,
    end,
  };
};

export const acceptKeywordIdentifierorkeyword: AcceptFn<
  identifierOrKeyword.KeywordIdentifierorkeyword
> = (parser) => {
  const keyword = acceptKeyword(parser);
  if (!keyword) return;
  return {
    ...keyword,
    type: "identifierOrKeyword",
    kind: "keyword",
  };
};

export const acceptIdentifierorkeyword = choice<ast.Identifierorkeyword>([
  acceptIdentifierIdentifierorkeyword,
  acceptKeywordIdentifierorkeyword,
]);

export const expectIdentifierorkeyword: ExpectFn<ast.Identifierorkeyword> = (
  parser,
) => {
  const identifierOrKeyword = acceptIdentifierorkeyword(parser);
  if (identifierOrKeyword) return identifierOrKeyword;
  throw new SyntaxError(parser, ["<TODO: identifierPattern>", keywordPattern]);
};
