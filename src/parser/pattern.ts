import { SyntaxError } from "https://deno.land/x/pbkit@v0.0.46/core/parser/recursive-descent-parser.ts";
import * as ast from "../ast/index.ts";
import * as pattern from "../ast/pattern.ts";
import {
  AcceptFn,
  acceptInherit,
  acceptLiteral,
  acceptParam,
  ExpectFn,
  expectLiteral,
} from "./index.ts";
import { expectNameclass } from "./name-class.ts";
import { choice, mergeSpans, skipWsAndComments } from "./misc.ts";
import { acceptIdentifier, expectIdentifier } from "./identifier.ts";
import { acceptGrammarcontent } from "./grammar-content.ts";
import { acceptDatatypeName } from "./datatype-name.ts";

export const acceptElementPattern: AcceptFn<pattern.ElementPattern> = (
  parser,
) => {
  const element = parser.accept("element");
  if (!element) return;
  skipWsAndComments(parser);
  const nameClass = expectNameclass(parser);
  skipWsAndComments(parser);
  const bracketOpen = parser.expect("{");
  skipWsAndComments(parser);
  const pattern = expectPattern(parser);
  skipWsAndComments(parser);
  const bracketClose = parser.expect("}");
  skipWsAndComments(parser);
  return {
    type: "pattern",
    kind: "element",
    element: {
      type: "element",
      ...element,
    },
    nameClass: nameClass,
    bracketOpen: bracketOpen,
    pattern: pattern,
    bracketClose: bracketClose,
    ...mergeSpans([element, nameClass, bracketOpen, pattern, bracketClose]),
  };
};

export const acceptAttributePattern: AcceptFn<pattern.AttributePattern> = (
  parser,
) => {
  const attribute = parser.accept("attribute");
  if (!attribute) return;
  skipWsAndComments(parser);
  const nameClass = expectNameclass(parser);
  skipWsAndComments(parser);
  const bracketOpen = parser.expect("{");
  skipWsAndComments(parser);
  const pattern = expectPattern(parser);
  skipWsAndComments(parser);
  const bracketClose = parser.expect("}");
  skipWsAndComments(parser);
  return {
    type: "pattern",
    kind: "attribute",
    attribute: {
      type: "attribute",
      ...attribute,
    },
    nameClass: nameClass,
    bracketOpen: bracketOpen,
    pattern: pattern,
    bracketClose: bracketClose,
    ...mergeSpans([attribute, nameClass, bracketOpen, pattern, bracketClose]),
  };
};

export const acceptListPattern: AcceptFn<pattern.ListPattern> = (parser) => {
  const list = parser.accept("list");
  if (!list) return;
  skipWsAndComments(parser);
  const bracketOpen = parser.expect("{");
  skipWsAndComments(parser);
  const pattern = expectPattern(parser);
  skipWsAndComments(parser);
  const bracketClose = parser.expect("}");
  skipWsAndComments(parser);
  return {
    type: "pattern",
    kind: "list",
    list: {
      type: "list",
      ...list,
    },
    bracketOpen: bracketOpen,
    pattern: pattern,
    bracketClose: bracketClose,
    ...mergeSpans([list, bracketOpen, pattern, bracketClose]),
  };
};

export const acceptMixedPattern: AcceptFn<pattern.MixedPattern> = (parser) => {
  const mixed = parser.accept("mixed");
  if (!mixed) return;
  skipWsAndComments(parser);
  const bracketOpen = parser.expect("{");
  skipWsAndComments(parser);
  const pattern = expectPattern(parser);
  skipWsAndComments(parser);
  const bracketClose = parser.expect("}");
  skipWsAndComments(parser);
  return {
    type: "pattern",
    kind: "mixed",
    mixed: {
      type: "mixed",
      ...mixed,
    },
    bracketOpen: bracketOpen,
    pattern: pattern,
    bracketClose: bracketClose,
    ...mergeSpans([mixed, bracketOpen, pattern, bracketClose]),
  };
};

export const acceptIdentifierPattern: AcceptFn<pattern.IdentifierPattern> = (
  parser,
) => {
  const identifier = acceptIdentifier(parser);
  if (!identifier) return;
  const { start, end } = identifier;
  return {
    type: "pattern",
    kind: "identifier",
    identifier,
    start,
    end,
  };
};

export const acceptParentPattern: AcceptFn<pattern.ParentPattern> = (
  parser,
) => {
  const parent = parser.accept("parent");
  if (!parent) return;
  skipWsAndComments(parser);
  const identifier = expectIdentifier(parser);
  return {
    type: "pattern",
    kind: "parent",
    parent: {
      type: "parent",
      ...parent,
    },
    identifier,
    ...mergeSpans([parent, identifier]),
  };
};

export const acceptEmptyPattern: AcceptFn<pattern.EmptyPattern> = (parser) => {
  const empty = parser.accept("empty");
  if (!empty) return;
  return {
    type: "pattern",
    kind: "empty",
    ...empty,
  };
};

export const acceptTextPattern: AcceptFn<pattern.TextPattern> = (parser) => {
  const text = parser.accept("text");
  if (!text) return;
  return {
    type: "pattern",
    kind: "text",
    ...text,
  };
};

export const acceptDatatypeValuePattern: AcceptFn<
  pattern.DatatypeValuePattern
