import { findImportSource, findProperty, findVariable, getVariableDefinitionNode } from "@eslint-react/var";
import * as ast from "@eslint-react/ast";
import { constFalse, constTrue, dual, flip, getOrElseUpdate, identity, unit } from "@eslint-react/eff";
import { AST_NODE_TYPES } from "@typescript-eslint/types";
import { IdGenerator, RE_ANNOTATION_JSX, RE_ANNOTATION_JSX_FRAG, RE_ANNOTATION_JSX_IMPORT_SOURCE, RE_ANNOTATION_JSX_RUNTIME, RE_COMPONENT_NAME, RE_COMPONENT_NAME_LOOSE } from "@eslint-react/shared";
import { getStaticValue } from "@typescript-eslint/utils/ast-utils";
import { P, match } from "ts-pattern";
import { AST_NODE_TYPES as AST_NODE_TYPES$1 } from "@typescript-eslint/utils";

//#region src/api/is-from-react.ts
/**
* Check if a variable is initialized from React import
* @param name The variable name
* @param initialScope The initial scope
* @param importSource Alternative import source of React (e.g., "preact/compat")
* @returns True if the variable is initialized or derived from React import
*/
function isInitializedFromReact(name, initialScope, importSource = "react") {
	return name.toLowerCase() === "react" || Boolean(findImportSource(name, initialScope)?.startsWith(importSource));
}

//#endregion
//#region src/api/is-from-react-native.ts
/**
* if a variable is initialized from React Native import
* @param name The variable name
* @param initialScope The initial scope
* @param importSource Alternative import source of React Native (e.g., "react-native-web")
* @returns True if the variable is initialized from React Native import
*/
function isInitializedFromReactNative(name, initialScope, importSource = "react-native") {
	return [
		"react_native",
		"reactnative",
		"rn"
	].includes(name.toLowerCase()) || Boolean(findImportSource(name, initialScope)?.startsWith(importSource));
}

//#endregion
//#region src/api/is-react-api.ts
/**
* Check if the node is a React API identifier or member expression
* @param api The React API name to check against (e.g., "useState", "React.memo")
* @returns A predicate function to check if a node matches the API
*/
function isReactAPI(api) {
	const func = (context, node) => {
		if (node == null) return false;
		const getText = (n) => context.sourceCode.getText(n);
		const name = ast.getFullyQualifiedName(node, getText);
		if (name === api) return true;
		if (name.substring(name.indexOf(".") + 1) === api) return true;
		return false;
	};
	return dual(2, func);
}
/**
* Check if the node is a call expression to a specific React API
* @param api The React API name to check against
* @returns A predicate function to check if a node is a call to the API
*/
function isReactAPICall(api) {
	const func = (context, node) => {
		if (node == null) return false;
		if (node.type !== AST_NODE_TYPES.CallExpression) return false;
		return isReactAPI(api)(context, node.callee);
	};
	return dual(2, func);
}
const isCaptureOwnerStack = isReactAPI("captureOwnerStack");
const isChildrenCount = isReactAPI("Children.count");
const isChildrenForEach = isReactAPI("Children.forEach");
const isChildrenMap = isReactAPI("Children.map");
const isChildrenOnly = isReactAPI("Children.only");
const isChildrenToArray = isReactAPI("Children.toArray");
const isCloneElement = isReactAPI("cloneElement");
const isCreateContext = isReactAPI("createContext");
const isCreateElement = isReactAPI("createElement");
const isCreateRef = isReactAPI("createRef");
const isForwardRef = isReactAPI("forwardRef");
const isMemo = isReactAPI("memo");
const isLazy = isReactAPI("lazy");
const isCaptureOwnerStackCall = isReactAPICall("captureOwnerStack");
const isChildrenCountCall = isReactAPICall("Children.count");
const isChildrenForEachCall = isReactAPICall("Children.forEach");
const isChildrenMapCall = isReactAPICall("Children.map");
const isChildrenOnlyCall = isReactAPICall("Children.only");
const isChildrenToArrayCall = isReactAPICall("Children.toArray");
const isCloneElementCall = isReactAPICall("cloneElement");
const isCreateContextCall = isReactAPICall("createContext");
const isCreateElementCall = isReactAPICall("createElement");
const isCreateRefCall = isReactAPICall("createRef");
const isForwardRefCall = isReactAPICall("forwardRef");
const isMemoCall = isReactAPICall("memo");
const isLazyCall = isReactAPICall("lazy");

//#endregion
//#region src/hook/hook-name.ts
const REACT_BUILTIN_HOOK_NAMES = [
	"use",
	"useActionState",
	"useCallback",
	"useContext",
	"useDebugValue",
	"useDeferredValue",
	"useEffect",
	"useFormStatus",
	"useId",
	"useImperativeHandle",
	"useInsertionEffect",
	"useLayoutEffect",
	"useMemo",
	"useOptimistic",
	"useReducer",
	"useRef",
	"useState",
	"useSyncExternalStore",
	"useTransition"
];
/**
* Catch all identifiers that begin with "use" followed by an uppercase Latin
* character to exclude identifiers like "user".
* @param name The name of the identifier to check.
* @see https://github.com/facebook/react/blob/1d6c8168db1d82713202e842df3167787ffa00ed/packages/eslint-plugin-react-hooks/src/rules/RulesOfHooks.ts#L16
*/
function isHookName(name) {
	return name === "use" || /^use[A-Z0-9]/.test(name);
}

