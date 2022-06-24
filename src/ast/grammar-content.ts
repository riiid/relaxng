import { Token } from "https://deno.land/x/pbkit@v0.0.46/core/parser/recursive-descent-parser.ts";
import * as ast from "./index.ts";

export type Grammarcontent =
  | StartGrammarcontent
  | DefineGrammarcontent
  | DivGrammarcontent
  | IncludeGrammarcontent;
export default Grammarcontent;

export interface StartGrammarcontent extends ast.NodeBase<"grammarContent"> {
  kind: "start";
  startNode: ast.Start;
}

export interface DefineGrammarcontent extends ast.NodeBase<"grammarContent"> {
  kind: "define";
  define: ast.Define;
}

export interface DivGrammarcontent extends ast.NodeBase<"grammarContent"> {
  kind: "div";
  div: Token;
  bracketOpen: Token;
  grammarContents: ast.Grammarcontent[];
  bracketClose: Token;
}

export interface IncludeGrammarcontent extends ast.NodeBase<"grammarContent"> {
  kind: "include";
  include: Token;
  anyUriLiteral: ast.Anyuriliteral;
  inherit?: ast.Inherit;
  body?: {
    bracketOpen: Token;
    includeContents: ast.Includecontent[];
    bracketClose: Token;
  };
}