> = (parser) => {
  const datatypeName = acceptDatatypeName(parser);
  const datatypeValue = acceptLiteral(parser);
  if (!datatypeValue) return;
  const { start, end } = datatypeValue;
  return {
    type: "pattern",
    kind: "datatype-value",
    datatypeName,
    datatypeValue: {
      type: "datatypeValue",
      literal: datatypeValue,
      start,
      end,
    },
    ...mergeSpans([datatypeName, datatypeValue]),
  };
};

export const acceptDatatypeNamePattern: AcceptFn<pattern.DatatypeNamePattern> =
  (parser) => {
    const datatypeName = acceptDatatypeName(parser);
    if (!datatypeName) return;
    skipWsAndComments(parser);
    const bracketOpen = parser.accept("{");
    if (bracketOpen) {
      const params: ast.Param[] = [];
      skipWsAndComments(parser);
      while (true) {
        const param = acceptParam(parser);
        if (!param) break;
        params.push(param);
        skipWsAndComments(parser);
      }
      const bracketClose = parser.expect("}");
      const exceptPattern = acceptExceptpattern(parser);
      return {
        type: "pattern",
        kind: "datatype-name",
        datatypeName,
        body: {
          bracketOpen,
          params,
          bracketClose,
        },
        exceptPattern,
        ...mergeSpans([
          datatypeName,
          bracketOpen,
          params,
          bracketClose,
          exceptPattern,
        ]),
      };
    }
    const exceptPattern = acceptExceptpattern(parser);
    return {
      type: "pattern",
      kind: "datatype-name",
      datatypeName,
      exceptPattern,
      ...mergeSpans([
        datatypeName,
        exceptPattern,
      ]),
    };
  };

export const acceptNotAllowedPattern: AcceptFn<pattern.NotAllowedPattern> = (
  parser,
) => {
  const notAllowed = parser.accept("notAllowed");
  if (!notAllowed) return;
  return {
    type: "pattern",
    kind: "not-allowed",
    ...notAllowed,
  };
};

export const acceptExternalPattern: AcceptFn<pattern.ExternalPattern> = (
  parser,
) => {
  const external = parser.accept("external");
  if (!external) return;
  skipWsAndComments(parser);
  const anyUriLiteral = expectLiteral(parser);
  const { start, end } = anyUriLiteral;
  const inherit = acceptInherit(parser);
  return {
    type: "pattern",
    kind: "external",
    external,
    anyUriLiteral: {
      type: "anyURILiteral",
      literal: anyUriLiteral,
      start,
      end,
    },
    inherit,
    ...mergeSpans([external, anyUriLiteral, inherit]),
  };
};

export const acceptGrammarPattern: AcceptFn<pattern.GrammarPattern> = (
  parser,
) => {
  const grammar = parser.accept("grammar");
  if (!grammar) return;
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
  return {
    type: "pattern",
    kind: "grammar",
    grammar,
    bracketOpen,
    grammarContents,
    bracketClose,
    ...mergeSpans([grammar, bracketOpen, grammarContents, bracketClose]),
  };
};

export const acceptParenthesisPattern: AcceptFn<pattern.ParenthesisPattern> = (
  parser,
) => {
  const bracketOpen = parser.accept("(");
  if (!bracketOpen) return;
  skipWsAndComments(parser);
  const pattern = expectPattern(parser);
  skipWsAndComments(parser);
  const bracketClose = parser.expect(")");
  return {
    type: "pattern",
    kind: "parenthesis",
    bracketOpen,
    pattern,
    bracketClose,
    ...mergeSpans([bracketOpen, pattern, bracketClose]),
  };
};

const acceptPatternWithoutOperator = choice<
  Exclude<ast.Pattern, pattern.OperatorPattern>
>([
  acceptElementPattern,
  acceptAttributePattern,
  acceptListPattern,
  acceptMixedPattern,
  acceptIdentifierPattern,
  acceptParentPattern,
  acceptEmptyPattern,
  acceptTextPattern,
  acceptDatatypeNamePattern,
  acceptNotAllowedPattern,
  acceptExternalPattern,
  acceptGrammarPattern,
  acceptParenthesisPattern,
]);

const expectPatternWithoutOperator: ExpectFn<
  Exclude<ast.Pattern, pattern.OperatorPattern>
> = (parser) => {
  const pattern = acceptPatternWithoutOperator(parser);
  if (pattern) return pattern;
  throw new SyntaxError(parser, ["<TODO: PatternWithoutOperator>"]);
};

export const acceptPattern: AcceptFn<ast.Pattern> = (parser) => {
  const pattern = acceptPatternWithoutOperator(parser);
  if (!pattern) return;
  const patternOrOperators: pattern.OperatorPattern["patternOrOperators"] = [
    pattern,
  ];
  while (true) {
    const op = parser.accept(/^[,&|?*+]/);
    if (!op) break;
    switch (op.text) {
      case "?":
      case "*":
      case "+":
        patternOrOperators.push(op);
        continue;
    }
    const trailingPattern = expectPatternWithoutOperator(parser);
    patternOrOperators.push(op, trailingPattern);
  }
  return {
    type: "pattern",
    kind: "operator",
    patternOrOperators,
    ...mergeSpans(patternOrOperators),
  };
};

export const expectPattern: ExpectFn<ast.Pattern> = (parser) => {
  throw new Error("TODO");
};

// @TODO: move to parser/index.ts?
export const acceptExceptpattern: AcceptFn<ast.Exceptpattern> = (parser) => {
  const minus = parser.accept("-");
  if (!minus) return;
  skipWsAndComments(parser);
  const pattern = expectPattern(parser);
  return {
    type: "exceptPattern",
    minus,
    pattern,
    ...mergeSpans([minus, pattern]),
  };
};