//#endregion
//#region src/hook/hook-is.ts
/**
* Determine if a function node is a React Hook based on its name.
* @param node The function node to check
* @returns True if the function is a React Hook, false otherwise
*/
function isHook(node) {
	if (node == null) return false;
	const id = ast.getFunctionId(node);
	switch (id?.type) {
		case AST_NODE_TYPES.Identifier: return isHookName(id.name);
		case AST_NODE_TYPES.MemberExpression: return "name" in id.property && isHookName(id.property.name);
		default: return false;
	}
}
/**
* Check if the given node is a React Hook call by its name.
* @param node The node to check.
* @returns `true` if the node is a React Hook call, `false` otherwise.
*/
function isHookCall(node) {
	if (node == null) return false;
	if (node.type !== AST_NODE_TYPES.CallExpression) return false;
	if (node.callee.type === AST_NODE_TYPES.Identifier) return isHookName(node.callee.name);
	if (node.callee.type === AST_NODE_TYPES.MemberExpression) return node.callee.property.type === AST_NODE_TYPES.Identifier && isHookName(node.callee.property.name);
	return false;
}
/**
* Check if a node is a call to a specific React hook.
* Returns a function that accepts a hook name to check against.
* @param node The AST node to check
* @returns A function that takes a hook name and returns boolean
*/
function isHookCallWithName(node) {
	if (node == null || node.type !== AST_NODE_TYPES.CallExpression) return constFalse;
	return (name) => {
		switch (node.callee.type) {
			case AST_NODE_TYPES.Identifier: return node.callee.name === name;
			case AST_NODE_TYPES.MemberExpression: return node.callee.property.type === AST_NODE_TYPES.Identifier && node.callee.property.name === name;
			default: return false;
		}
	};
}
/**
* Detect useEffect calls and variations (useLayoutEffect, etc.) using a regex pattern
* @param node The AST node to check
* @param additionalEffectHooks Regex pattern matching custom hooks that should be treated as effect hooks
* @returns True if the node is a useEffect-like call
*/
function isUseEffectLikeCall(node, additionalEffectHooks = { test: constFalse }) {
	if (node == null) return false;
	if (node.type !== AST_NODE_TYPES.CallExpression) return false;
	return [/^use\w*Effect$/u, additionalEffectHooks].some((regexp) => {
		if (node.callee.type === AST_NODE_TYPES.Identifier) return regexp.test(node.callee.name);
		if (node.callee.type === AST_NODE_TYPES.MemberExpression) return node.callee.property.type === AST_NODE_TYPES.Identifier && regexp.test(node.callee.property.name);
		return false;
	});
}
/**
* Detect useState calls and variations (useCustomState, etc.) using a regex pattern
* @param node The AST node to check
* @param additionalStateHooks Regex pattern matching custom hooks that should be treated as state hooks
* @returns True if the node is a useState-like call
*/
function isUseStateLikeCall(node, additionalStateHooks = { test: constFalse }) {
	if (node == null) return false;
	if (node.type !== AST_NODE_TYPES.CallExpression) return false;
	return [/^use\w*State$/u, additionalStateHooks].some((regexp) => {
		if (node.callee.type === AST_NODE_TYPES.Identifier) return regexp.test(node.callee.name);
		if (node.callee.type === AST_NODE_TYPES.MemberExpression) return node.callee.property.type === AST_NODE_TYPES.Identifier && regexp.test(node.callee.property.name);
		return false;
	});
}
const isUseCall = flip(isHookCallWithName)("use");
const isUseActionStateCall = flip(isHookCallWithName)("useActionState");
const isUseCallbackCall = flip(isHookCallWithName)("useCallback");
const isUseContextCall = flip(isHookCallWithName)("useContext");
const isUseDebugValueCall = flip(isHookCallWithName)("useDebugValue");
const isUseDeferredValueCall = flip(isHookCallWithName)("useDeferredValue");
const isUseEffectCall = flip(isHookCallWithName)("useEffect");
const isUseFormStatusCall = flip(isHookCallWithName)("useFormStatus");
const isUseIdCall = flip(isHookCallWithName)("useId");
const isUseImperativeHandleCall = flip(isHookCallWithName)("useImperativeHandle");
const isUseInsertionEffectCall = flip(isHookCallWithName)("useInsertionEffect");
const isUseLayoutEffectCall = flip(isHookCallWithName)("useLayoutEffect");
const isUseMemoCall = flip(isHookCallWithName)("useMemo");
const isUseOptimisticCall = flip(isHookCallWithName)("useOptimistic");
const isUseReducerCall = flip(isHookCallWithName)("useReducer");
const isUseRefCall = flip(isHookCallWithName)("useRef");
const isUseStateCall = flip(isHookCallWithName)("useState");
const isUseSyncExternalStoreCall = flip(isHookCallWithName)("useSyncExternalStore");
const isUseTransitionCall = flip(isHookCallWithName)("useTransition");

//#endregion
//#region src/hook/hook-callback.ts
/**
* Determine if a node is the setup function passed to a useEffect-like hook
* @param node The AST node to check
*/
function isUseEffectSetupCallback(node) {
	if (node == null) return false;
	return node.parent?.type === AST_NODE_TYPES.CallExpression && node.parent.arguments.at(0) === node && isUseEffectLikeCall(node.parent);
}
/**
* Determine if a node is the cleanup function returned by a useEffect-like hook's setup function
* @param node The AST node to check
*/
function isUseEffectCleanupCallback(node) {
	if (node == null) return false;
	const returnStatement = ast.findParentNode(node, ast.is(AST_NODE_TYPES.ReturnStatement));
	const enclosingFunction = ast.findParentNode(node, ast.isFunction);
	if (enclosingFunction !== ast.findParentNode(returnStatement, ast.isFunction)) return false;
	return isUseEffectSetupCallback(enclosingFunction);
}

//#endregion
//#region src/hook/hook-id.ts
/**
* Checks if the given node is a hook identifier
* @param id The AST node to check
* @returns `true` if the node is a hook identifier or member expression with hook name, `false` otherwise
*/
function isHookId(id) {
	switch (id.type) {
		case AST_NODE_TYPES.Identifier: return isHookName(id.name);
		case AST_NODE_TYPES.MemberExpression: return "name" in id.property && isHookName(id.property.name);
		default: return false;
	}
}

//#endregion
//#region src/hook/hook-collector.ts
const idGen$2 = new IdGenerator("hook_");
/**
* Get a ctx and visitor object for the rule to collect hooks
* @param context The ESLint rule context
* @returns The ctx and visitor of the collector
*/
function useHookCollector(context) {
	const hooks = /* @__PURE__ */ new Map();
	const functionEntries = [];
	const getText = (n) => context.sourceCode.getText(n);
	const getCurrentEntry = () => functionEntries.at(-1);
	const onFunctionEnter = (node) => {
		const id = ast.getFunctionId(node);
		const key = idGen$2.next();
		functionEntries.push({
			key,
			node
		});
		if (id == null || !isHookId(id)) return;
		hooks.set(key, {
			id,
			key,
			kind: "function",
			name: ast.getFullyQualifiedName(id, getText),
			node,
			directives: [],
			flag: 0n,
			hint: 0n,
			hookCalls: []
		});
	};
	const onFunctionExit = () => {
		functionEntries.pop();
	};
	return {
		ctx: {
			getAllHooks(node) {
				return [...hooks.values()];
			},
			getCurrentEntries: () => functionEntries,
			getCurrentEntry
		},
		visitor: {
			":function": onFunctionEnter,
			":function:exit": onFunctionExit,
			CallExpression(node) {
				if (!isHookCall(node)) return;
				const entry = getCurrentEntry();
				if (entry == null) return;
				hooks.get(entry.key)?.hookCalls.push(node);
			}
		}
	};
}

//#endregion
//#region src/jsx/jsx-stringify.ts
/**
* Incomplete but sufficient stringification of JSX nodes for common use cases
*
* @param node JSX node from TypeScript ESTree
* @returns String representation of the JSX node
*/
function stringifyJsx(node) {
	switch (node.type) {
		case AST_NODE_TYPES.JSXIdentifier: return node.name;
		case AST_NODE_TYPES.JSXNamespacedName: return `${node.namespace.name}:${node.name.name}`;
		case AST_NODE_TYPES.JSXMemberExpression: return `${stringifyJsx(node.object)}.${stringifyJsx(node.property)}`;
		case AST_NODE_TYPES.JSXText: return node.value;
		case AST_NODE_TYPES.JSXOpeningElement: return `<${stringifyJsx(node.name)}>`;
		case AST_NODE_TYPES.JSXClosingElement: return `</${stringifyJsx(node.name)}>`;
		case AST_NODE_TYPES.JSXOpeningFragment: return "<>";
		case AST_NODE_TYPES.JSXClosingFragment: return "</>";
	}
}

//#endregion
//#region src/jsx/jsx-attribute-name.ts
/**
* Get the stringified name of a JSX attribute
* @param context The ESLint rule context
* @param node The JSX attribute node
* @returns The name of the attribute
*/
function getJsxAttributeName(context, node) {
	return stringifyJsx(node.name);
}

