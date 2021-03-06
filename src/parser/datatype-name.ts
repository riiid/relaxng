import * as ast from "../ast/index.ts";
import * as datatypeName from "../ast/datatype-name.ts";
import { acceptCname, AcceptFn } from "./index.ts";
import { choice } from "./misc.ts";

export const acceptCnameDatatypename: AcceptFn<datatypeName.CnameDatatypename> =
  (parser) => {
    const cname = acceptCname(parser);
    if (!cname) return;
    const { start, end } = cname;
    return {
      type: "datatypeName",
      kind: "name",
      cname,
      start,
      end,
    };
  };

export const acceptStringDatatypename: AcceptFn<
  datatypeName.StringDatatypename
> = (parser) => {
  const string = parser.accept("string");
  if (!string) return;
  return {
    type: "datatypeName",
    kind: "string",
    string,
    ...string,
  };
};

export const acceptTokenDatatypename: AcceptFn<datatypeName.TokenDatatypename> =
  (parser) => {
    const token = parser.accept("token");
    if (!token) return;
    return {
      type: "datatypeName",
      kind: "token",
      token,
      ...token,
    };
  };

export const acceptDatatypeName = choice<ast.Datatypename>([
  acceptCnameDatatypename,
  acceptStringDatatypename,
  acceptTokenDatatypename,
]);
