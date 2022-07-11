import {
  Span,
  Token,
} from "https://deno.land/x/pbkit@v0.0.46/core/parser/recursive-descent-parser.ts";
import Decl from "./decl.ts";
import Pattern from "./pattern.ts";
import Grammarcontent from "./grammar-content.ts";
import Includecontent from "./include-content.ts";
import Nameclass from "./name-class.ts";
import Name from "./name.ts";
import Datatypename from "./datatype-name.ts";
import Namespaceuriliteral from "./namespace-uri-literal.ts";
import Identifierorkeyword from "./identifier-or-keyword.ts";
import Identifier from "./identifier.ts";
import Literalsegment from "./literal-segment.ts";
export type {
  Datatypename,
  Decl,
  Grammarcontent,
  Identifier,
  Identifierorkeyword,
  Includecontent,
  Name,
  Nameclass,
  Namespaceuriliteral,
  Pattern,
};

// https://www.oasis-open.org/committees/relax-ng/compact-20021121.html#syntax
export type AstNode =
  | Toplevel
  | Decl
  | Pattern
  | Param
  | Exceptpattern
  | Grammarcontent
  | Includecontent
  | Start
  | Define
  | Assignmethod
  | Nameclass
  | Name
  | Exceptnameclass
  | Datatypename
  | Datatypevalue
  | Anyuriliteral
  | Namespaceuriliteral
  | Inherit
  | Identifierorkeyword
  | Identifier
  | Quotedidentifier
  | Cname
  | Nsname
  | Anyname
  | Literal
  | Literalsegment
  | Keyword;
export interface NodeBase<T extends string> extends Span {
  type: T;
}
export interface Toplevel extends NodeBase<"topLevel"> {
  stmts: (Decl | Pattern | Grammarcontent)[];
}
export interface Param extends NodeBase<"param"> {
  identifierOrKeyword: Identifierorkeyword;
  eq: Token;
  literal: Literal;
}
export interface Exceptpattern extends NodeBase<"exceptPattern"> {
  minus: Token;
  pattern: Pattern;
}
export interface Start extends NodeBase<"start"> {
  startToken: Token;
  assignMethod: Assignmethod;
  pattern: Pattern;
}
export interface Define extends NodeBase<"define"> {
  identifier: Identifier;
  assignMethod: Assignmethod;
  pattern: Pattern;
}
export interface Assignmethod extends NodeBase<"assignMethod">, Token {}
export interface Exceptnameclass extends NodeBase<"exceptNameClass"> {
  minus: Token;
  nameClass: Nameclass;
}
export interface Datatypevalue extends NodeBase<"datatypeValue"> {
  literal: Literal;
}
export interface Anyuriliteral extends NodeBase<"anyURILiteral"> {
  literal: Literal;
}
export interface Inherit extends NodeBase<"inherit"> {
  inherit: Token;
  eq: Token;
  identifierOrKeyword: Identifierorkeyword;
}
export interface Quotedidentifier extends NodeBase<"quotedIdentifier"> {
  backslash: Token;
  ncname: Token;
}
export interface Cname extends NodeBase<"CName"> {
  ncname: Token;
  colon: Token;
  ncname2: Token;
}
export interface Nsname extends NodeBase<"nsName"> {
  ncname: Token;
  colonStar: Token;
}
export interface Anyname extends NodeBase<"anyName">, Token {}
export interface Literal extends NodeBase<"literal"> {
  literalSegmentOrTildes: (Literalsegment | Token)[];
}
export interface Keyword extends NodeBase<"keyword">, Token {}
