import { Token } from "https://deno.land/x/pbkit@v0.0.46/core/parser/recursive-descent-parser.ts";
import * as ast from "./index.ts";

export type Nameclass =
  | NameNameclass
  | NsnameNameclass
  | AnynameNameclass
  | OrNameclass
  | ParenthesisNameclass;
export default Nameclass;

export interface NameNameclass extends ast.NodeBase<"nameClass"> {
  kind: "name";
  name: ast.Name;
}

export interface NsnameNameclass extends ast.NodeBase<"nameClass"> {
  kind: "nsname";
  nsName: ast.Nsname;
  exceptNameClass?: ast.Exceptnameclass;
}

export interface AnynameNameclass extends ast.NodeBase<"nameClass"> {
  kind: "anyname";
  anyname: ast.Anyname;
  exceptNameClass?: ast.Exceptnameclass;
}

export interface OrNameclass extends ast.NodeBase<"nameClass"> {
  kind: "or";
  nameClassOrOrs: (ast.Nameclass | Token)[];
}

export interface ParenthesisNameclass extends ast.NodeBase<"nameClass"> {
  kind: "parenthesis";
  bracketOpen: Token;
  nameClass: ast.Nameclass;
  bracketClose: Token;
}
