"use strict";
var fs = require("fs");
var _ = require("lodash");
var codegen = require("escodegen");
var esprima = require("esprima");
var estraverse = require("estraverse");
var FUNCTION_OR_CLASS_NODE = [
    "ArrowFunctionExpression",
    "ClassDeclaration",
    "FunctionDeclaration",
    "FunctionExpression"
];
var normalize = function (token_list) {
    return _.map(token_list, function (t) { return t.value; });
};
var tokenize = function (code) {
    return normalize(esprima.tokenize(code));
};
var astify = function (code) {
    return esprima.parse(code, { loc: true });
};
var ast_to_code = function (node) {
    var opts = { format: { indent: { style: "  " } } };
    return codegen.generate(node, opts);
};
var is_a_method_or_class = function (node) {
    return _.some(FUNCTION_OR_CLASS_NODE, function (type) { return type === node.type; });
};
var line_info = function (node) { return node.loc; };
var parse_methods_and_classes = function (root_node, filepath) {
    var entries = [];
    estraverse.traverse(root_node, {
        enter: function (node, parent) {
            if (!is_a_method_or_class(node))
                return;
            var method = ast_to_code(node);
            var tokens = tokenize(method);
            var result = {
                ast: node,
                code: method,
                is_class: node.type === "ClassDeclaration",
                path: filepath,
                pos: line_info(node),
                tokens: tokens,
                type: node.type
            };
            entries.push(result);
        }
    });
    return entries;
};
var find_similar_methods_and_classes = function (filepaths) {
    return _.flatMap(filepaths, function (filepath) {
        var code = fs.readFileSync(filepath).toString();
        var node = astify(code);
        return parse_methods_and_classes(node, filepath);
    });
};
module.exports = {
    find: find_similar_methods_and_classes
};