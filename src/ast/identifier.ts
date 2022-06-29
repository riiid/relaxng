import { Token } from "https://deno.land/x/pbkit@v0.0.46/core/parser/recursive-descent-parser.ts";
import * as ast from "./index.ts";

export type Identifier =
  | NcnameIdentifier
  | QuotedIdentifierIdentifier;
export default Identifier;

export interface NcnameIdentifier extends ast.NodeBase<"identifier">, Token {
  kind: "ncname";
}

export interface QuotedIdentifierIdentifier extends ast.NodeBase<"identifier"> {
  kind: "quoted-identifier";
  quotedIdentifier: ast.Quotedidentifier;
}
