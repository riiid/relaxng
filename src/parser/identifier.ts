import { SyntaxError } from "https://deno.land/x/pbkit@v0.0.46/core/parser/recursive-descent-parser.ts";
import * as identifier from "../ast/identifier.ts";
import * as ast from "../ast/index.ts";
import {
  AcceptFn,
  acceptQuotedidentifier,
  ExpectFn,
  ncnamePattern,
} from "./index.ts";
import { choice } from "./misc.ts";

export const acceptNcnameIdentifier: AcceptFn<
  identifier.NcnameIdentifier
> = (parser) => {
  const ncname = parser.accept(ncnamePattern);
  if (!ncname) return;
  return {
    type: "identifier",
    kind: "ncname",
    ...ncname,
  };
};

export const acceptQuotedIdentifierIdentifier: AcceptFn<
  identifier.QuotedIdentifierIdentifier
> = (parser) => {
  const quotedIdentifier = acceptQuotedidentifier(parser);
  if (!quotedIdentifier) return;
  const { start, end } = quotedIdentifier;
  return {
    type: "identifier",
    kind: "quoted-identifier",
    quotedIdentifier,
    start,
    end,
  };
};

export const acceptIdentifier = choice<ast.Identifier>([
  acceptNcnameIdentifier,
  acceptQuotedIdentifierIdentifier,
]);

export const expectIdentifier: ExpectFn<ast.Identifier> = (parser) => {
  const identifier = acceptIdentifier(parser);
  if (identifier) return identifier;
  throw new SyntaxError(parser, ["<TODO: Identifier>"]);
};
