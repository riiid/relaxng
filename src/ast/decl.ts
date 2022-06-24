import { Token } from "https://deno.land/x/pbkit@v0.0.46/core/parser/recursive-descent-parser.ts";
import * as ast from "./index.ts";

export type Decl = NamespaceDecl | DefaultNamespaceDecl | DatatypesDecl;
export default Decl;

export interface NamespaceDecl extends ast.NodeBase<"decl"> {
  kind: "namespace";
  namespace: Token;
  identifierOrKeyword: ast.Identifierorkeyword;
  eq: Token;
  namespaceUriLiteral: ast.Namespaceuriliteral;
}

export interface DefaultNamespaceDecl extends ast.NodeBase<"decl"> {
  kind: "default-namespace";
  default: Token;
  namespace: Token;
  identifierOrKeyword?: ast.Identifierorkeyword;
  eq: Token;
  namespaceUriLiteral: ast.Namespaceuriliteral;
}

export interface DatatypesDecl extends ast.NodeBase<"decl"> {
  kind: "datatypes";
  datatypes: Token;
  identifierOrKeyword: ast.Identifierorkeyword;
  eq: Token;
  literal: ast.Literal;
}