//#endregion
//#region src/jsx/jsx-attribute.ts
/**
* Creates a helper function to find a specific JSX attribute by name
* Handles direct attributes and spread attributes (variables or object literals)
* @param context The ESLint rule context
* @param node The JSX element node
* @param initialScope (Optional) The initial scope to use for variable resolution
*/
function getJsxAttribute(context, node, initialScope) {
	const scope = initialScope ?? context.sourceCode.getScope(node);
	const attributes = node.openingElement.attributes;
	/**
	* Finds the last occurrence of a specific attribute
	* @param name The attribute name to search for
	*/
	return (name) => {
		return attributes.findLast((attr) => {
			if (attr.type === AST_NODE_TYPES.JSXAttribute) return getJsxAttributeName(context, attr) === name;
			switch (attr.argument.type) {
				case AST_NODE_TYPES.Identifier: {
					const variableNode = getVariableDefinitionNode(findVariable(attr.argument.name, scope), 0);
					if (variableNode?.type === AST_NODE_TYPES.ObjectExpression) return findProperty(name, variableNode.properties, scope) != null;
					return false;
				}
				case AST_NODE_TYPES.ObjectExpression: return findProperty(name, attr.argument.properties, scope) != null;
			}
			return false;
		});
	};
}

//#endregion
//#region src/jsx/jsx-attribute-value.ts
/**
* Resolve the static value of a JSX attribute or spread attribute
*
* @param context - The ESLint rule context
* @param attribute - The JSX attribute node to resolve
* @returns An object containing the value kind, the node (if applicable), and a `toStatic` helper
*/
function resolveJsxAttributeValue(context, attribute) {
	const initialScope = context.sourceCode.getScope(attribute);
	/**
	* Handles standard JSX attributes (e.g., prop="value", prop={value}, prop)
	* @param node The JSX attribute node
	*/
	function handleJsxAttribute(node) {
		if (node.value == null) return {
			kind: "boolean",
			toStatic() {
				return true;
			}
		};
		switch (node.value.type) {
			case AST_NODE_TYPES.Literal: {
				const staticValue = node.value.value;
				return {
					kind: "literal",
					node: node.value,
					toStatic() {
						return staticValue;
					}
				};
			}
			case AST_NODE_TYPES.JSXExpressionContainer: {
				const expr = node.value.expression;
				return {
					kind: "expression",
					node: expr,
					toStatic() {
						return getStaticValue(expr, initialScope)?.value;
					}
				};
			}
			case AST_NODE_TYPES.JSXElement: return {
				kind: "element",
				node: node.value,
				toStatic() {
					return unit;
				}
			};
			case AST_NODE_TYPES.JSXSpreadChild: return {
				kind: "spreadChild",
				node: node.value.expression,
				toStatic() {
					return unit;
				}
			};
		}
	}
	/**
	* Handles JSX spread attributes (e.g., {...props})
	* @param node The JSX spread attribute node
	*/
	function handleJsxSpreadAttribute(node) {
		return {
			kind: "spreadProps",
			node: node.argument,
			toStatic(name) {
				if (name == null) return unit;
				return match(getStaticValue(node.argument, initialScope)?.value).with({ [name]: P.select(P.any) }, identity).otherwise(() => unit);
			}
		};
	}
	switch (attribute.type) {
		case AST_NODE_TYPES.JSXAttribute: return handleJsxAttribute(attribute);
		case AST_NODE_TYPES.JSXSpreadAttribute: return handleJsxSpreadAttribute(attribute);
	}
}

//#endregion
//#region src/jsx/jsx-config.ts
const JsxEmit = {
	None: 0,
	Preserve: 1,
	React: 2,
	ReactNative: 3,
	ReactJSX: 4,
	ReactJSXDev: 5
};
/**
* Get JsxConfig from the rule context by reading compiler options
* @param context The RuleContext
* @returns JsxConfig derived from compiler options
*/
function getJsxConfigFromContext(context) {
	const options = context.sourceCode.parserServices?.program?.getCompilerOptions() ?? {};
	return {
		jsx: options.jsx ?? JsxEmit.ReactJSX,
		jsxFactory: options.jsxFactory ?? "React.createElement",
		jsxFragmentFactory: options.jsxFragmentFactory ?? "React.Fragment",
		jsxImportSource: options.jsxImportSource ?? "react"
	};
}
const cache = /* @__PURE__ */ new WeakMap();
/**
* Get JsxConfig from pragma comments (annotations) in the source code
* @param context The RuleContext
* @returns JsxConfig derived from pragma comments
*/
function getJsxConfigFromAnnotation(context) {
	return getOrElseUpdate(cache, context.sourceCode, () => {
		const options = {};
		if (!context.sourceCode.text.includes("@jsx")) return options;
		let jsx, jsxFrag, jsxRuntime, jsxImportSource;
		for (const comment of context.sourceCode.getAllComments().reverse()) {
			const value = comment.value;
			jsx ??= value.match(RE_ANNOTATION_JSX)?.[1];
			jsxFrag ??= value.match(RE_ANNOTATION_JSX_FRAG)?.[1];
			jsxRuntime ??= value.match(RE_ANNOTATION_JSX_RUNTIME)?.[1];
			jsxImportSource ??= value.match(RE_ANNOTATION_JSX_IMPORT_SOURCE)?.[1];
		}
		if (jsx != null) options.jsxFactory = jsx;
		if (jsxFrag != null) options.jsxFragmentFactory = jsxFrag;
		if (jsxRuntime != null) options.jsx = jsxRuntime === "classic" ? JsxEmit.React : JsxEmit.ReactJSX;
		if (jsxImportSource != null) options.jsxImportSource = jsxImportSource;
		return options;
	});
}

