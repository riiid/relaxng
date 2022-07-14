import { SyntaxError } from "https://deno.land/x/pbkit@v0.0.46/core/parser/recursive-descent-parser.ts";
import * as ast from "../ast/index.ts";
import * as nameClass from "../ast/name-class.ts";
import { AcceptFn, acceptNsname, ExpectFn } from "./index.ts";
import { choice, mergeSpans, skipWsAndComments } from "./misc.ts";
import { acceptName } from "./name.ts";

export const acceptNameNameclass: AcceptFn<nameClass.NameNameclass> = (
  parser,
) => {
  const name = acceptName(parser);
  if (!name) return;
  const { start, end } = name;
  return {
    type: "nameClass",
    kind: "name",
    name,
    start,
    end,
  };
};

export const acceptNsnameNameclass: AcceptFn<nameClass.NsnameNameclass> = (
  parser,
) => {
  const nsName = acceptNsname(parser);
  if (!nsName) return;
  skipWsAndComments(parser);
  const exceptNameClass = acceptExceptnameclass(parser);
  return {
    ...mergeSpans([nsName, exceptNameClass]),
    type: "nameClass",
    kind: "nsname",
    nsName,
    exceptNameClass,
  };
};

export const acceptAnynameNameclass: AcceptFn<nameClass.AnynameNameclass> = (
  parser,
) => {
  const anyname = parser.accept("*");
  if (!anyname) return;
  skipWsAndComments(parser);
  const exceptNameClass = acceptExceptnameclass(parser);
  return {
    ...mergeSpans([anyname, exceptNameClass]),
    type: "nameClass",
    kind: "anyname",
    anyname: {
      type: "anyName",
      ...anyname,
    },
    exceptNameClass,
  };
};

export const acceptParenthesisNameclass: AcceptFn<
  nameClass.ParenthesisNameclass
> = (parser) => {
  const bracketOpen = parser.accept("(");
  if (!bracketOpen) return;
  skipWsAndComments(parser);
  const nameClass = expectNameclass(parser);
  skipWsAndComments(parser);
  const bracketClose = parser.expect(")");
  return {
    ...mergeSpans([bracketOpen, nameClass, bracketClose]),
    type: "nameClass",
    kind: "parenthesis",
    bracketOpen,
    nameClass,
    bracketClose,
  };
};

const acceptNameclassWithoutOr = choice<
  Exclude<ast.Nameclass, nameClass.OrNameclass>
>([
  acceptAnynameNameclass,
  acceptNsnameNameclass,
  acceptNameNameclass,
  acceptParenthesisNameclass,
]);

const expectNameclassWithoutOr: ExpectFn<
  Exclude<ast.Nameclass, nameClass.OrNameclass>
> = (parser) => {
  const nameClass = acceptNameclassWithoutOr(parser);
  if (nameClass) return nameClass;
  throw new SyntaxError(parser, ["TODO"]);
};

export const acceptNameclass: AcceptFn<ast.Nameclass> = (parser) => {
  const nameclass = acceptNameclassWithoutOr(parser);
  if (!nameclass) return;
  skipWsAndComments(parser);
  const nameClassOrOrs: nameClass.OrNameclass["nameClassOrOrs"] = [nameclass];
  while (true) {
    const or = parser.accept("|");
    if (!or) break;
    const nameClass = expectNameclassWithoutOr(parser);
    nameClassOrOrs.push(or, nameClass);
    skipWsAndComments(parser);
  }
  if (nameClassOrOrs.length === 1) return nameclass;
  return {
    ...mergeSpans(nameClassOrOrs),
    type: "nameClass",
    kind: "or",
    nameClassOrOrs,
  };
};

export const expectNameclass: ExpectFn<ast.Nameclass> = (parser) => {
  const nameclass = acceptNameclass(parser);
  if (nameclass) return nameclass;
  throw new SyntaxError(parser, ["<TODO: nameclass>"]);
};

export const acceptExceptnameclass: AcceptFn<ast.Exceptnameclass> = (
  parser,
) => {
  const minus = parser.accept("-");
  if (!minus) return;
  skipWsAndComments(parser);
  const nameClass = expectNameclass(parser);
  return {
    ...mergeSpans([minus, nameClass]),
    type: "exceptNameClass",
    minus,
    nameClass,
  };
};
