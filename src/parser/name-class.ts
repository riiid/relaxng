import { SyntaxError } from "https://deno.land/x/pbkit@v0.0.46/core/parser/recursive-descent-parser.ts";
import * as ast from "../ast/index.ts";
import * as nameClass from "../ast/name-class.ts";
import { AcceptFn, ExpectFn } from "./index.ts";
import { choice, mergeSpans } from "./misc.ts";

export const acceptNameNameclass: AcceptFn<nameClass.NameNameclass> = (
  parser,
) => {
  const name = parser.accept("TODO");
  if (!name) return;
  const { start, end } = name;
  return {
    type: "nameClass",
    kind: "name",
    name: name as unknown as ast.Name,
    start,
    end,
  };
};

export const acceptNsnameNameclass: AcceptFn<nameClass.NsnameNameclass> = (
  parser,
) => {
  const nsname = parser.accept("TODO");
  if (!nsname) return;
  const exceptNameClass = parser.accept("TODO");
  return {
    type: "nameClass",
    kind: "nsname",
    nsName: nsname as unknown as ast.Nsname,
    exceptNameClass: exceptNameClass as unknown as ast.Exceptnameclass,
    ...mergeSpans([nsname, exceptNameClass]),
  };
};

export const acceptAnynameNameclass: AcceptFn<nameClass.AnynameNameclass> = (
  parser,
) => {
  const anyname = parser.accept("TODO");
  if (!anyname) return;
  const exceptNameClass = parser.accept("TODO");
  return {
    type: "nameClass",
    kind: "anyname",
    anyname: anyname as unknown as ast.Anyname,
    exceptNameClass: exceptNameClass as unknown as ast.Exceptnameclass,
    ...mergeSpans([anyname, exceptNameClass]),
  };
};

export const acceptParenthesisNameclass: AcceptFn<
  nameClass.ParenthesisNameclass
> = (parser) => {
  const bracketOpen = parser.expect("(");
  if (!bracketOpen) return;
  const nameClass = acceptNameclass(parser);
  if (!nameClass) return;
  const bracketClose = parser.expect(")");
  if (!bracketClose) return;
  return {
    type: "nameClass",
    kind: "parenthesis",
    bracketOpen,
    nameClass,
    bracketClose,
    ...mergeSpans([bracketOpen, nameClass, bracketClose]),
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
  const nameClassorOrs: nameClass.OrNameclass["nameClassOrOrs"] = [nameclass];
  while (true) {
    const or = parser.accept("|");
    if (!or) break;
    const nameClass = expectNameclassWithoutOr(parser);
    nameClassorOrs.push(or, nameClass);
  }
  if (nameClassorOrs.length === 1) return nameclass;
  return {
    type: "nameClass",
    kind: "or",
    nameClassOrOrs: nameClassorOrs,
    ...mergeSpans(nameClassorOrs),
  };
};