//#endregion
//#region src/jsx/jsx-detection.ts
const JsxDetectionHint = {
	None: 0n,
	DoNotIncludeJsxWithNullValue: 1n << 0n,
	DoNotIncludeJsxWithNumberValue: 1n << 1n,
	DoNotIncludeJsxWithBigIntValue: 1n << 2n,
	DoNotIncludeJsxWithStringValue: 1n << 3n,
	DoNotIncludeJsxWithBooleanValue: 1n << 4n,
	DoNotIncludeJsxWithUndefinedValue: 1n << 5n,
	DoNotIncludeJsxWithEmptyArrayValue: 1n << 6n,
	DoNotIncludeJsxWithCreateElementValue: 1n << 7n,
	RequireAllArrayElementsToBeJsx: 1n << 8n,
	RequireBothSidesOfLogicalExpressionToBeJsx: 1n << 9n,
	RequireBothBranchesOfConditionalExpressionToBeJsx: 1n << 10n
};
/**
* Default JSX detection configuration
* Skips undefined and boolean literals (common in React)
*/
const DEFAULT_JSX_DETECTION_HINT = 0n | JsxDetectionHint.DoNotIncludeJsxWithNumberValue | JsxDetectionHint.DoNotIncludeJsxWithBigIntValue | JsxDetectionHint.DoNotIncludeJsxWithBooleanValue | JsxDetectionHint.DoNotIncludeJsxWithStringValue | JsxDetectionHint.DoNotIncludeJsxWithUndefinedValue;
/**
* Check if a node is a `JSXText` or a `Literal` node
* @param node The AST node to check
* @returns `true` if the node is a `JSXText` or a `Literal` node
*/
function isJsxText(node) {
	if (node == null) return false;
	return node.type === AST_NODE_TYPES.JSXText || node.type === AST_NODE_TYPES.Literal;
}
/**
* Determine if a node represents JSX-like content based on heuristics
* Supports configuration through hint flags to customize detection behavior
*
* @param code The source code with scope lookup capability
* @param code.getScope The function to get the scope of a node
* @param node The AST node to analyze
* @param hint The configuration flags to adjust detection behavior
* @returns boolean Whether the node is considered JSX-like
*/
function isJsxLike(code, node, hint = DEFAULT_JSX_DETECTION_HINT) {
	if (node == null) return false;
	if (ast.isJSX(node)) return true;
	switch (node.type) {
		case AST_NODE_TYPES.Literal:
			switch (typeof node.value) {
				case "boolean": return !(hint & JsxDetectionHint.DoNotIncludeJsxWithBooleanValue);
				case "string": return !(hint & JsxDetectionHint.DoNotIncludeJsxWithStringValue);
				case "number": return !(hint & JsxDetectionHint.DoNotIncludeJsxWithNumberValue);
				case "bigint": return !(hint & JsxDetectionHint.DoNotIncludeJsxWithBigIntValue);
			}
			if (node.value == null) return !(hint & JsxDetectionHint.DoNotIncludeJsxWithNullValue);
			return false;
		case AST_NODE_TYPES.TemplateLiteral: return !(hint & JsxDetectionHint.DoNotIncludeJsxWithStringValue);
		case AST_NODE_TYPES.ArrayExpression:
			if (node.elements.length === 0) return !(hint & JsxDetectionHint.DoNotIncludeJsxWithEmptyArrayValue);
			if (hint & JsxDetectionHint.RequireAllArrayElementsToBeJsx) return node.elements.every((n) => isJsxLike(code, n, hint));
			return node.elements.some((n) => isJsxLike(code, n, hint));
		case AST_NODE_TYPES.LogicalExpression:
			if (hint & JsxDetectionHint.RequireBothSidesOfLogicalExpressionToBeJsx) return isJsxLike(code, node.left, hint) && isJsxLike(code, node.right, hint);
			return isJsxLike(code, node.left, hint) || isJsxLike(code, node.right, hint);
		case AST_NODE_TYPES.ConditionalExpression: {
			function leftHasJSX(node) {
				if (Array.isArray(node.consequent)) {
					if (node.consequent.length === 0) return !(hint & JsxDetectionHint.DoNotIncludeJsxWithEmptyArrayValue);
					if (hint & JsxDetectionHint.RequireAllArrayElementsToBeJsx) return node.consequent.every((n) => isJsxLike(code, n, hint));
					return node.consequent.some((n) => isJsxLike(code, n, hint));
				}
				return isJsxLike(code, node.consequent, hint);
			}
			function rightHasJSX(node) {
				return isJsxLike(code, node.alternate, hint);
			}
			if (hint & JsxDetectionHint.RequireBothBranchesOfConditionalExpressionToBeJsx) return leftHasJSX(node) && rightHasJSX(node);
			return leftHasJSX(node) || rightHasJSX(node);
		}
		case AST_NODE_TYPES.SequenceExpression: return isJsxLike(code, node.expressions.at(-1), hint);
		case AST_NODE_TYPES.CallExpression:
			if (hint & JsxDetectionHint.DoNotIncludeJsxWithCreateElementValue) return false;
			switch (node.callee.type) {
				case AST_NODE_TYPES.Identifier: return node.callee.name === "createElement";
				case AST_NODE_TYPES.MemberExpression: return node.callee.property.type === AST_NODE_TYPES.Identifier && node.callee.property.name === "createElement";
			}
			return false;
		case AST_NODE_TYPES.Identifier: {
			const { name } = node;
			if (name === "undefined") return !(hint & JsxDetectionHint.DoNotIncludeJsxWithUndefinedValue);
			if (ast.isJSXTagNameExpression(node)) return true;
			return isJsxLike(code, getVariableDefinitionNode(findVariable(name, code.getScope(node)), 0), hint);
		}
	}
	return false;
}

//#endregion
//#region src/jsx/jsx-element-type.ts
/**
* Extracts the element type name from a JSX element or fragment
* For JSX elements, returns the stringified name (e.g., "div", "Button", "React.Fragment")
* For JSX fragments, returns an empty string
*
* @param context ESLint rule context
* @param node JSX element or fragment node
* @returns String representation of the element type
*/
function getJsxElementType(context, node) {
	if (node.type === AST_NODE_TYPES.JSXFragment) return "";
	return stringifyJsx(node.openingElement.name);
}

//#endregion
//#region src/jsx/jsx-element-is.ts
/**
* Determine if a JSX element is a host element
* Host elements in React start with lowercase letters (e.g., div, span)
*
* @param context ESLint rule context
* @param node AST node to check
* @returns boolean indicating if the element is a host element
*/
function isJsxHostElement(context, node) {
	return node.type === AST_NODE_TYPES.JSXElement && node.openingElement.name.type === AST_NODE_TYPES.JSXIdentifier && /^[a-z]/u.test(node.openingElement.name.name);
}
/**
* Determine if a JSX element is a React Fragment
* Fragments can be imported from React and used like <Fragment> or <React.Fragment>
*
* @param context ESLint rule context
* @param node AST node to check
* @param jsxConfig Optional JSX configuration
* @param jsxConfig.jsxFragmentFactory Name of the fragment factory (e.g., React.Fragment)
* @returns boolean indicating if the element is a Fragment
*/
function isJsxFragmentElement(context, node, jsxConfig) {
	if (node.type !== AST_NODE_TYPES.JSXElement) return false;
	const fragment = jsxConfig?.jsxFragmentFactory?.split(".").at(-1) ?? "Fragment";
	return getJsxElementType(context, node).split(".").at(-1) === fragment;
}

//#endregion
//#region src/jsx/jsx-hierarchy.ts
/**
* Traverses up the AST to find a parent JSX attribute node that matches a given test
*
* @param node The starting AST node
* @param test Optional predicate function to test if the attribute meets criteria
*               Defaults to always returning true (matches any attribute)
* @returns The first matching JSX attribute node found when traversing upwards, or undefined
*/
function findParentJsxAttribute(node, test = constTrue) {
	const guard = (node) => {
		return node.type === AST_NODE_TYPES.JSXAttribute && test(node);
	};
	return ast.findParentNode(node, guard);
}

