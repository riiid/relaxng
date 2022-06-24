import { Token } from "https://deno.land/x/pbkit@v0.0.46/core/parser/recursive-descent-parser.ts";
import * as ast from "./index.ts";

export type Literalsegment =
  | DLiteralsegment
  | SLiteralsegment
  | DDDLiteralsegment
  | SSSLiteralsegment;
export default Literalsegment;

export interface DLiteralsegment extends ast.NodeBase<"literalSegment"> {
  kind: "d";
  quoteOpen: Token;
  content: Token;
  quoteClose: Token;
}

export interface SLiteralsegment extends ast.NodeBase<"literalSegment"> {
  kind: "s";
  quoteOpen: Token;
  content: Token;
  quoteClose: Token;
}

export interface DDDLiteralsegment extends ast.NodeBase<"literalSegment"> {
  kind: "ddd";
  quoteOpen: Token;
  content: Token;
  quoteClose: Token;
}

export interface SSSLiteralsegment extends ast.NodeBase<"literalSegment"> {
  kind: "sss";
  quoteOpen: Token;
  content: Token;
  quoteClose: Token;
}
