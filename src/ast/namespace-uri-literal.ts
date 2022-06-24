import { Token } from "https://deno.land/x/pbkit@v0.0.46/core/parser/recursive-descent-parser.ts";
import * as ast from "./index.ts";

export type Namespaceuriliteral =
  | LiteralNamespaceuriliteral
  | InheritNamespaceuriliteral;
export default Namespaceuriliteral;

export interface LiteralNamespaceuriliteral
  extends ast.NodeBase<"namespaceURILiteral"> {
  kind: "literal";
  literal: ast.Literal;
}

export interface InheritNamespaceuriliteral
  extends ast.NodeBase<"namespaceURILiteral">, Token {
  kind: "inherit";
}