//#endregion
//#region src/component/component-detection-hint.ts
/**
* Hints for component collector
*/
const ComponentDetectionHint = {
	...JsxDetectionHint,
	DoNotIncludeFunctionDefinedOnObjectMethod: 1n << 64n,
	DoNotIncludeFunctionDefinedOnClassMethod: 1n << 65n,
	DoNotIncludeFunctionDefinedOnClassProperty: 1n << 66n,
	DoNotIncludeFunctionDefinedInArrayPattern: 1n << 67n,
	DoNotIncludeFunctionDefinedInArrayExpression: 1n << 68n,
	DoNotIncludeFunctionDefinedAsArrayMapCallback: 1n << 69n,
	DoNotIncludeFunctionDefinedAsArrayFlatMapCallback: 1n << 70n
};
/**
* Default component detection hint
*/
const DEFAULT_COMPONENT_DETECTION_HINT = 0n | ComponentDetectionHint.DoNotIncludeJsxWithBigIntValue | ComponentDetectionHint.DoNotIncludeJsxWithBooleanValue | ComponentDetectionHint.DoNotIncludeJsxWithNumberValue | ComponentDetectionHint.DoNotIncludeJsxWithStringValue | ComponentDetectionHint.DoNotIncludeJsxWithUndefinedValue | ComponentDetectionHint.DoNotIncludeFunctionDefinedAsArrayFlatMapCallback | ComponentDetectionHint.DoNotIncludeFunctionDefinedAsArrayMapCallback | ComponentDetectionHint.DoNotIncludeFunctionDefinedInArrayExpression | ComponentDetectionHint.DoNotIncludeFunctionDefinedInArrayPattern | ComponentDetectionHint.RequireAllArrayElementsToBeJsx | ComponentDetectionHint.RequireBothBranchesOfConditionalExpressionToBeJsx | ComponentDetectionHint.RequireBothSidesOfLogicalExpressionToBeJsx;

//#endregion
//#region src/component/component-is.ts
/**
* Check if a node is a React class component
* @param node The AST node to check
* @returns `true` if the node is a class component, `false` otherwise
*/
function isClassComponent(node) {
	if ("superClass" in node && node.superClass != null) {
		const re = /^(?:Pure)?Component$/u;
		switch (true) {
			case node.superClass.type === AST_NODE_TYPES.Identifier: return re.test(node.superClass.name);
			case node.superClass.type === AST_NODE_TYPES.MemberExpression && node.superClass.property.type === AST_NODE_TYPES.Identifier: return re.test(node.superClass.property.name);
		}
	}
	return false;
}
/**
* Check if a node is a React PureComponent
* @param node The AST node to check
* @returns `true` if the node is a PureComponent, `false` otherwise
*/
function isPureComponent(node) {
	if ("superClass" in node && node.superClass != null) {
		const re = /^PureComponent$/u;
		switch (true) {
			case node.superClass.type === AST_NODE_TYPES.Identifier: return re.test(node.superClass.name);
			case node.superClass.type === AST_NODE_TYPES.MemberExpression && node.superClass.property.type === AST_NODE_TYPES.Identifier: return re.test(node.superClass.property.name);
		}
	}
	return false;
}

//#endregion
//#region src/component/component-wrapper.ts
/**
* Check if the node is a call expression for a component wrapper
* @param context The ESLint rule context
* @param node The node to check
* @returns `true` if the node is a call expression for a component wrapper
*/
function isComponentWrapperCall(context, node) {
	if (node.type !== AST_NODE_TYPES.CallExpression) return false;
	return isMemoCall(context, node) || isForwardRefCall(context, node);
}
/**
* Check if the node is a call expression for a component wrapper loosely
* @param context The ESLint rule context
* @param node The node to check
* @returns `true` if the node is a call expression for a component wrapper loosely
*/
function isComponentWrapperCallLoose(context, node) {
	if (node.type !== AST_NODE_TYPES.CallExpression) return false;
	return isComponentWrapperCall(context, node) || isUseCallbackCall(node);
}
/**
* Check if the node is a callback function passed to a component wrapper
* @param context The ESLint rule context
* @param node The node to check
* @returns `true` if the node is a callback function passed to a component wrapper
*/
function isComponentWrapperCallback(context, node) {
	if (!ast.isFunction(node)) return false;
	const parent = node.parent;
	if (parent.type !== AST_NODE_TYPES.CallExpression) return false;
	return isComponentWrapperCall(context, parent);
}
/**
* Check if the node is a callback function passed to a component wrapper loosely
* @param context The ESLint rule context
* @param node The node to check
* @returns `true` if the node is a callback function passed to a component wrapper loosely
*/
function isComponentWrapperCallbackLoose(context, node) {
	if (!ast.isFunction(node)) return false;
	const parent = node.parent;
	if (parent.type !== AST_NODE_TYPES.CallExpression) return false;
	return isComponentWrapperCallLoose(context, parent);
}

//#endregion
//#region src/component/component-id.ts
/**
* Get function component identifier from `const Component = memo(() => {});`
* @param context The rule context
* @param node The function node to analyze
* @returns The function identifier or `unit` if not found
*/
function getFunctionComponentId(context, node) {
	const functionId = ast.getFunctionId(node);
	if (functionId != null) return functionId;
	const { parent } = node;
	if (parent.type === AST_NODE_TYPES.CallExpression && isComponentWrapperCallLoose(context, parent) && parent.parent.type === AST_NODE_TYPES.VariableDeclarator) return parent.parent.id;
	if (parent.type === AST_NODE_TYPES.CallExpression && isComponentWrapperCallLoose(context, parent) && parent.parent.type === AST_NODE_TYPES.CallExpression && isComponentWrapperCallLoose(context, parent.parent) && parent.parent.parent.type === AST_NODE_TYPES.VariableDeclarator) return parent.parent.parent.id;
	return unit;
}

//#endregion
//#region src/component/component-name.ts
/**
* Check if a string matches the strict component name pattern
* @param name The name to check
*/
function isComponentName(name) {
	return RE_COMPONENT_NAME.test(name);
}
/**
* Check if a string matches the loose component name pattern
* @param name The name to check
*/
function isComponentNameLoose(name) {
	return RE_COMPONENT_NAME_LOOSE.test(name);
}
/**
* Check if a function has a loose component name
* @param context The rule context
* @param fn The function to check
* @param allowNone Whether to allow no name
* @returns Whether the function has a loose component name
*/
function isFunctionWithLooseComponentName(context, fn, allowNone = false) {
	const id = getFunctionComponentId(context, fn);
	if (id == null) return allowNone;
	if (id.type === AST_NODE_TYPES.Identifier) return isComponentNameLoose(id.name);
	if (id.type === AST_NODE_TYPES.MemberExpression && id.property.type === AST_NODE_TYPES.Identifier) return isComponentNameLoose(id.property.name);
	return false;
}

//#endregion
//#region src/component/component-render-method.ts
/**
* Check whether given node is a render method of a class component
* @example
* ```tsx
* class Component extends React.Component {
*   renderHeader = () => <div />;
*   renderFooter = () => <div />;
* }
* ```
* @param node The AST node to check
* @returns `true` if node is a render function, `false` if not
*/
function isRenderMethodLike(node) {
	return ast.isMethodOrProperty(node) && node.key.type === AST_NODE_TYPES.Identifier && node.key.name.startsWith("render") && node.parent.parent.type === AST_NODE_TYPES.ClassDeclaration;
}

