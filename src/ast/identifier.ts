import * as ast from "./index.ts";

export type Identifierorkeyword =
  | NcnameIdentifier
  | QuotedIdentifierIdentifier;
export default Identifierorkeyword;

export interface NcnameIdentifier extends ast.NodeBase<"identifier"> {
  kind: "ncname";
  identifier: ast.Identifier;
}

export interface QuotedIdentifierIdentifier extends ast.NodeBase<"identifier"> {
  kind: "quoted-identifier";
  quotedIdentifier: ast.Quotedidentifier;
}
