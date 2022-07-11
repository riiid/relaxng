import * as decl from "../ast/decl.ts";
import * as ast from "../ast/index.ts";
import { AcceptFn } from "./index.ts";
import { choice, skipWsAndComments } from "./misc.ts";
import { expectIdentifierorkeyword } from "./identifier-or-keyword.ts";

export const acceptNamespaceDecl: AcceptFn<decl.NamespaceDecl> = (parser) => {
  const namespace = parser.accept(/^namespace\b/);
  if (!namespace) return;
  skipWsAndComments(parser);
  const identifierOrKeyword = expectIdentifierorkeyword(parser);
  skipWsAndComments(parser);
  const eq = parser.expect("=");
  return undefined; // TODO
};

export const acceptDefaultNamespaceDecl: AcceptFn<decl.DefaultNamespaceDecl> =
  () => {
    return undefined; // TODO
  };

export const acceptDatatypesDecl: AcceptFn<decl.DatatypesDecl> = () => {
  return undefined; // TODO
};

export const acceptDecl = choice<ast.Decl>([
  acceptNamespaceDecl,
  acceptDefaultNamespaceDecl,
  acceptDatatypesDecl,
]);