//#endregion
//#region src/component/component-definition.ts
/**
* Check if the given node is a function within a render method of a class component.
*
* @param node The AST node to check
* @returns `true` if the node is a render function inside a class component
*
* @example
* ```tsx
* class Component extends React.Component {
*   renderHeader = () => <div />; // Returns true
* }
* ```
*/
function isRenderMethodCallback(node) {
	const parent = node.parent;
	const greatGrandparent = parent.parent?.parent;
	return greatGrandparent != null && isRenderMethodLike(parent) && isClassComponent(greatGrandparent);
}
/**
* Check if a function node should be excluded based on provided detection hints
*
* @param node The function node to check
* @param hint Component detection hints as bit flags
* @returns `true` if the function matches an exclusion hint
*/
function shouldExcludeBasedOnHint(node, hint) {
	switch (true) {
		case hint & ComponentDetectionHint.DoNotIncludeFunctionDefinedOnObjectMethod && ast.isOneOf([AST_NODE_TYPES.ArrowFunctionExpression, AST_NODE_TYPES.FunctionExpression])(node) && node.parent.type === AST_NODE_TYPES.Property && node.parent.parent.type === AST_NODE_TYPES.ObjectExpression: return true;
		case hint & ComponentDetectionHint.DoNotIncludeFunctionDefinedOnClassMethod && ast.isOneOf([AST_NODE_TYPES.ArrowFunctionExpression, AST_NODE_TYPES.FunctionExpression])(node) && node.parent.type === AST_NODE_TYPES.MethodDefinition: return true;
		case hint & ComponentDetectionHint.DoNotIncludeFunctionDefinedOnClassProperty && ast.isOneOf([AST_NODE_TYPES.ArrowFunctionExpression, AST_NODE_TYPES.FunctionExpression])(node) && node.parent.type === AST_NODE_TYPES.Property: return true;
		case hint & ComponentDetectionHint.DoNotIncludeFunctionDefinedInArrayPattern && node.parent.type === AST_NODE_TYPES.ArrayPattern: return true;
		case hint & ComponentDetectionHint.DoNotIncludeFunctionDefinedInArrayExpression && node.parent.type === AST_NODE_TYPES.ArrayExpression: return true;
		case hint & ComponentDetectionHint.DoNotIncludeFunctionDefinedAsArrayMapCallback && node.parent.type === AST_NODE_TYPES.CallExpression && node.parent.callee.type === AST_NODE_TYPES.MemberExpression && node.parent.callee.property.type === AST_NODE_TYPES.Identifier && node.parent.callee.property.name === "map": return true;
		case hint & ComponentDetectionHint.DoNotIncludeFunctionDefinedAsArrayFlatMapCallback && node.parent.type === AST_NODE_TYPES.CallExpression && node.parent.callee.type === AST_NODE_TYPES.MemberExpression && node.parent.callee.property.type === AST_NODE_TYPES.Identifier && node.parent.callee.property.name === "flatMap": return true;
	}
	return false;
}
/**
* Determine if the node is an argument within `createElement`'s children list (3rd argument onwards)
*
* @param context The rule context
* @param node The AST node to check
* @returns `true` if the node is passed as a child to `createElement`
*/
function isChildrenOfCreateElement(context, node) {
	const parent = node.parent;
	if (parent?.type !== AST_NODE_TYPES.CallExpression) return false;
	if (!isCreateElementCall(context, parent)) return false;
	return parent.arguments.slice(2).some((arg) => arg === node);
}
/**
* Determine if a function node represents a valid React component definition
*
* @param context The rule context
* @param node The function node to analyze
* @param hint Component detection hints (bit flags) to customize detection logic
* @returns `true` if the node is considered a component definition
*/
function isComponentDefinition(context, node, hint) {
	if (!isFunctionWithLooseComponentName(context, node, true)) return false;
	if (isChildrenOfCreateElement(context, node) || isRenderMethodCallback(node)) return false;
	if (shouldExcludeBasedOnHint(node, hint)) return false;
	const significantParent = ast.findParentNode(node, ast.isOneOf([
		AST_NODE_TYPES.JSXExpressionContainer,
		AST_NODE_TYPES.ArrowFunctionExpression,
		AST_NODE_TYPES.FunctionExpression,
		AST_NODE_TYPES.Property,
		AST_NODE_TYPES.ClassBody
	]));
	if (significantParent == null) return true;
	if (significantParent.type === AST_NODE_TYPES.JSXExpressionContainer) return false;
	return true;
}

//#endregion
//#region src/component/component-flag.ts
/**
* Component flag constants
*/
const ComponentFlag = {
	None: 0n,
	PureComponent: 1n << 0n,
	CreateElement: 1n << 1n,
	Memo: 1n << 2n,
	ForwardRef: 1n << 3n
};

//#endregion
//#region src/component/component-init-path.ts
/**
* Get component flag from init path
* @param initPath The init path of the function component
* @returns The component flag
*/
function getComponentFlagFromInitPath(initPath) {
	let flag = ComponentFlag.None;
	if (initPath != null && ast.hasCallInFunctionInitPath("memo", initPath)) flag |= ComponentFlag.Memo;
	if (initPath != null && ast.hasCallInFunctionInitPath("forwardRef", initPath)) flag |= ComponentFlag.ForwardRef;
	return flag;
}

//#endregion
//#region src/component/component-collector.ts
const idGen$1 = new IdGenerator("function_component_");
/**
* Get a ctx and visitor object for the rule to collect function components
* @param context The ESLint rule context
* @param options The options to use
* @returns The ctx and visitor of the collector
*/
function useComponentCollector(context, options = {}) {
	const { collectDisplayName = false, hint = DEFAULT_COMPONENT_DETECTION_HINT } = options;
	const functionEntries = [];
	const components = /* @__PURE__ */ new Map();
	const getText = (n) => context.sourceCode.getText(n);
	const getCurrentEntry = () => functionEntries.at(-1);
	const onFunctionEnter = (node) => {
		const key = idGen$1.next();
		const exp = ast.findParentNode(node, (n) => n.type === AST_NODE_TYPES.ExportDefaultDeclaration);
		const isExportDefault = exp != null;
		const isExportDefaultDeclaration = exp != null && ast.getUnderlyingExpression(exp.declaration) === node;
		const id = getFunctionComponentId(context, node);
		const name = id == null ? unit : ast.getFullyQualifiedName(id, getText);
		const initPath = ast.getFunctionInitPath(node);
		const directives = ast.getFunctionDirectives(node);
		const entry = {
			id: getFunctionComponentId(context, node),
			key,
			kind: "function-component",
			name,
			node,
			directives,
			displayName: unit,
			flag: getComponentFlagFromInitPath(initPath),
			hint,
			hookCalls: [],
			initPath,
			isComponentDefinition: isComponentDefinition(context, node, hint),
			isExportDefault,
			isExportDefaultDeclaration,
			rets: []
		};
		functionEntries.push(entry);
		if (!entry.isComponentDefinition || !isFunctionWithLooseComponentName(context, node, false)) return;
		if (directives.some((d) => d.directive === "use memo" || d.directive === "use no memo")) components.set(entry.key, entry);
	};
	const onFunctionExit = () => {
		return functionEntries.pop();
	};
	return {
		ctx: {
			getAllComponents(node) {
				return [...components.values()];
			},
			getCurrentEntries() {
				return [...functionEntries];
			},
			getCurrentEntry
		},
		visitor: {
			":function": onFunctionEnter,
			":function:exit": onFunctionExit,
			"ArrowFunctionExpression[body.type!='BlockStatement']"() {
				const entry = getCurrentEntry();
				if (entry == null) return;
				const { body } = entry.node;
				if (body.type === AST_NODE_TYPES.BlockStatement) return;
				entry.rets.push(body);
				if (!entry.isComponentDefinition) return;
				if (!components.has(entry.key) && !isJsxLike(context.sourceCode, body, hint)) return;
				components.set(entry.key, entry);
			},
			...collectDisplayName ? { [ast.SEL_DISPLAY_NAME_ASSIGNMENT_EXPRESSION](node) {
				const { left, right } = node;
				if (left.type !== AST_NODE_TYPES.MemberExpression) return;
				const componentName = left.object.type === AST_NODE_TYPES.Identifier ? left.object.name : unit;
				const component = [...components.values()].findLast(({ name }) => name != null && name === componentName);
				if (component == null) return;
				component.displayName = right;
			} } : {},
			CallExpression(node) {
				if (!isHookCall(node)) return;
				const entry = getCurrentEntry();
				if (entry == null) return;
				entry.hookCalls.push(node);
				if (!entry.isComponentDefinition) return;
				components.set(entry.key, entry);
			},
			ReturnStatement(node) {
				const entry = getCurrentEntry();
				if (entry == null) return;
				entry.rets.push(node.argument);
				if (!entry.isComponentDefinition) return;
				const { argument } = node;
				if (!components.has(entry.key) && !isJsxLike(context.sourceCode, argument, hint)) return;
				components.set(entry.key, entry);
			}
		}
	};
}

