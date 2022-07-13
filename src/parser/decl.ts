import * as decl from "../ast/decl.ts";
import * as ast from "../ast/index.ts";
import { AcceptFn, expectLiteral } from "./index.ts";
import { choice, mergeSpans, skipWsAndComments } from "./misc.ts";
import {
  acceptIdentifierorkeyword,
  expectIdentifierorkeyword,
} from "./identifier-or-keyword.ts";
import { expectNamespaceuriliteral } from "./namespace-uri-literal.ts";

export const acceptNamespaceDecl: AcceptFn<decl.NamespaceDecl> = (parser) => {
  const namespace = parser.accept(/^namespace\b/);
  if (!namespace) return;
  skipWsAndComments(parser);
  const identifierOrKeyword = expectIdentifierorkeyword(parser);
  skipWsAndComments(parser);
  const eq = parser.expect("=");
  skipWsAndComments(parser);
  const namespaceUriLiteral = expectNamespaceuriliteral(parser);
  return {
    ...mergeSpans([namespace, namespaceUriLiteral]),
    type: "decl",
    kind: "namespace",
    namespace,
    identifierOrKeyword,
    eq,
    namespaceUriLiteral,
  };
};

export const acceptDefaultNamespaceDecl: AcceptFn<decl.DefaultNamespaceDecl> = (
  parser,
) => {
  const def = parser.accept(/^default\b/);
  if (!def) return;
  skipWsAndComments(parser);
  const namespace = parser.expect("namespace");
  skipWsAndComments(parser);
  const identifierOrKeyword = acceptIdentifierorkeyword(parser);
  skipWsAndComments(parser);
  const eq = parser.expect("=");
  skipWsAndComments(parser);
  const namespaceUriLiteral = expectNamespaceuriliteral(parser);
  return {
    ...mergeSpans([def, namespace, namespaceUriLiteral]),
    type: "decl",
    kind: "default-namespace",
    default: def,
    namespace,
    identifierOrKeyword,
    eq,
    namespaceUriLiteral,
  };
};

export const acceptDatatypesDecl: AcceptFn<decl.DatatypesDecl> = (parser) => {
  const datatypes = parser.accept(/^datatypes\b/);
  if (!datatypes) return;
  skipWsAndComments(parser);
  const identifierOrKeyword = expectIdentifierorkeyword(parser);
  skipWsAndComments(parser);
  const eq = parser.expect("=");
  skipWsAndComments(parser);
  const literal = expectLiteral(parser);
  return {
    ...mergeSpans([datatypes, literal]),
    type: "decl",
    kind: "datatypes",
    datatypes,
    identifierOrKeyword,
    eq,
    literal,
  };
};

export const acceptDecl = choice<ast.Decl>([
  acceptNamespaceDecl,
  acceptDefaultNamespaceDecl,
  acceptDatatypesDecl,
]);
