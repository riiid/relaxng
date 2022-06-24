import { Token } from "https://deno.land/x/pbkit@v0.0.46/core/parser/recursive-descent-parser.ts";
import * as ast from "./index.ts";

export type Pattern =
  | ElementPattern
  | AttributePattern
  | OperatorPattern
  | ListPattern
  | MixedPattern
  | IdentifierPattern
  | ParentPattern
  | EmptyPattern
  | TextPattern
  | DatatypeValuePattern
  | DatatypeNamePattern
  | NotAllowedPattern
  | ExternalPattern
  | GrammarPattern
  | ParenthesisPattern;
export default Pattern;

export interface ElementPattern extends ast.NodeBase<"pattern"> {
  kind: "element";
  element: Token;
  nameClass: ast.Nameclass;
  bracketOpen: Token;
  pattern: ast.Pattern;
  bracketClose: Token;
}

export interface AttributePattern extends ast.NodeBase<"pattern"> {
  kind: "attribute";
  attribute: Token;
  nameClass: ast.Nameclass;
  bracketOpen: Token;
  pattern: ast.Pattern;
  bracketClose: Token;
}

export interface OperatorPattern extends ast.NodeBase<"pattern"> {
  kind: "operator";
  patternOrOperators: (ast.Pattern | Token)[];
}

export interface ListPattern extends ast.NodeBase<"pattern"> {
  kind: "list";
  list: Token;
  bracketOpen: Token;
  pattern: ast.Pattern;
  bracketClose: Token;
}

export interface MixedPattern extends ast.NodeBase<"pattern"> {
  kind: "mixed";
  mixed: Token;
  bracketOpen: Token;
  pattern: ast.Pattern;
  bracketClose: Token;
}

export interface IdentifierPattern extends ast.NodeBase<"pattern">, Token {
  kind: "identifier";
}

export interface ParentPattern extends ast.NodeBase<"pattern"> {
  kind: "parent";
  parent: Token;
  identifier: ast.Identifier;
}

export interface EmptyPattern extends ast.NodeBase<"pattern">, Token {
  kind: "empty";
}

export interface TextPattern extends ast.NodeBase<"pattern">, Token {
  kind: "text";
}

export interface DatatypeValuePattern extends ast.NodeBase<"pattern"> {
  kind: "datatype-value";
  datatypeName?: ast.Datatypename;
  datatypeValue: ast.Datatypevalue;
}

export interface DatatypeNamePattern extends ast.NodeBase<"pattern"> {
  kind: "datatype-name";
  datatypeName: ast.Datatypename;
  body?: {
    bracketOpen: Token;
    params: ast.Param[];
    bracketClose: Token;
  };
  exceptPattern?: ast.Exceptpattern;
}

export interface NotAllowedPattern extends ast.NodeBase<"pattern">, Token {
  kind: "not-allowed";
}

export interface ExternalPattern extends ast.NodeBase<"pattern"> {
  kind: "external";
  external: Token;
  anyUriLiteral: ast.Anyuriliteral;
  inherit?: ast.Inherit;
}

export interface GrammarPattern extends ast.NodeBase<"pattern"> {
  kind: "grammar";
  grammar: Token;
  bracketOpen: Token;
  grammarContents: ast.Grammarcontent[];
  bracketClose: Token;
}

export interface ParenthesisPattern extends ast.NodeBase<"pattern"> {
  kind: "parenthesis";
  bracketOpen: Token;
  pattern: ast.Pattern;
  bracketClose: Token;
}
