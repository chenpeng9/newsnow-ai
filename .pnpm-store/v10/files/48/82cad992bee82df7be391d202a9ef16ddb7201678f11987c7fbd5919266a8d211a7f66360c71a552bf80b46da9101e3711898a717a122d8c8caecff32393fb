import { WEBSITE_URL, getConfigAdapters, getSettingsFromContext } from "@eslint-react/shared";
import * as ast from "@eslint-react/ast";
import * as core from "@eslint-react/core";
import { constVoid, getOrElseUpdate, not } from "@eslint-react/eff";
import { findVariable, getVariableDefinitionNode } from "@eslint-react/var";
import { AST_NODE_TYPES } from "@typescript-eslint/types";
import { getStaticValue } from "@typescript-eslint/utils/ast-utils";
import { match } from "ts-pattern";
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
//#region src/configs/recommended.ts
var recommended_exports = /* @__PURE__ */ __exportAll({
	name: () => name$1,
	rules: () => rules
});
const name$1 = "react-hooks-extra/recommended";
const rules = { "react-hooks-extra/no-direct-set-state-in-use-effect": "warn" };

//#endregion
//#region package.json
var name = "eslint-plugin-react-hooks-extra";
var version = "2.13.0";

//#endregion
//#region src/utils/create-rule.ts
function getDocsUrl(ruleName) {
	return `${WEBSITE_URL}/docs/rules/hooks-extra-${ruleName}`;
}
const createRule = ESLintUtils.RuleCreator(getDocsUrl);

//#endregion
//#region src/utils/is-variable-declarator-from-hook-call.ts
function isInitFromHookCall(init) {
	if (init?.type !== AST_NODE_TYPES.CallExpression) return false;
	switch (init.callee.type) {
		case AST_NODE_TYPES.Identifier: return core.isHookName(init.callee.name);
		case AST_NODE_TYPES.MemberExpression: return init.callee.property.type === AST_NODE_TYPES.Identifier && core.isHookName(init.callee.property.name);
		default: return false;
	}
}
function isVariableDeclaratorFromHookCall(node) {
	if (node.type !== AST_NODE_TYPES.VariableDeclarator) return false;
	if (node.id.type !== AST_NODE_TYPES.Identifier) return false;
	return isInitFromHookCall(node.init);
}

