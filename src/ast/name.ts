import * as ast from "./index.ts";

export type Name =
  | IdentifierOrKeywordName
  | CnameName;
export default Name;

export interface IdentifierOrKeywordName extends ast.NodeBase<"name"> {
  kind: "identifier-or-keyword";
  identifierOrKeyword: ast.Identifierorkeyword;
}

export interface CnameName extends ast.NodeBase<"name"> {
  kind: "cname";
  cname: ast.Cname;
}