//#endregion
//#region src/component/component-collector-legacy.ts
const idGen = new IdGenerator("class_component_");
/**
* Get a ctx and visitor object for the rule to collect class componentss
* @param context The ESLint rule context
* @returns The ctx and visitor of the collector
*/
function useComponentCollectorLegacy(context) {
	const components = /* @__PURE__ */ new Map();
	const ctx = { getAllComponents(node) {
		return [...components.values()];
	} };
	const getText = (n) => context.sourceCode.getText(n);
	const collect = (node) => {
		if (!isClassComponent(node)) return;
		const id = ast.getClassId(node);
		const key = idGen.next();
		const name = id == null ? unit : ast.getFullyQualifiedName(id, getText);
		const flag = isPureComponent(node) ? ComponentFlag.PureComponent : ComponentFlag.None;
		components.set(key, {
			id,
			key,
			kind: "class-component",
			name,
			node,
			displayName: unit,
			flag,
			hint: 0n,
			methods: []
		});
	};
	return {
		ctx,
		visitor: {
			ClassDeclaration: collect,
			ClassExpression: collect
		}
	};
}
/**
* Check whether the given node is a this.setState() call
* @param node The node to check
* @internal
*/
function isThisSetState(node) {
	const { callee } = node;
	return callee.type === AST_NODE_TYPES$1.MemberExpression && ast.isThisExpressionLoose(callee.object) && callee.property.type === AST_NODE_TYPES$1.Identifier && callee.property.name === "setState";
}
/**
* Check whether the given node is an assignment to this.state
* @param node The node to check
* @internal
*/
function isAssignmentToThisState(node) {
	const { left } = node;
	return left.type === AST_NODE_TYPES$1.MemberExpression && ast.isThisExpressionLoose(left.object) && ast.getPropertyName(left.property) === "state";
}

//#endregion
//#region src/component/component-method-is.ts
/**
* Create a lifecycle method checker function
* @param methodName The lifecycle method name
* @param isStatic Whether the method is static
*/
function createLifecycleChecker(methodName, isStatic = false) {
	return (node) => ast.isMethodOrProperty(node) && node.static === isStatic && node.key.type === AST_NODE_TYPES.Identifier && node.key.name === methodName;
}
const isRender = createLifecycleChecker("render");
const isComponentDidCatch = createLifecycleChecker("componentDidCatch");
const isComponentDidMount = createLifecycleChecker("componentDidMount");
const isComponentDidUpdate = createLifecycleChecker("componentDidUpdate");
const isComponentWillMount = createLifecycleChecker("componentWillMount");
const isComponentWillReceiveProps = createLifecycleChecker("componentWillReceiveProps");
const isComponentWillUnmount = createLifecycleChecker("componentWillUnmount");
const isComponentWillUpdate = createLifecycleChecker("componentWillUpdate");
const isGetChildContext = createLifecycleChecker("getChildContext");
const isGetInitialState = createLifecycleChecker("getInitialState");
const isGetSnapshotBeforeUpdate = createLifecycleChecker("getSnapshotBeforeUpdate");
const isShouldComponentUpdate = createLifecycleChecker("shouldComponentUpdate");
const isUnsafeComponentWillMount = createLifecycleChecker("UNSAFE_componentWillMount");
const isUnsafeComponentWillReceiveProps = createLifecycleChecker("UNSAFE_componentWillReceiveProps");
const isUnsafeComponentWillUpdate = createLifecycleChecker("UNSAFE_componentWillUpdate");
const isGetDefaultProps = createLifecycleChecker("getDefaultProps", true);
const isGetDerivedStateFromProps = createLifecycleChecker("getDerivedStateFromProps", true);
const isGetDerivedStateFromError = createLifecycleChecker("getDerivedStateFromError", true);

//#endregion
//#region src/component/component-method-callback.ts
/**
* Check if the given node is a componentDidMount callback
* @param node The node to check
* @returns True if the node is a componentDidMount callback, false otherwise
*/
function isComponentDidMountCallback(node) {
	return ast.isFunction(node) && isComponentDidMount(node.parent) && node.parent.value === node;
}
/**
* Check if the given node is a componentWillUnmount callback
* @param node The node to check
* @returns True if the node is a componentWillUnmount callback, false otherwise
*/
function isComponentWillUnmountCallback(node) {
	return ast.isFunction(node) && isComponentWillUnmount(node.parent) && node.parent.value === node;
}

//#endregion
//#region src/component/component-render-prop.ts
/**
* Unsafe check whether given node is a render function
* ```tsx
* const renderRow = () => <div />
* `                 ^^^^^^^^^^^^`
* _ = <Component renderRow={() => <div />} />
* `                         ^^^^^^^^^^^^^   `
* ```
* @param context The rule context
* @param node The AST node to check
* @returns `true` if node is a render function, `false` if not
*/
function isRenderFunctionLoose(context, node) {
	if (!ast.isFunction(node)) return false;
	const id = ast.getFunctionId(node);
	switch (true) {
		case id?.type === AST_NODE_TYPES.Identifier: return id.name.startsWith("render");
		case id?.type === AST_NODE_TYPES.MemberExpression && id.property.type === AST_NODE_TYPES.Identifier: return id.property.name.startsWith("render");
		case node.parent.type === AST_NODE_TYPES.JSXExpressionContainer && node.parent.parent.type === AST_NODE_TYPES.JSXAttribute && node.parent.parent.name.type === AST_NODE_TYPES.JSXIdentifier: return node.parent.parent.name.name.startsWith("render");
	}
	return false;
}
/**
* Unsafe check whether given JSXAttribute is a render prop
* ```tsx
* _ = <Component renderRow={() => <div />} />
* `              ^^^^^^^^^^^^^^^^^^^^^^^^^  `
* ```
* @param context The rule context
* @param node The AST node to check
* @returns `true` if node is a render prop, `false` if not
*/
function isRenderPropLoose(context, node) {
	if (node.name.type !== AST_NODE_TYPES.JSXIdentifier) return false;
	return node.name.name.startsWith("render") && node.value?.type === AST_NODE_TYPES.JSXExpressionContainer && isRenderFunctionLoose(context, node.value.expression);
}
/**
* Unsafe check whether given node is declared directly inside a render property
* ```tsx
* const rows = { render: () => <div /> }
* `                      ^^^^^^^^^^^^^ `
* _ = <Component rows={ [{ render: () => <div /> }] } />
* `                                ^^^^^^^^^^^^^       `
*  ```
* @internal
* @param node The AST node to check
* @returns `true` if component is declared inside a render property, `false` if not
*/
function isDirectValueOfRenderPropertyLoose(node) {
	const matching = (node) => {
		return node.type === AST_NODE_TYPES.Property && node.key.type === AST_NODE_TYPES.Identifier && node.key.name.startsWith("render");
	};
	return matching(node) || node.parent != null && matching(node.parent);
}
/**
* Unsafe check whether given node is declared inside a render prop
* ```tsx
* _ = <Component renderRow={"node"} />
* `                         ^^^^^^   `
* _ = <Component rows={ [{ render: "node" }] } />
* `                                ^^^^^^       `
* ```
* @param node The AST node to check
* @returns `true` if component is declared inside a render prop, `false` if not
*/
function isDeclaredInRenderPropLoose(node) {
	if (isDirectValueOfRenderPropertyLoose(node)) return true;
	const parent = ast.findParentNode(node, ast.is(AST_NODE_TYPES.JSXExpressionContainer))?.parent;
	if (parent?.type !== AST_NODE_TYPES.JSXAttribute) return false;
	return parent.name.type === AST_NODE_TYPES.JSXIdentifier && parent.name.name.startsWith("render");
}

