import { Token } from "https://deno.land/x/pbkit@v0.0.46/core/parser/recursive-descent-parser.ts";
import * as ast from "./index.ts";

export type Includecontent =
  | DefineIncludecontent
  | StartIncludecontent
  | DivIncludecontent;
export default Includecontent;

export interface DefineIncludecontent extends ast.NodeBase<"includeContent"> {
  kind: "define";
  define: ast.Define;
}

export interface StartIncludecontent extends ast.NodeBase<"includeContent"> {
  kind: "start";
  startNode: ast.Start;
}

export interface DivIncludecontent extends ast.NodeBase<"includeContent"> {
  kind: "div";
  div: Token;
  bracketOpen: Token;
  includeContents: ast.Includecontent[];
  bracketClose: Token;
}
