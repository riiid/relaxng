import * as ast from "../ast/index.ts";
import * as includeContent from "../ast/include-content.ts";
import { AcceptFn } from "./index.ts";
import { choice, mergeSpans, skipWsAndComments } from "./misc.ts";

export const acceptDefineIncludecontent: AcceptFn<
  includeContent.DefineIncludecontent
> = (parser) => {
  const define = parser.accept("TODO");
  if (!define) return;
  return {
    type: "includeContent",
    kind: "define",
    define: define as unknown as ast.Define,
    ...define,
  };
};

export const acceptStartIncludecontent: AcceptFn<
  includeContent.StartIncludecontent
> = (parser) => {
  const startNode = parser.accept("TODO");
  if (!startNode) return;
  return {
    type: "includeContent",
    kind: "start",
    startNode: startNode as unknown as ast.Start,
    ...startNode,
  };
};

export const acceptDivIncludecontent: AcceptFn<
  includeContent.DivIncludecontent
> = (parser) => {
  const div = parser.accept(/^div/);
  if (!div) return;
  skipWsAndComments(parser);
  const bracketOpen = parser.expect("{");
  skipWsAndComments(parser);
  const includeContents = parser.expect("TODO");
  skipWsAndComments(parser);
  const bracketClose = parser.expect("}");
  skipWsAndComments(parser);
  return {
    type: "includeContent",
    kind: "div",
    div,
    bracketOpen,
    includeContents: includeContents as unknown as ast.Includecontent[],
    bracketClose,
    ...mergeSpans([div, bracketOpen, bracketClose]),
  };
};

export const acceptIncludecontent = choice<ast.Includecontent>([
  acceptDefineIncludecontent,
  acceptStartIncludecontent,
  acceptDivIncludecontent,
]);
