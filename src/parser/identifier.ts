import * as identifier from "../ast/identifier.ts";
import * as ast from "../ast/index.ts";
import { AcceptFn, acceptQuotedidentifier, ncnamePattern } from "./index.ts";
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
