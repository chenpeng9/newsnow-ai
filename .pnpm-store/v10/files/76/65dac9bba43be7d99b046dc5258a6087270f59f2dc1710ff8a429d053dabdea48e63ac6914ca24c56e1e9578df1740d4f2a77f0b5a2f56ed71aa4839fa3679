import { DEFAULT_ESLINT_REACT_SETTINGS, WEBSITE_URL, getConfigAdapters } from "@eslint-react/shared";
import * as ast from "@eslint-react/ast";
import { findVariable, getVariableDefinitionNode } from "@eslint-react/var";
import { AST_NODE_TYPES } from "@typescript-eslint/types";
import { ESLintUtils } from "@typescript-eslint/utils";

//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) {
		__defProp(target, name, {
			get: all[name],
			enumerable: true
		});
	}
	if (!no_symbols) {
		__defProp(target, Symbol.toStringTag, { value: "Module" });
	}
	return target;
};

//#endregion
//#region src/configs/disable-experimental.ts
var disable_experimental_exports = /* @__PURE__ */ __exportAll({
	name: () => name$5,
	rules: () => rules$4
});
const name$5 = "react-rsc/disable-experimental";
const rules$4 = { "react-rsc/function-definition": "off" };

//#endregion
//#region package.json
var name$4 = "eslint-plugin-react-rsc";
var version = "2.13.0";

//#endregion
//#region src/utils/create-rule.ts
function getDocsUrl(ruleName) {
	return `${WEBSITE_URL}/docs/rules/${ruleName}`;
}
const createRule = ESLintUtils.RuleCreator(getDocsUrl);

//#endregion
//#region src/rules/function-definition.ts
const RULE_NAME = "function-definition";
var function_definition_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Validate and transform React Client/Server Function definitions." },
		fixable: "code",
		messages: {
			file: "Functions exported from files with `use server` directive are React Server Functions and therefore must be async.",
			local: "Functions with `use server` directive are React Server Functions and therefore must be async."
		},
		schema: []
	},
	name: RULE_NAME,
	create,
	defaultOptions: []
});
function create(context) {
	if (!context.sourceCode.text.includes("use server")) return {};
	const hasFileLevelUseServerDirective = ast.getFileDirectives(context.sourceCode.ast).some((d) => d.directive === "use server");
	/**
	* Check if `node` is an async function, and report if not
	* @param node The function node to check
	* @returns Whether a report was made
	*/
	function getAsyncFix(node) {
		if (node.type === AST_NODE_TYPES.FunctionDeclaration || node.type === AST_NODE_TYPES.FunctionExpression) {
			const fnToken = context.sourceCode.getFirstToken(node);
			if (fnToken != null) return (fixer) => fixer.insertTextBefore(fnToken, "async ");
			return null;
		}
		if (node.type === AST_NODE_TYPES.ArrowFunctionExpression) return (fixer) => fixer.insertTextBefore(node, "async ");
		return null;
	}
	function reportNonAsyncFunction(node, messageId) {
		if (!ast.isFunction(node)) return false;
		if (!node.async) {
			context.report({
				messageId,
				node,
				fix: getAsyncFix(node)
			});
			return true;
		}
		return false;
	}
	/**
	* Check non-exported local functions for 'use server' directives, and report if they are not async
	* @param node The function node to check
	*/
	function checkLocalServerFunction(node) {
		if (ast.getFunctionDirectives(node).some((d) => d.directive === "use server")) reportNonAsyncFunction(node, "local");
	}
	/**
	* Find function declarations from exports and check them
	* @param id The identifier of the exported function
	* @param node The export declaration node
	*/
	function findAndCheckExportedFunctionDeclarations(id, node) {
		const variableNode = getVariableDefinitionNode(findVariable(id.name, context.sourceCode.getScope(node)), 0);
		if (variableNode == null) return;
		reportNonAsyncFunction(variableNode, "file");
	}
	return {
		ArrowFunctionExpression(node) {
			checkLocalServerFunction(node);
		},
		ExportDefaultDeclaration(node) {
			if (!hasFileLevelUseServerDirective) return;
			const decl = node.declaration;
			if (reportNonAsyncFunction(decl, "file")) return;
			if (ast.isIdentifier(decl)) findAndCheckExportedFunctionDeclarations(decl, node);
		},
		ExportNamedDeclaration(node) {
			if (!hasFileLevelUseServerDirective) return;
			if (node.declaration != null) {
				const decl = node.declaration;
				if (reportNonAsyncFunction(decl, "file")) return;
				if (decl.type === AST_NODE_TYPES.VariableDeclaration) for (const declarator of decl.declarations) reportNonAsyncFunction(declarator.init, "file");
				return;
			}
			if (node.source == null && node.specifiers.length > 0) for (const spec of node.specifiers) findAndCheckExportedFunctionDeclarations(spec.local, node);
		},
		FunctionDeclaration(node) {
			checkLocalServerFunction(node);
		},
		FunctionExpression(node) {
			checkLocalServerFunction(node);
		}
	};
}

//#endregion
//#region src/plugin.ts
const plugin = {
	meta: {
		name: name$4,
		version
	},
	rules: { "function-definition": function_definition_default }
};

//#endregion
//#region src/configs/recommended.ts
var recommended_exports = /* @__PURE__ */ __exportAll({
	name: () => name$3,
	plugins: () => plugins$3,
	rules: () => rules$3,
	settings: () => settings$3
});
const name$3 = "react-rsc/recommended";
const rules$3 = { "react-rsc/function-definition": "error" };
const plugins$3 = { "react-rsc": plugin };
const settings$3 = { "react-rsc": DEFAULT_ESLINT_REACT_SETTINGS };

//#endregion
//#region src/configs/recommended-typescript.ts
var recommended_typescript_exports = /* @__PURE__ */ __exportAll({
	name: () => name$2,
	plugins: () => plugins$2,
	rules: () => rules$2,
	settings: () => settings$2
});
const name$2 = "react-rsc/recommended-typescript";
const rules$2 = { ...rules$3 };
const plugins$2 = { ...plugins$3 };
const settings$2 = { ...settings$3 };

//#endregion
//#region src/configs/strict.ts
var strict_exports = /* @__PURE__ */ __exportAll({
	name: () => name$1,
	plugins: () => plugins$1,
	rules: () => rules$1,
	settings: () => settings$1
});
const name$1 = "react-rsc/strict";
const rules$1 = { ...rules$3 };
const plugins$1 = { ...plugins$3 };
const settings$1 = { ...settings$3 };

//#endregion
//#region src/configs/strict-typescript.ts
var strict_typescript_exports = /* @__PURE__ */ __exportAll({
	name: () => name,
	plugins: () => plugins,
	rules: () => rules,
	settings: () => settings
});
const name = "react-rsc/strict-typescript";
const rules = { ...rules$1 };
const plugins = { ...plugins$1 };
const settings = { ...settings$1 };

//#endregion
//#region src/index.ts
const { toFlatConfig } = getConfigAdapters("react-rsc", plugin);
var src_default = {
	...plugin,
	configs: {
		["disable-experimental"]: toFlatConfig(disable_experimental_exports),
		["recommended"]: toFlatConfig(recommended_exports),
		["recommended-typescript"]: toFlatConfig(recommended_typescript_exports),
		["strict"]: toFlatConfig(strict_exports),
		["strict-typescript"]: toFlatConfig(strict_typescript_exports)
	}
};

//#endregion
export { src_default as default };