//#endregion
//#region src/rules/no-direct-set-state-in-use-effect.ts
const RULE_NAME = "no-direct-set-state-in-use-effect";
var no_direct_set_state_in_use_effect_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Disallows direct calls to the ['set' function](https://react.dev/reference/react/useState#setstate) of 'useState' in 'useEffect'." },
		messages: { default: "Do not call the 'set' function '{{name}}' of 'useState' directly in 'useEffect'." },
		schema: []
	},
	name: RULE_NAME,
	create,
	defaultOptions: []
});
function create(context) {
	if (!/use\w*Effect/u.test(context.sourceCode.text)) return {};
	const { additionalStateHooks } = getSettingsFromContext(context);
	const functionEntries = [];
	const setupFnRef = { current: null };
	const setupFnIds = [];
	const trackedFnCalls = [];
	const setStateCallsByFn = /* @__PURE__ */ new WeakMap();
	const setStateInEffectArg = /* @__PURE__ */ new WeakMap();
	const setStateInEffectSetup = /* @__PURE__ */ new Map();
	const setStateInHookCallbacks = /* @__PURE__ */ new WeakMap();
	const getText = (n) => context.sourceCode.getText(n);
	const onSetupFunctionEnter = (node) => {
		setupFnRef.current = node;
	};
	const onSetupFunctionExit = (node) => {
		if (setupFnRef.current === node) setupFnRef.current = null;
	};
	function isThenCall(node) {
		return node.callee.type === AST_NODE_TYPES.MemberExpression && node.callee.property.type === AST_NODE_TYPES.Identifier && node.callee.property.name === "then";
	}
	function isUseStateCall(node) {
		return core.isUseStateLikeCall(node, additionalStateHooks);
	}
	function isUseEffectSetupCallback(node) {
		return node.parent?.type === AST_NODE_TYPES.CallExpression && node.parent.callee !== node && core.isUseEffectLikeCall(node.parent);
	}
	function getCallName(node) {
		if (node.type === AST_NODE_TYPES.CallExpression) return ast.getFullyQualifiedName(node.callee, getText);
		return ast.getFullyQualifiedName(node, getText);
	}
	function getCallKind(node) {
		return match(node).when(isUseStateCall, () => "useState").when(core.isUseEffectLikeCall, () => "useEffect").when(isSetStateCall, () => "setState").when(isThenCall, () => "then").otherwise(() => "other");
	}
	function getFunctionKind(node) {
		const parent = ast.findParentNode(node, not(ast.isTypeExpression)) ?? node.parent;
		switch (true) {
			case node.async:
			case parent.type === AST_NODE_TYPES.CallExpression && isThenCall(parent): return "deferred";
			case node.type !== AST_NODE_TYPES.FunctionDeclaration && parent.type === AST_NODE_TYPES.CallExpression && parent.callee === node: return "immediate";
			case isUseEffectSetupCallback(node): return "setup";
			default: return "other";
		}
	}
	function isIdFromUseStateCall(topLevelId, at) {
		const variableNode = getVariableDefinitionNode(findVariable(topLevelId, context.sourceCode.getScope(topLevelId)), 0);
		if (variableNode == null) return false;
		if (variableNode.type !== AST_NODE_TYPES.CallExpression) return false;
		if (!isUseStateCall(variableNode)) return false;
		const variableNodeParent = variableNode.parent;
		if (!("id" in variableNodeParent) || variableNodeParent.id?.type !== AST_NODE_TYPES.ArrayPattern) return true;
		return variableNodeParent.id.elements.findIndex((e) => e?.type === AST_NODE_TYPES.Identifier && e.name === topLevelId.name) === at;
	}
	function isSetStateCall(node) {
		switch (node.callee.type) {
			case AST_NODE_TYPES.CallExpression: {
				const { callee } = node.callee;
				if (callee.type !== AST_NODE_TYPES.MemberExpression) return false;
				if (!("name" in callee.object)) return false;
				const isAt = callee.property.type === AST_NODE_TYPES.Identifier && callee.property.name === "at";
				const [index] = node.callee.arguments;
				if (!isAt || index == null) return false;
				return getStaticValue(index, context.sourceCode.getScope(node))?.value === 1 && isIdFromUseStateCall(callee.object);
			}
			case AST_NODE_TYPES.Identifier: return isIdFromUseStateCall(node.callee, 1);
			case AST_NODE_TYPES.MemberExpression: {
				if (!("name" in node.callee.object)) return false;
				const property = node.callee.property;
				return getStaticValue(property, context.sourceCode.getScope(node))?.value === 1 && isIdFromUseStateCall(node.callee.object, 1);
			}
			default: return false;
		}
	}
	return {
		":function"(node) {
			const kind = getFunctionKind(node);
			functionEntries.push({
				kind,
				node
			});
			if (kind === "setup") onSetupFunctionEnter(node);
		},
		":function:exit"(node) {
			const { kind } = functionEntries.at(-1) ?? {};
			if (kind === "setup") onSetupFunctionExit(node);
			functionEntries.pop();
		},
		CallExpression(node) {
			const setupFunction = setupFnRef.current;
			const entry = functionEntries.at(-1);
			if (entry == null || entry.node.async) return;
			match(getCallKind(node)).with("setState", () => {
				switch (true) {
					case entry.kind === "deferred":
					case entry.node.async: break;
					case entry.node === setupFunction:
					case entry.kind === "immediate" && ast.findParentNode(entry.node, ast.isFunction) === setupFunction:
						context.report({
							messageId: "default",
							node,
							data: { name: context.sourceCode.getText(node.callee) }
						});
						return;
					default: {
						const init = ast.findParentNode(node, isVariableDeclaratorFromHookCall)?.init;
						if (init == null) getOrElseUpdate(setStateCallsByFn, entry.node, () => []).push(node);
						else getOrElseUpdate(setStateInHookCallbacks, init, () => []).push(node);
					}
				}
			}).with("useEffect", () => {
				if (ast.isFunction(node.arguments.at(0))) return;
				setupFnIds.push(...ast.getNestedIdentifiers(node));
			}).with("other", () => {
				if (entry.node !== setupFunction) return;
				trackedFnCalls.push(node);
			}).otherwise(constVoid);
		},
		Identifier(node) {
			if (node.parent.type === AST_NODE_TYPES.CallExpression && node.parent.callee === node) return;
			if (!isIdFromUseStateCall(node, 1)) return;
			switch (node.parent.type) {
				case AST_NODE_TYPES.ArrowFunctionExpression: {
					const parent = node.parent.parent;
					if (parent.type !== AST_NODE_TYPES.CallExpression) break;
					if (!core.isUseMemoCall(parent)) break;
					const init = ast.findParentNode(parent, isVariableDeclaratorFromHookCall)?.init;
					if (init != null) getOrElseUpdate(setStateInEffectArg, init, () => []).push(node);
					break;
				}
				case AST_NODE_TYPES.CallExpression:
					if (node !== node.parent.arguments.at(0)) break;
					if (core.isUseCallbackCall(node.parent)) {
						const init = ast.findParentNode(node.parent, isVariableDeclaratorFromHookCall)?.init;
						if (init != null) getOrElseUpdate(setStateInEffectArg, init, () => []).push(node);
						break;
					}
					if (core.isUseEffectLikeCall(node.parent)) getOrElseUpdate(setStateInEffectSetup, node.parent, () => []).push(node);
			}
		},
		"Program:exit"() {
			const getSetStateCalls = (id, initialScope) => {
				const node = getVariableDefinitionNode(findVariable(id, initialScope), 0);
				switch (node?.type) {
					case AST_NODE_TYPES.ArrowFunctionExpression:
					case AST_NODE_TYPES.FunctionDeclaration:
					case AST_NODE_TYPES.FunctionExpression: return setStateCallsByFn.get(node) ?? [];
					case AST_NODE_TYPES.CallExpression: return setStateInHookCallbacks.get(node) ?? setStateInEffectArg.get(node) ?? [];
				}
				return [];
			};
			for (const [, calls] of setStateInEffectSetup) for (const call of calls) context.report({
				messageId: "default",
				node: call,
				data: { name: call.name }
			});
			for (const { callee } of trackedFnCalls) {
				if (!("name" in callee)) continue;
				const { name } = callee;
				const setStateCalls = getSetStateCalls(name, context.sourceCode.getScope(callee));
				for (const setStateCall of setStateCalls) context.report({
					messageId: "default",
					node: setStateCall,
					data: { name: getCallName(setStateCall) }
				});
			}
			for (const id of setupFnIds) {
				const setStateCalls = getSetStateCalls(id.name, context.sourceCode.getScope(id));
				for (const setStateCall of setStateCalls) context.report({
					messageId: "default",
					node: setStateCall,
					data: { name: getCallName(setStateCall) }
				});
			}
		}
	};
}

//#endregion
//#region src/plugin.ts
const plugin = {
	meta: {
		name,
		version
	},
	rules: { "no-direct-set-state-in-use-effect": no_direct_set_state_in_use_effect_default }
};

//#endregion
//#region src/index.ts
const { toFlatConfig } = getConfigAdapters("react-hooks-extra", plugin);
var src_default = {
	...plugin,
	configs: { ["recommended"]: toFlatConfig(recommended_exports) }
};

//#endregion
export { src_default as default };