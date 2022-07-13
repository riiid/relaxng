import * as ast from "../ast/index.ts";
import * as grammarContent from "../ast/grammar-content.ts";
import {
  acceptDefine,
  AcceptFn,
  acceptStart,
  expectAnyuriliteral,
  expectInherit,
} from "./index.ts";
import { acceptIncludecontent } from "./include-content.ts";
import { choice, mergeSpans, skipWsAndComments } from "./misc.ts";

export const acceptStartGrammarcontent: AcceptFn<
  grammarContent.StartGrammarcontent
> = (parser) => {
  const startNode = acceptStart(parser);
  if (!startNode) return;
  const { start, end } = startNode;
  return {
    type: "grammarContent",
    kind: "start",
    startNode,
    start,
    end,
  };
};

export const acceptDefineGrammarcontent: AcceptFn<
  grammarContent.DefineGrammarcontent
> = (parser) => {
  const define = acceptDefine(parser);
  if (!define) return;
  const { start, end } = define;
  return {
    type: "grammarContent",
    kind: "define",
    define,
    start,
    end,
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
  const grammarContents: ast.Grammarcontent[] = [];
  while (true) {
    const grammarContent = acceptGrammarcontent(parser);
    if (!grammarContent) break;
    grammarContents.push(grammarContent);
    skipWsAndComments(parser);
  }
  const bracketClose = parser.expect("}");
  skipWsAndComments(parser);
  return {
    ...mergeSpans([div, bracketOpen, bracketClose]),
    type: "grammarContent",
    kind: "div",
    div,
    bracketOpen,
    grammarContents,
    bracketClose,
  };
};

export const acceptIncludeGrammarcontent: AcceptFn<
  grammarContent.IncludeGrammarcontent
> = (parser) => {
  const include = parser.accept(/^accept/);
  if (!include) return;
  skipWsAndComments(parser);
  const anyUriLiteral = expectAnyuriliteral(parser);
  skipWsAndComments(parser);
  const inherit = expectInherit(parser);
  skipWsAndComments(parser);
  const bracketOpen = parser.accept("{");
  if (!bracketOpen) {
    return {
      type: "grammarContent",
      kind: "include",
      include,
      anyUriLiteral,
      inherit,
      ...mergeSpans([include, anyUriLiteral, inherit]),
    };
  }
  skipWsAndComments(parser);
  const includeContents: ast.Includecontent[] = [];
  while (true) {
    const includeContent = acceptIncludecontent(parser);
    if (!includeContent) break;
    includeContents.push(includeContent);
    skipWsAndComments(parser);
  }
  const bracketClose = parser.expect("}");
  skipWsAndComments(parser);
  return {
    ...mergeSpans([
      include,
      anyUriLiteral,
      inherit,
      bracketOpen,
      bracketClose,
    ]),
    type: "grammarContent",
    kind: "include",
    include,
    anyUriLiteral,
    inherit,
    body: {
      bracketOpen,
      includeContents,
      bracketClose,
    },
  };
};

export const acceptGrammarcontent = choice<ast.Grammarcontent>([
  acceptStartGrammarcontent,
  acceptDefineGrammarcontent,
  acceptDivGrammarcontent,
  acceptIncludeGrammarcontent,
]);
