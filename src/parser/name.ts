import * as ast from "../ast/index.ts";
import * as name from "../ast/name.ts";
import { AcceptFn } from "./index.ts";
import { acceptIdentifierorkeyword } from "./identifier-or-keyword.ts";
import { choice } from "./misc.ts";

export const acceptIdentifierOrKeywordName: AcceptFn<
  name.IdentifierOrKeywordName
> = (parser) => {
  const identifierOrKeyword = acceptIdentifierorkeyword(parser);
  if (!identifierOrKeyword) return;
  const { start, end } = identifierOrKeyword;
  return {
    type: "name",
    kind: "identifier-or-keyword",
    identifierOrKeyword,
    start,
    end,
  };
};

export const acceptCnameName: AcceptFn<name.CnameName> = (parser) => {
  const cname = parser.expect("TODO");
  if (!cname) return;
  const { start, end } = cname;
  return {
    type: "name",
    kind: "cname",
    cname: cname as unknown as ast.Cname,
    start,
    end,
  };
};

export const acceptName = choice<ast.Name>([
  acceptIdentifierOrKeywordName,
  acceptCnameName,
]);
