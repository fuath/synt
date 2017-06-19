/// <reference types="estree" />
/// <reference types="commander" />

import * as ts from "typescript";
import * as es from "estree";
import * as commander from "commander";

declare const synt : synt.Lib;

export = synt;
export as namespace synt;

declare namespace synt {
  export type TokenList = string[];

  interface BaseOptions {
    minlength?  : string | number;
    ngram?      : string | number;
    similarity? : string | number;
    estype?     : string;
  }

  export interface CLIOptions extends BaseOptions, commander.CommanderStatic {}

  export interface CompareOptions extends BaseOptions {}

  interface ParseResultBase {
    code     : string;
    is_class : boolean;
    path     : string;
    pos      : LineInfo;
    tokens   : string[];
    type     : string;
  }

  export interface TSParseResult extends ParseResultBase {
    ast : ts.Node;
  }

  export interface JSParseResult extends ParseResultBase {
    ast : es.Node;
  }

  export type ParseResult = JSParseResult | TSParseResult

  export type ParseResultMatchList = ParseResult[][];

  export interface ParseResultGroup {
    [sim : string] : ParseResultMatchList;
  }

  export interface ParseResultGroups {
    js : ParseResultGroup;
    ts : ParseResultGroup;
  }

  export interface LineInfo {
    start? : {
      line : number;
      column? : number;
    };

    end? : {
      line : number;
      column? : number;
    };
  }

  export interface Lib {
    compare : (
      files : string[],
      opts  : CompareOptions
    ) => ParseResultGroups;

    print : (
      group    : synt.ParseResultGroup,
      nocolors : boolean
    ) => void;

    DEFAULT_NGRAM_LENGTH : number;
    DEFAULT_THRESHOLD    : number;
    DEFAULT_TOKEN_LENGTH : number;
  }
}
