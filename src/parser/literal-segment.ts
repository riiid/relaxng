import { SyntaxError } from "https://deno.land/x/pbkit@v0.0.46/core/parser/recursive-descent-parser.ts";
import * as literalSegment from "../ast/literal-segment.ts";
import * as ast from "../ast/index.ts";
import { AcceptFn, ExpectFn } from "./index.ts";
import { choice, mergeSpans } from "./misc.ts";

export const acceptDLiteralsegment: AcceptFn<
  literalSegment.DLiteralsegment
> = (parser) => {
  const quoteOpen = parser.accept('"');
  if (!quoteOpen) return;
  const content = parser.expect(/^[^"\n]*/);
  const quoteClose = parser.expect('"');
  return {
    ...mergeSpans([quoteOpen, quoteClose]),
    type: "literalSegment",
    kind: "d",
    quoteOpen,
    content,
    quoteClose,
  };
};

export const acceptSLiteralsegment: AcceptFn<
  literalSegment.SLiteralsegment
> = (parser) => {
  const quoteOpen = parser.accept("'");
  if (!quoteOpen) return;
  const content = parser.expect(/^[^'\n]*/);
  const quoteClose = parser.expect("'");
  return {
    ...mergeSpans([quoteOpen, quoteClose]),
    type: "literalSegment",
    kind: "s",
    quoteOpen,
    content,
    quoteClose,
  };
};

export const acceptDDDLiteralsegment: AcceptFn<
  literalSegment.DDDLiteralsegment
> = (parser) => {
  const quoteOpen = parser.accept('"""');
  if (!quoteOpen) return;
  const content = parser.expect(/^(?:"?"?[^"\n])*/);
  const quoteClose = parser.expect('"""');
  return {
    ...mergeSpans([quoteOpen, quoteClose]),
    type: "literalSegment",
    kind: "ddd",
    quoteOpen,
    content,
    quoteClose,
  };
};

export const acceptSSSLiteralsegment: AcceptFn<
  literalSegment.SSSLiteralsegment
> = (parser) => {
  const quoteOpen = parser.accept("'''");
  if (!quoteOpen) return;
  const content = parser.expect(/^(?:'?'?[^'\n])*/);
  const quoteClose = parser.expect("'''");
  return {
    ...mergeSpans([quoteOpen, quoteClose]),
    type: "literalSegment",
    kind: "sss",
    quoteOpen,
    content,
    quoteClose,
  };
};

export const acceptLiteralsegment = choice<ast.Literalsegment>([
  acceptDLiteralsegment,
  acceptSLiteralsegment,
  acceptDDDLiteralsegment,
  acceptSSSLiteralsegment,
]);

export const expectLiteralSegment: ExpectFn<
  ast.Literalsegment
> = (parser) => {
  const literalSegment = acceptLiteralsegment(parser);
  if (literalSegment) return literalSegment;
  throw new SyntaxError(parser, ['"', "'"]);
};
