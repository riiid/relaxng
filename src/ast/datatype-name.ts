import { Token } from "https://deno.land/x/pbkit@v0.0.46/core/parser/recursive-descent-parser.ts";
import * as ast from "./index.ts";

export type Datatypename = CnameDatatypename;
export default Datatypename;

export interface CnameDatatypename extends ast.NodeBase<"datatypeName"> {
  kind: "name";
  cname: ast.Cname;
}

export interface StringDatatypename
  extends ast.NodeBase<"datatypeName">, Token {
  kind: "string";
}

export interface TokenDatatypename extends ast.NodeBase<"datatypeName">, Token {
  kind: "token";
}
