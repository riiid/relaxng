import { SyntaxError } from "https://deno.land/x/pbkit@v0.0.46/core/parser/recursive-descent-parser.ts";
import * as namespaceUriLiteral from "../ast/namespace-uri-literal.ts";
import * as ast from "../ast/index.ts";
import { AcceptFn, acceptLiteral, ExpectFn } from "./index.ts";
import { choice } from "./misc.ts";

export const acceptLiteralNamespaceuriliteral: AcceptFn<
  namespaceUriLiteral.LiteralNamespaceuriliteral
> = (parser) => {
  const literal = acceptLiteral(parser);
  if (!literal) return;
  const { start, end } = literal;
  return {
    type: "namespaceURILiteral",
    kind: "literal",
    literal,
    start,
    end,
  };
};

export const acceptInheritNamespaceuriliteral: AcceptFn<
  namespaceUriLiteral.InheritNamespaceuriliteral
> = (parser) => {
  const inherit = parser.accept("inherit");
  if (!inherit) return;
  return {
    ...inherit,
    type: "namespaceURILiteral",
    kind: "inherit",
  };
};

export const acceptNamespaceuriliteral = choice<ast.Namespaceuriliteral>([
  acceptLiteralNamespaceuriliteral,
  acceptInheritNamespaceuriliteral,
]);

export const expectNamespaceuriliteral: ExpectFn<
  ast.Namespaceuriliteral
> = (parser) => {
  const namespaceUriLiteral = acceptNamespaceuriliteral(parser);
  if (namespaceUriLiteral) return namespaceUriLiteral;
  throw new SyntaxError(parser, ['"', "'", "inherit"]);
};
