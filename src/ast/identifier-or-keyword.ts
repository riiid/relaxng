import { Token } from "https://deno.land/x/pbkit@v0.0.46/core/parser/recursive-descent-parser.ts";
import * as ast from "./index.ts";

export type Identifierorkeyword =
  | IdentifierIdentifierorkeyword
  | KeywordIdentifierorkeyword;
export default Identifierorkeyword;

export interface IdentifierIdentifierorkeyword
  extends ast.NodeBase<"identifierOrKeyword"> {
  kind: "identifier";
  identifier: ast.Identifier;
}

export interface KeywordIdentifierorkeyword
  extends ast.NodeBase<"identifierOrKeyword">, Token {
  kind: "keyword";
}
