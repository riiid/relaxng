import * as ast from "../ast/index.ts";
import * as grammarContent from "../ast/grammar-content.ts";
import { AcceptFn } from "./index.ts";
import { choice, mergeSpans, skipWsAndComments } from "./misc.ts";

export const acceptStartGrammarcontent: AcceptFn<
  grammarContent.StartGrammarcontent
> = (parser) => {
  const startNode = parser.accept("TODO");
  if (!startNode) return;
  return {
    type: "grammarContent",
    kind: "start",
    startNode: startNode as unknown as ast.Start,
    ...startNode,
  };
};

export const acceptDefineGrammarcontent: AcceptFn<
  grammarContent.DefineGrammarcontent
> = (parser) => {
  const define = parser.accept("TODO");
  if (!define) return;
  return {
    type: "grammarContent",
    kind: "define",
    define: define as unknown as ast.Define,
    ...define,
  };
};

export const acceptDivGrammarcontent: AcceptFn<
  grammarContent.DivGrammarcontent
> = (parser) => {
  const div = parser.accept(/^div/);
  if (!div) return;
  skipWsAndComments(parser);
  const bracketOpen = parser.expect("{");
  skipWsAndComments(parser);
  const grammarContents = parser.expect("TODO");
  skipWsAndComments(parser);
  const bracketClose = parser.expect("}");
  skipWsAndComments(parser);
  return {
    type: "grammarContent",
    kind: "div",
    div,
    bracketOpen,
    grammarContents: grammarContents as unknown as ast.Grammarcontent[],
    bracketClose,
    ...mergeSpans([div, bracketOpen, bracketClose]),
  };
};

export const acceptIncludeGrammarcontent: AcceptFn<
  grammarContent.IncludeGrammarcontent
> = (parser) => {
  const include = parser.accept(/^accept/);
  if (!include) return;
  skipWsAndComments(parser);
  const anyUriLiteral = parser.expect("TODO");
  skipWsAndComments(parser);
  const inherit = parser.accept("TODO");
  skipWsAndComments(parser);
  const bracketOpen = parser.accept("{");
  if (!bracketOpen) {
    return {
      type: "grammarContent",
      kind: "include",
      include,
      anyUriLiteral: anyUriLiteral as unknown as ast.Anyuriliteral,
      inherit: inherit as unknown as ast.Inherit,
      ...mergeSpans([include, anyUriLiteral, inherit]),
    };
  }
  skipWsAndComments(parser);
  const includeContents = parser.expect("TODO");
  skipWsAndComments(parser);
  const bracketClose = parser.expect("}");
  skipWsAndComments(parser);
  return {
    type: "grammarContent",
    kind: "include",
    include,
    anyUriLiteral: anyUriLiteral as unknown as ast.Anyuriliteral,
    inherit: inherit as unknown as ast.Inherit,
    body: {
      bracketOpen,
      includeContents: includeContents as unknown as ast.Includecontent[],
      bracketClose,
    },
    ...mergeSpans([
      include,
      anyUriLiteral,
      inherit,
      bracketOpen,
      bracketClose,
    ]),
  };
};

export const acceptGrammarcontent = choice<ast.Grammarcontent>([
  acceptStartGrammarcontent,
  acceptDefineGrammarcontent,
  acceptDivGrammarcontent,
  acceptIncludeGrammarcontent,
]);
