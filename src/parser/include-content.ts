import * as ast from "../ast/index.ts";
import * as includeContent from "../ast/include-content.ts";
import { acceptDefine, AcceptFn, acceptStart } from "./index.ts";
import { choice, mergeSpans, skipWsAndComments } from "./misc.ts";

export const acceptDefineIncludecontent: AcceptFn<
  includeContent.DefineIncludecontent
> = (parser) => {
  const define = acceptDefine(parser);
  if (!define) return;
  const { start, end } = define;
  return {
    type: "includeContent",
    kind: "define",
    define,
    start,
    end,
  };
};

export const acceptStartIncludecontent: AcceptFn<
  includeContent.StartIncludecontent
> = (parser) => {
  const startNode = acceptStart(parser);
  if (!startNode) return;
  const { start, end } = startNode;
  return {
    type: "includeContent",
    kind: "start",
    startNode: startNode as unknown as ast.Start,
    start,
    end,
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
  const includeContents: ast.Includecontent[] = [];
  while (true) {
    const includeContent = acceptIncludecontent(parser);
    if (!includeContent) break;
    includeContents.push(includeContent);
    skipWsAndComments(parser);
  }
  const bracketClose = parser.expect("}");
  return {
    ...mergeSpans([div, bracketOpen, bracketClose]),
    type: "includeContent",
    kind: "div",
    div,
    bracketOpen,
    includeContents: includeContents as unknown as ast.Includecontent[],
    bracketClose,
  };
};

export const acceptIncludecontent = choice<ast.Includecontent>([
  acceptDefineIncludecontent,
  acceptStartIncludecontent,
  acceptDivIncludecontent,
]);