//#endregion
//#region src/hierarchy/find-enclosing-component-or-hook.ts
/**
* Find the enclosing React component or hook for a given AST node
* @param node The AST node to start the search from
* @param test Optional test function to customize component or hook identification
* @returns The enclosing component or hook node, or `null` if none is ASAST.
*/
function findEnclosingComponentOrHook(node, test = (n, name) => {
	if (name == null) return false;
	return isComponentNameLoose(name) || isHookName(name);
}) {
	const enclosingNode = ast.findParentNode(node, (n) => {
		if (!ast.isFunction(n)) return false;
		return test(n, match(ast.getFunctionId(n)).with({ type: AST_NODE_TYPES.Identifier }, (id) => id.name).with({
			type: AST_NODE_TYPES.MemberExpression,
			property: { type: AST_NODE_TYPES.Identifier }
		}, (me) => me.property.name).otherwise(() => null));
	});
	return ast.isFunction(enclosingNode) ? enclosingNode : unit;
}

//#endregion
//#region src/hierarchy/is-inside-component-or-hook.ts
/**
* Check if a given AST node is inside a React component or hook
* @param node The AST node to check
* @returns True if the node is inside a component or hook, false otherwise
*/
function isInsideComponentOrHook(node) {
	return findEnclosingComponentOrHook(node) != null;
}

//#endregion
//#region src/ref/ref-name.ts
/**
* Check if a given name corresponds to a ref name
* @param name The name to check
* @returns True if the name is "ref" or ends with "Ref"
*/
function isRefName(name) {
	return name === "ref" || name.endsWith("Ref");
}

//#endregion
//#region src/ref/is-from-ref.ts
/**
* Check if the variable with the given name is initialized or derived from a ref
* @param name The variable name
* @param initialScope The initial scope
* @returns True if the variable is derived from a ref, false otherwise
*/
function isInitializedFromRef(name, initialScope) {
	return getRefInit(name, initialScope) != null;
}
/**
* Get the init expression of a ref variable
* @param name The variable name
* @param initialScope The initial scope
* @returns The init expression node if the variable is derived from a ref, or undefined otherwise
*/
function getRefInit(name, initialScope) {
	for (const { node } of findVariable(initialScope)(name)?.defs ?? []) {
		if (node.type !== AST_NODE_TYPES$1.VariableDeclarator) continue;
		const init = node.init;
		if (init == null) continue;
		switch (true) {
			case init.type === AST_NODE_TYPES$1.MemberExpression && init.object.type === AST_NODE_TYPES$1.Identifier && isRefName(init.object.name): return init;
			case init.type === AST_NODE_TYPES$1.CallExpression && isUseRefCall(init): return init;
		}
	}
	return unit;
}

//#endregion
export { ComponentDetectionHint, ComponentFlag, DEFAULT_COMPONENT_DETECTION_HINT, DEFAULT_JSX_DETECTION_HINT, JsxDetectionHint, JsxEmit, REACT_BUILTIN_HOOK_NAMES, findEnclosingComponentOrHook, findParentJsxAttribute, getComponentFlagFromInitPath, getFunctionComponentId, getJsxAttribute, getJsxAttributeName, getJsxConfigFromAnnotation, getJsxConfigFromContext, getJsxElementType, getRefInit, isAssignmentToThisState, isCaptureOwnerStack, isCaptureOwnerStackCall, isChildrenCount, isChildrenCountCall, isChildrenForEach, isChildrenForEachCall, isChildrenMap, isChildrenMapCall, isChildrenOnly, isChildrenOnlyCall, isChildrenToArray, isChildrenToArrayCall, isClassComponent, isCloneElement, isCloneElementCall, isComponentDefinition, isComponentDidCatch, isComponentDidMount, isComponentDidMountCallback, isComponentDidUpdate, isComponentName, isComponentNameLoose, isComponentWillMount, isComponentWillReceiveProps, isComponentWillUnmount, isComponentWillUnmountCallback, isComponentWillUpdate, isComponentWrapperCall, isComponentWrapperCallLoose, isComponentWrapperCallback, isComponentWrapperCallbackLoose, isCreateContext, isCreateContextCall, isCreateElement, isCreateElementCall, isCreateRef, isCreateRefCall, isDeclaredInRenderPropLoose, isDirectValueOfRenderPropertyLoose, isForwardRef, isForwardRefCall, isFunctionWithLooseComponentName, isGetChildContext, isGetDefaultProps, isGetDerivedStateFromError, isGetDerivedStateFromProps, isGetInitialState, isGetSnapshotBeforeUpdate, isHook, isHookCall, isHookCallWithName, isHookId, isHookName, isInitializedFromReact, isInitializedFromReactNative, isInitializedFromRef, isInsideComponentOrHook, isJsxFragmentElement, isJsxHostElement, isJsxLike, isJsxText, isLazy, isLazyCall, isMemo, isMemoCall, isPureComponent, isReactAPI, isReactAPICall, isRefName, isRender, isRenderFunctionLoose, isRenderMethodLike, isRenderPropLoose, isShouldComponentUpdate, isThisSetState, isUnsafeComponentWillMount, isUnsafeComponentWillReceiveProps, isUnsafeComponentWillUpdate, isUseActionStateCall, isUseCall, isUseCallbackCall, isUseContextCall, isUseDebugValueCall, isUseDeferredValueCall, isUseEffectCall, isUseEffectCleanupCallback, isUseEffectLikeCall, isUseEffectSetupCallback, isUseFormStatusCall, isUseIdCall, isUseImperativeHandleCall, isUseInsertionEffectCall, isUseLayoutEffectCall, isUseMemoCall, isUseOptimisticCall, isUseReducerCall, isUseRefCall, isUseStateCall, isUseStateLikeCall, isUseSyncExternalStoreCall, isUseTransitionCall, resolveJsxAttributeValue, stringifyJsx, useComponentCollector, useComponentCollectorLegacy, useHookCollector };