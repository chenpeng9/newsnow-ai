import { DEFAULT_ESLINT_REACT_SETTINGS, WEBSITE_URL, coerceSettings, defineRuleListener, getConfigAdapters, getSettingsFromContext, report, toRegExp } from "@eslint-react/shared";
import { AST_NODE_TYPES } from "@typescript-eslint/types";
import { ESLintUtils } from "@typescript-eslint/utils";
import { P, isMatching, match } from "ts-pattern";
import ts from "typescript";
import * as core from "@eslint-react/core";
import * as ast from "@eslint-react/ast";
import { findEnclosingAssignmentTarget, findVariable, getChildScopes, getObjectType, getVariableDefinitionNode, isAssignmentTargetEqual } from "@eslint-react/var";
import { constFalse, constTrue, flow, getOrElseUpdate, identity, unit } from "@eslint-react/eff";
import { compare } from "compare-versions";
import { getConstrainedTypeAtLocation, isTypeReadonly } from "@typescript-eslint/type-utils";
import { isPropertyReadonlyInType, unionConstituents } from "ts-api-utils";
import { getStaticValue, isIdentifier, isVariableDeclarator } from "@typescript-eslint/utils/ast-utils";
import { getTypeImmutability, isImmutable, isReadonlyDeep, isReadonlyShallow, isUnknown } from "is-immutable-type";

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
	name: () => name$8,
	rules: () => rules$8
});
const name$8 = "react-x/disable-experimental";
const rules$8 = {
	"react-x/jsx-key-before-spread": "off",
	"react-x/jsx-no-iife": "off",
	"react-x/no-duplicate-key": "off",
	"react-x/no-implicit-key": "off",
	"react-x/no-misused-capture-owner-stack": "off",
	"react-x/no-unnecessary-key": "off",
	"react-x/no-unnecessary-use-callback": "off",
	"react-x/no-unnecessary-use-memo": "off",
	"react-x/no-unnecessary-use-ref": "off",
	"react-x/no-unused-props": "off",
	"react-x/prefer-read-only-props": "off"
};

//#endregion
//#region src/configs/disable-type-checked.ts
var disable_type_checked_exports = /* @__PURE__ */ __exportAll({
	name: () => name$7,
	rules: () => rules$7
});
const name$7 = "react-x/disable-type-checked";
const rules$7 = {
	"react-x/no-implicit-key": "off",
	"react-x/no-leaked-conditional-rendering": "off",
	"react-x/no-unused-props": "off",
	"react-x/prefer-read-only-props": "off"
};

//#endregion
//#region package.json
var name$6 = "eslint-plugin-react-x";
var version = "2.13.0";

//#endregion
//#region src/utils/create-rule.ts
function getDocsUrl(ruleName) {
	return `${WEBSITE_URL}/docs/rules/${ruleName}`;
}
const createRule = ESLintUtils.RuleCreator(getDocsUrl);

//#endregion
//#region src/utils/type-is.ts
function isFlagSet(allFlags, flag) {
	return (allFlags & flag) !== 0;
}
function isFlagSetOnObject(obj, flag) {
	return isFlagSet(obj.flags, flag);
}
const isTypeFlagSet = isFlagSetOnObject;
function isBooleanLiteralType(type) {
	return isTypeFlagSet(type, ts.TypeFlags.BooleanLiteral);
}
/** @internal */
const isFalseLiteralType = (type) => isBooleanLiteralType(type) && type.intrinsicName === "false";
/** @internal */
const isTrueLiteralType = (type) => isBooleanLiteralType(type) && type.intrinsicName === "true";
/** @internal */
const isAnyType = (type) => isTypeFlagSet(type, ts.TypeFlags.TypeParameter | ts.TypeFlags.Any);
/** @internal */
const isBigIntType = (type) => isTypeFlagSet(type, ts.TypeFlags.BigIntLike);
/** @internal */
const isBooleanType = (type) => isTypeFlagSet(type, ts.TypeFlags.BooleanLike);
/** @internal */
const isEnumType = (type) => isTypeFlagSet(type, ts.TypeFlags.EnumLike);
/** @internal */
const isFalsyBigIntType = (type) => type.isLiteral() && isMatching({ value: { base10Value: "0" } }, type);
/** @internal */
const isFalsyNumberType = (type) => type.isNumberLiteral() && type.value === 0;
/** @internal */
const isFalsyStringType = (type) => type.isStringLiteral() && type.value === "";
/** @internal */
const isNeverType = (type) => isTypeFlagSet(type, ts.TypeFlags.Never);
/** @internal */
const isNullishType = (type) => isTypeFlagSet(type, ts.TypeFlags.Null | ts.TypeFlags.Undefined | ts.TypeFlags.VoidLike);
/** @internal */
const isNumberType = (type) => isTypeFlagSet(type, ts.TypeFlags.NumberLike);
/** @internal */
const isObjectType = (type) => !isTypeFlagSet(type, ts.TypeFlags.Null | ts.TypeFlags.Undefined | ts.TypeFlags.VoidLike | ts.TypeFlags.BooleanLike | ts.TypeFlags.StringLike | ts.TypeFlags.NumberLike | ts.TypeFlags.BigIntLike | ts.TypeFlags.TypeParameter | ts.TypeFlags.Any | ts.TypeFlags.Unknown | ts.TypeFlags.Never);
/** @internal */
const isStringType = (type) => isTypeFlagSet(type, ts.TypeFlags.StringLike);
/** @internal */
const isTruthyBigIntType = (type) => type.isLiteral() && isMatching({ value: { base10Value: P.not("0") } }, type);
/** @internal */
const isTruthyNumberType = (type) => type.isNumberLiteral() && type.value !== 0;
/** @internal */
const isTruthyStringType = (type) => type.isStringLiteral() && type.value !== "";
/** @internal */
const isUnknownType = (type) => isTypeFlagSet(type, ts.TypeFlags.Unknown);

//#endregion
//#region src/utils/type-name.ts
/**
* An enhanced version of getFullyQualifiedName that handles cases that original function does not handle
* @param checker TypeScript type checker
* @param symbol Symbol to get fully qualified name for
* @returns Fully qualified name of the symbol
*/
function getFullyQualifiedNameEx(checker, symbol) {
	let name = symbol.name;
	let parent = symbol.declarations?.at(0)?.parent;
	if (parent == null) return checker.getFullyQualifiedName(symbol);
	const namespace = parent.getSourceFile().statements.find((n) => ts.isNamespaceExportDeclaration(n));
	while (parent.kind !== ts.SyntaxKind.SourceFile) {
		switch (true) {
			case ts.isInterfaceDeclaration(parent):
			case ts.isTypeAliasDeclaration(parent):
			case ts.isEnumDeclaration(parent):
			case ts.isModuleDeclaration(parent):
			case ts.isNamespaceImport(parent):
			case ts.isNamespaceExport(parent):
			case ts.isNamespaceExportDeclaration(parent):
				name = `${parent.name.text}.${name}`;
				break;
			case ts.isPropertySignature(parent) && ts.isIdentifier(parent.name):
			case ts.isPropertyDeclaration(parent) && ts.isIdentifier(parent.name):
			case ts.isMethodDeclaration(parent) && ts.isIdentifier(parent.name):
			case ts.isMethodSignature(parent) && ts.isIdentifier(parent.name):
			case ts.isPropertyAssignment(parent) && ts.isIdentifier(parent.name):
				name = `${parent.name.text}.${name}`;
				break;
			case ts.isFunctionDeclaration(parent) && parent.name != null:
			case ts.isClassExpression(parent) && parent.name != null:
			case ts.isClassDeclaration(parent) && parent.name != null:
				name = `${parent.name.text}.${name}`;
				break;
			case ts.isEnumMember(parent):
				name = `${parent.name.getText()}.${name}`;
				break;
			case ts.isTypeLiteralNode(parent):
			case ts.isMappedTypeNode(parent):
			case ts.isObjectLiteralExpression(parent):
			case ts.isIntersectionTypeNode(parent):
			case ts.isUnionTypeNode(parent): break;
		}
		parent = parent.parent;
	}
	if (namespace != null) return `${namespace.name.text}.${name}`;
	return name;
}

//#endregion
//#region src/utils/type-variant.ts
/**
* Ported from https://github.com/typescript-eslint/typescript-eslint/blob/eb736bbfc22554694400e6a4f97051d845d32e0b/packages/eslint-plugin/src/rules/strict-boolean-expressions.ts#L826 with some enhancements
* Get the variants of an array of types.
* @param types The types to get the variants of
* @returns The variants of the types
* @internal
*/
function getTypeVariants(types) {
	const variants = /* @__PURE__ */ new Set();
	if (types.some(isUnknownType)) {
		variants.add("unknown");
		return variants;
	}
	if (types.some(isNullishType)) variants.add("nullish");
	const booleans = types.filter(isBooleanType);
	const boolean0 = booleans[0];
	if (booleans.length === 1 && boolean0 != null) {
		if (isFalseLiteralType(boolean0)) variants.add("falsy boolean");
		else if (isTrueLiteralType(boolean0)) variants.add("truthy boolean");
	} else if (booleans.length === 2) variants.add("boolean");
	const strings = types.filter(isStringType);
	if (strings.length > 0) {
		const evaluated = match(strings).when((types) => types.every(isTruthyStringType), () => "truthy string").when((types) => types.every(isFalsyStringType), () => "falsy string").otherwise(() => "string");
		variants.add(evaluated);
	}
	const bigints = types.filter(isBigIntType);
	if (bigints.length > 0) {
		const evaluated = match(bigints).when((types) => types.every(isTruthyBigIntType), () => "truthy bigint").when((types) => types.every(isFalsyBigIntType), () => "falsy bigint").otherwise(() => "bigint");
		variants.add(evaluated);
	}
	const numbers = types.filter(isNumberType);
	if (numbers.length > 0) {
		const evaluated = match(numbers).when((types) => types.every(isTruthyNumberType), () => "truthy number").when((types) => types.every(isFalsyNumberType), () => "falsy number").otherwise(() => "number");
		variants.add(evaluated);
	}
	if (types.some(isEnumType)) variants.add("enum");
	if (types.some(isObjectType)) variants.add("object");
	if (types.some(isAnyType)) variants.add("any");
	if (types.some(isNeverType)) variants.add("never");
	return variants;
}

//#endregion
//#region src/rules/jsx-dollar.ts
const RULE_NAME$63 = "jsx-dollar";
var jsx_dollar_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Prevents unintentional '$' sign before expression." },
		fixable: "code",
		hasSuggestions: true,
		messages: {
			default: "Prevents unintentional '$' sign before expression.",
			removeDollarSign: "Remove the dollar sign '$' before the expression."
		},
		schema: []
	},
	name: RULE_NAME$63,
	create: create$63,
	defaultOptions: []
});
function create$63(context) {
	/**
	* Visitor function for JSXElement and JSXFragment nodes
	* @param node The JSXElement or JSXFragment node to be checked
	*/
	const visitorFunction = (node) => {
		for (const [index, child] of node.children.entries()) {
			if (child.type !== AST_NODE_TYPES.JSXText || !child.value.endsWith("$")) continue;
			if (node.children[index + 1]?.type !== AST_NODE_TYPES.JSXExpressionContainer) continue;
			if (child.value === "$" && node.children.length === 2) continue;
			const pos = child.loc.end;
			context.report({
				messageId: "default",
				node: child,
				loc: {
					end: {
						column: pos.column,
						line: pos.line
					},
					start: {
						column: pos.column - 1,
						line: pos.line
					}
				},
				suggest: [{
					messageId: "removeDollarSign",
					fix(fixer) {
						return fixer.removeRange([child.range[1] - 1, child.range[1]]);
					}
				}]
			});
		}
	};
	return {
		JSXElement: visitorFunction,
		JSXFragment: visitorFunction
	};
}

//#endregion
//#region src/rules/jsx-key-before-spread.ts
const RULE_NAME$62 = "jsx-key-before-spread";
var jsx_key_before_spread_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Enforces 'key' prop placement before spread props." },
		messages: { default: "The 'key' prop must be placed before any spread props when using the new JSX transform." },
		schema: []
	},
	name: RULE_NAME$62,
	create: create$62,
	defaultOptions: []
});
function create$62(context) {
	const { jsx } = {
		...core.getJsxConfigFromContext(context),
		...core.getJsxConfigFromAnnotation(context)
	};
	if (jsx !== core.JsxEmit.ReactJSX && jsx !== core.JsxEmit.ReactJSXDev) return {};
	return { JSXOpeningElement(node) {
		let firstSpreadPropIndex = null;
		for (const [index, prop] of node.attributes.entries()) {
			if (prop.type === AST_NODE_TYPES.JSXSpreadAttribute) {
				firstSpreadPropIndex ??= index;
				continue;
			}
			if (firstSpreadPropIndex == null) continue;
			if (prop.name.name === "key" && index > firstSpreadPropIndex) context.report({
				messageId: "default",
				node: prop
			});
		}
	} };
}

//#endregion
//#region src/rules/jsx-no-comment-textnodes.ts
const RULE_NAME$61 = "jsx-no-comment-textnodes";
var jsx_no_comment_textnodes_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Prevents comment strings (e.g., beginning with '//' or '/*') from being accidentally inserted into a JSX element's text nodes." },
		messages: { default: "Possible misused comment in text node. Comments inside children section of tag should be placed inside braces." },
		schema: []
	},
	name: RULE_NAME$61,
	create: create$61,
	defaultOptions: []
});
function create$61(context) {
	function hasCommentLike(node) {
		if (ast.isOneOf([AST_NODE_TYPES.JSXAttribute, AST_NODE_TYPES.JSXExpressionContainer])(node.parent)) return false;
		return /^\s*\/(?:\/|\*)/mu.test(context.sourceCode.getText(node));
	}
	const visitorFunction = (node) => {
		if (!ast.isOneOf([AST_NODE_TYPES.JSXElement, AST_NODE_TYPES.JSXFragment])(node.parent)) return;
		if (!hasCommentLike(node)) return;
		context.report({
			messageId: "default",
			node
		});
	};
	return {
		JSXText: visitorFunction,
		Literal: visitorFunction
	};
}

//#endregion
//#region src/rules/jsx-no-duplicate-props.ts
const RULE_NAME$60 = "jsx-no-duplicate-props";
var jsx_no_duplicate_props_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Disallows duplicate props in JSX elements." },
		messages: { default: "This JSX property is assigned multiple times." },
		schema: []
	},
	name: RULE_NAME$60,
	create: create$60,
	defaultOptions: []
});
function create$60(context) {
	return { JSXOpeningElement(node) {
		const props = [];
		for (const attr of node.attributes) {
			if (attr.type === AST_NODE_TYPES.JSXSpreadAttribute) continue;
			const name = attr.name.name;
			if (typeof name !== "string") continue;
			if (!props.includes(name)) {
				props.push(name);
				continue;
			}
			context.report({
				messageId: "default",
				node: attr
			});
		}
	} };
}

//#endregion
//#region src/rules/jsx-no-iife.ts
const RULE_NAME$59 = "jsx-no-iife";
var jsx_no_iife_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Disallows immediately-invoked function expressions in JSX." },
		messages: { default: "Avoid using immediately-invoked function expressions in JSX." },
		schema: []
	},
	name: RULE_NAME$59,
	create: create$59,
	defaultOptions: []
});
function create$59(context) {
	return {
		"JSXElement :function"(node) {
			if (node.parent.type === AST_NODE_TYPES.CallExpression && node.parent.callee === node) context.report({
				messageId: "default",
				node: node.parent
			});
		},
		"JSXFragment :function"(node) {
			if (node.parent.type === AST_NODE_TYPES.CallExpression && node.parent.callee === node) context.report({
				messageId: "default",
				node: node.parent
			});
		}
	};
}

//#endregion
//#region src/rules/jsx-no-undef.ts
const RULE_NAME$58 = "jsx-no-undef";
var jsx_no_undef_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Prevents using variables in JSX that are not defined in the scope." },
		messages: { default: "JSX variable '{{name}}' is not defined." },
		schema: []
	},
	name: RULE_NAME$58,
	create: create$58,
	defaultOptions: []
});
function create$58(context) {
	return { JSXOpeningElement(node) {
		const name = match(node.name).with({ type: AST_NODE_TYPES.JSXIdentifier }, (n) => n.name).with({
			type: AST_NODE_TYPES.JSXMemberExpression,
			object: { type: AST_NODE_TYPES.JSXIdentifier }
		}, (n) => n.object.name).otherwise(() => null);
		if (name == null) return;
		if (name === "this") return;
		if (/^[a-z]/u.test(name)) return;
		if (findVariable(name, context.sourceCode.getScope(node)) == null) context.report({
			messageId: "default",
			node,
			data: { name }
		});
	} };
}

//#endregion
//#region src/rules/jsx-shorthand-boolean.ts
const RULE_NAME$57 = "jsx-shorthand-boolean";
const defaultOptions$4 = [1];
const schema$3 = [{
	type: "integer",
	enum: [-1, 1]
}];
var jsx_shorthand_boolean_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Enforces shorthand syntax for boolean props." },
		fixable: "code",
		messages: { default: "{{message}}" },
		schema: schema$3
	},
	name: RULE_NAME$57,
	create: create$57,
	defaultOptions: defaultOptions$4
});
function create$57(context) {
	const policy = context.options[0] ?? defaultOptions$4[0];
	return { JSXAttribute(node) {
		const { value } = node;
		const propName = core.getJsxAttributeName(context, node);
		switch (true) {
			case policy === 1 && value?.type === AST_NODE_TYPES.JSXExpressionContainer && value.expression.type === AST_NODE_TYPES.Literal && value.expression.value === true:
				context.report({
					messageId: "default",
					node,
					data: { message: `Omit attribute value for '${propName}'.` },
					fix: (fixer) => fixer.removeRange([node.name.range[1], value.range[1]])
				});
				break;
			case policy === -1 && value === null:
				context.report({
					messageId: "default",
					node: node.value ?? node,
					data: { message: `Set attribute value for '${propName}'.` },
					fix: (fixer) => fixer.insertTextAfter(node.name, `={true}`)
				});
				break;
		}
	} };
}

//#endregion
//#region src/rules/jsx-shorthand-fragment.ts
const RULE_NAME$56 = "jsx-shorthand-fragment";
const defaultOptions$3 = [1];
const schema$2 = [{
	type: "integer",
	enum: [-1, 1]
}];
var jsx_shorthand_fragment_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Enforces shorthand syntax for fragment elements." },
		fixable: "code",
		messages: { default: "{{message}}" },
		schema: schema$2
	},
	name: RULE_NAME$56,
	create: create$56,
	defaultOptions: defaultOptions$3
});
function create$56(context) {
	const policy = context.options[0] ?? defaultOptions$3[0];
	const jsxConfig = {
		...core.getJsxConfigFromContext(context),
		...core.getJsxConfigFromAnnotation(context)
	};
	const { jsxFragmentFactory } = jsxConfig;
	return match(policy).with(1, () => ({ JSXElement(node) {
		if (!core.isJsxFragmentElement(context, node, jsxConfig)) return;
		if (node.openingElement.attributes.length > 0) return;
		context.report({
			messageId: "default",
			node,
			data: { message: "Use fragment shorthand syntax instead of 'Fragment' component." },
			fix: (fixer) => {
				const { closingElement, openingElement } = node;
				if (closingElement == null) return [];
				return [fixer.replaceTextRange([openingElement.range[0], openingElement.range[1]], "<>"), fixer.replaceTextRange([closingElement.range[0], closingElement.range[1]], "</>")];
			}
		});
	} })).with(-1, () => ({ JSXFragment(node) {
		context.report({
			messageId: "default",
			node,
			data: { message: "Use 'Fragment' component instead of fragment shorthand syntax." },
			fix: (fixer) => {
				const { closingFragment, openingFragment } = node;
				return [fixer.replaceTextRange([openingFragment.range[0], openingFragment.range[1]], `<${jsxFragmentFactory}>`), fixer.replaceTextRange([closingFragment.range[0], closingFragment.range[1]], `</${jsxFragmentFactory}>`)];
			}
		});
	} })).otherwise(() => ({}));
}

//#endregion
//#region src/rules/jsx-uses-react.ts
const RULE_NAME$55 = "jsx-uses-react";
var jsx_uses_react_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Marks React variables as used when JSX is present." },
		messages: { default: "Marked {{name}} as used." },
		schema: []
	},
	name: RULE_NAME$55,
	create: create$55,
	defaultOptions: []
});
function create$55(context) {
	const { jsx, jsxFactory, jsxFragmentFactory } = {
		...core.getJsxConfigFromContext(context),
		...core.getJsxConfigFromAnnotation(context)
	};
	if (jsx === core.JsxEmit.ReactJSX || jsx === core.JsxEmit.ReactJSXDev) return {};
	function handleJsxElement(node) {
		context.sourceCode.markVariableAsUsed(jsxFactory, node);
		debugReport(context, node, jsxFactory);
	}
	function handleJsxFragment(node) {
		context.sourceCode.markVariableAsUsed(jsxFragmentFactory, node);
		debugReport(context, node, jsxFragmentFactory);
	}
	return {
		JSXFragment: handleJsxFragment,
		JSXOpeningElement: handleJsxElement,
		JSXOpeningFragment: handleJsxElement
	};
}
function debugReport(context, node, name) {
	if (process.env["ESLINT_REACT_DEBUG"] !== "1") return;
	context.report({
		messageId: "default",
		node,
		data: { name }
	});
}

//#endregion
//#region src/rules/jsx-uses-vars.ts
const RULE_NAME$54 = "jsx-uses-vars";
var jsx_uses_vars_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Marks JSX element variables as used." },
		messages: { default: "An identifier in JSX is marked as used." },
		schema: []
	},
	name: RULE_NAME$54,
	create: create$54,
	defaultOptions: []
});
function create$54(context) {
	return { JSXOpeningElement(node) {
		switch (node.name.type) {
			case AST_NODE_TYPES.JSXIdentifier:
				if (/^[a-z]/u.test(node.name.name)) return;
				context.sourceCode.markVariableAsUsed(node.name.name, node);
				break;
			case AST_NODE_TYPES.JSXMemberExpression: {
				const { object } = node.name;
				if (object.type === AST_NODE_TYPES.JSXIdentifier) context.sourceCode.markVariableAsUsed(object.name, node);
				break;
			}
		}
	} };
}

//#endregion
//#region src/rules/no-access-state-in-setstate.ts
const RULE_NAME$53 = "no-access-state-in-setstate";
function isKeyLiteral$2(node, key) {
	return match(key).with({ type: AST_NODE_TYPES.Literal }, constTrue).with({
		type: AST_NODE_TYPES.TemplateLiteral,
		expressions: []
	}, constTrue).with({ type: AST_NODE_TYPES.Identifier }, () => !node.computed).otherwise(constFalse);
}
var no_access_state_in_setstate_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Disallows accessing 'this.state' inside 'setState' calls." },
		messages: { default: "Do not access 'this.state' within 'setState'. Use the update function instead." },
		schema: []
	},
	name: RULE_NAME$53,
	create: create$53,
	defaultOptions: []
});
function create$53(context) {
	if (!context.sourceCode.text.includes("setState")) return {};
	const classStack = [];
	const methodStack = [];
	const setStateStack = [];
	return {
		CallExpression(node) {
			if (!core.isThisSetState(node)) return;
			setStateStack.push([node, false]);
		},
		"CallExpression:exit"(node) {
			if (!core.isThisSetState(node)) return;
			setStateStack.pop();
		},
		ClassDeclaration(node) {
			classStack.push([node, core.isClassComponent(node)]);
		},
		"ClassDeclaration:exit"() {
			classStack.pop();
		},
		ClassExpression(node) {
			classStack.push([node, core.isClassComponent(node)]);
		},
		"ClassExpression:exit"() {
			classStack.pop();
		},
		MemberExpression(node) {
			if (!ast.isThisExpressionLoose(node.object)) return;
			const [currClass, isComponent = false] = classStack.at(-1) ?? [];
			if (currClass == null || !isComponent) return;
			const [currMethod, isStatic = false] = methodStack.at(-1) ?? [];
			if (currMethod == null || isStatic) return;
			const [setState, hasThisState = false] = setStateStack.at(-1) ?? [];
			if (setState == null || hasThisState) return;
			if (ast.getPropertyName(node.property) !== "state") return;
			context.report({
				messageId: "default",
				node
			});
		},
		MethodDefinition(node) {
			methodStack.push([node, node.static]);
		},
		"MethodDefinition:exit"() {
			methodStack.pop();
		},
		PropertyDefinition(node) {
			methodStack.push([node, node.static]);
		},
		"PropertyDefinition:exit"() {
			methodStack.pop();
		},
		VariableDeclarator(node) {
			const [currClass, isComponent = false] = classStack.at(-1) ?? [];
			if (currClass == null || !isComponent) return;
			const [currMethod, isStatic = false] = methodStack.at(-1) ?? [];
			if (currMethod == null || isStatic) return;
			const [setState, hasThisState = false] = setStateStack.at(-1) ?? [];
			if (setState == null || hasThisState) return;
			if (node.init == null || !ast.isThisExpressionLoose(node.init) || node.id.type !== AST_NODE_TYPES.ObjectPattern) return;
			if (!node.id.properties.some((prop) => prop.type === AST_NODE_TYPES.Property && isKeyLiteral$2(prop, prop.key) && ast.getPropertyName(prop.key) === "state")) return;
			context.report({
				messageId: "default",
				node
			});
		}
	};
}

//#endregion
//#region src/rules/no-array-index-key.ts
const RULE_NAME$52 = "no-array-index-key";
const REACT_CHILDREN_METHOD = ["forEach", "map"];
function getIndexParamPosition(methodName) {
	switch (methodName) {
		case "every":
		case "filter":
		case "find":
		case "findIndex":
		case "findLast":
		case "findLastIndex":
		case "flatMap":
		case "forEach":
		case "map":
		case "some": return 1;
		case "reduce":
		case "reduceRight": return 2;
		default: return -1;
	}
}
function isReactChildrenMethod(name) {
	return REACT_CHILDREN_METHOD.includes(name);
}
function isUsingReactChildren(context, node) {
	const { importSource = "react" } = coerceSettings(context.settings);
	const { callee } = node;
	if (!("property" in callee) || !("object" in callee) || !("name" in callee.property)) return false;
	if (!isReactChildrenMethod(callee.property.name)) return false;
	const initialScope = context.sourceCode.getScope(node);
	if (callee.object.type === AST_NODE_TYPES.Identifier && callee.object.name === "Children") return true;
	if (callee.object.type === AST_NODE_TYPES.MemberExpression && "name" in callee.object.object) return core.isInitializedFromReact(callee.object.object.name, initialScope, importSource);
	return false;
}
function getMapIndexParamName(context, node) {
	const { callee } = node;
	if (callee.type !== AST_NODE_TYPES.MemberExpression) return unit;
	if (callee.property.type !== AST_NODE_TYPES.Identifier) return unit;
	const { name } = callee.property;
	const indexPosition = getIndexParamPosition(name);
	if (indexPosition === -1) return unit;
	const callbackArg = node.arguments[isUsingReactChildren(context, node) ? 1 : 0];
	if (callbackArg == null) return unit;
	if (!ast.isOneOf([AST_NODE_TYPES.ArrowFunctionExpression, AST_NODE_TYPES.FunctionExpression])(callbackArg)) return unit;
	const { params } = callbackArg;
	if (params.length < indexPosition + 1) return unit;
	const param = params.at(indexPosition);
	return param != null && "name" in param ? param.name : unit;
}
function getIdentifiersFromBinaryExpression(side) {
	if (side.type === AST_NODE_TYPES.Identifier) return [side];
	if (side.type === AST_NODE_TYPES.BinaryExpression) return [...getIdentifiersFromBinaryExpression(side.left), ...getIdentifiersFromBinaryExpression(side.right)];
	return [];
}
var no_array_index_key_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Disallows using an item's index in the array as its key." },
		messages: { default: "Do not use item index in the array as its key." },
		schema: []
	},
	name: RULE_NAME$52,
	create: create$52,
	defaultOptions: []
});
function create$52(context) {
	const indexParamNames = [];
	function isArrayIndex(node) {
		return node.type === AST_NODE_TYPES.Identifier && indexParamNames.some((name) => name != null && name === node.name);
	}
	function isCreateOrCloneElementCall(node) {
		return core.isCreateElementCall(context, node) || core.isCloneElementCall(context, node);
	}
	function getReportDescriptors(node) {
		switch (node.type) {
			case AST_NODE_TYPES.Identifier:
				if (indexParamNames.some((name) => name != null && name === node.name)) return [{
					messageId: "default",
					node
				}];
				return [];
			case AST_NODE_TYPES.TemplateLiteral:
			case AST_NODE_TYPES.BinaryExpression: {
				const descriptors = [];
				const expressions = node.type === AST_NODE_TYPES.TemplateLiteral ? node.expressions : getIdentifiersFromBinaryExpression(node);
				for (const expression of expressions) if (isArrayIndex(expression)) descriptors.push({
					messageId: "default",
					node: expression
				});
				return descriptors;
			}
			case AST_NODE_TYPES.CallExpression: switch (true) {
				case node.callee.type === AST_NODE_TYPES.MemberExpression && node.callee.property.type === AST_NODE_TYPES.Identifier && node.callee.property.name === "toString" && isArrayIndex(node.callee.object): return [{
					messageId: "default",
					node: node.callee.object
				}];
				case node.callee.type === AST_NODE_TYPES.Identifier && node.callee.name === "String" && node.arguments[0] != null && isArrayIndex(node.arguments[0]): return [{
					messageId: "default",
					node: node.arguments[0]
				}];
			}
		}
		return [];
	}
	return {
		CallExpression(node) {
			indexParamNames.push(getMapIndexParamName(context, node));
			if (node.arguments.length === 0) return;
			if (!isCreateOrCloneElementCall(node)) return;
			const [, props] = node.arguments;
			if (props?.type !== AST_NODE_TYPES.ObjectExpression) return;
			for (const prop of props.properties) {
				if (!isMatching({ key: { name: "key" } })(prop)) continue;
				if (!("value" in prop)) continue;
				for (const descriptor of getReportDescriptors(prop.value)) report(context)(descriptor);
			}
		},
		"CallExpression:exit"() {
			indexParamNames.pop();
		},
		JSXAttribute(node) {
			if (node.name.name !== "key") return;
			if (indexParamNames.length === 0) return;
			if (node.value?.type !== AST_NODE_TYPES.JSXExpressionContainer) return;
			for (const descriptor of getReportDescriptors(node.value.expression)) report(context)(descriptor);
		}
	};
}

//#endregion
//#region src/rules/no-children-count.ts
const RULE_NAME$51 = "no-children-count";
var no_children_count_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Disallows the use of 'Children.count' from the 'react' package." },
		messages: { default: "Using 'Children.count' is uncommon and can lead to fragile code. Use alternatives instead." },
		schema: []
	},
	name: RULE_NAME$51,
	create: create$51,
	defaultOptions: []
});
function create$51(context) {
	return { MemberExpression(node) {
		if (core.isChildrenCount(context, node)) context.report({
			messageId: "default",
			node: node.property
		});
	} };
}

//#endregion
//#region src/rules/no-children-for-each.ts
const RULE_NAME$50 = "no-children-for-each";
var no_children_for_each_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Disallows the use of 'Children.forEach' from the 'react' package." },
		messages: { default: "Using 'Children.forEach' is uncommon and can lead to fragile code. Use alternatives instead." },
		schema: []
	},
	name: RULE_NAME$50,
	create: create$50,
	defaultOptions: []
});
function create$50(context) {
	return { MemberExpression(node) {
		if (core.isChildrenForEach(context, node)) context.report({
			messageId: "default",
			node: node.property
		});
	} };
}

//#endregion
//#region src/rules/no-children-map.ts
const RULE_NAME$49 = "no-children-map";
var no_children_map_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Disallows the use of 'Children.map' from the 'react' package." },
		messages: { default: "Using 'Children.map' is uncommon and can lead to fragile code. Use alternatives instead." },
		schema: []
	},
	name: RULE_NAME$49,
	create: create$49,
	defaultOptions: []
});
function create$49(context) {
	return { MemberExpression(node) {
		if (core.isChildrenMap(context, node)) context.report({
			messageId: "default",
			node: node.property
		});
	} };
}

//#endregion
//#region src/rules/no-children-only.ts
const RULE_NAME$48 = "no-children-only";
var no_children_only_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Disallows the use of 'Children.only' from the 'react' package." },
		messages: { default: "Using 'Children.only' is uncommon and can lead to fragile code. Use alternatives instead." },
		schema: []
	},
	name: RULE_NAME$48,
	create: create$48,
	defaultOptions: []
});
function create$48(context) {
	return { MemberExpression(node) {
		if (core.isChildrenOnly(context, node)) context.report({
			messageId: "default",
			node: node.property
		});
	} };
}

//#endregion
//#region src/rules/no-children-prop.ts
const RULE_NAME$47 = "no-children-prop";
var no_children_prop_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Disallows passing 'children' as a prop." },
		messages: { default: "Do not pass 'children' as props." },
		schema: []
	},
	name: RULE_NAME$47,
	create: create$47,
	defaultOptions: []
});
function create$47(context) {
	return { JSXElement(node) {
		const childrenProp = core.getJsxAttribute(context, node)("children");
		if (childrenProp != null) context.report({
			messageId: "default",
			node: childrenProp
		});
	} };
}

//#endregion
//#region src/rules/no-children-to-array.ts
const RULE_NAME$46 = "no-children-to-array";
var no_children_to_array_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Disallows the use of 'Children.toArray' from the 'react' package." },
		messages: { default: "Using 'Children.toArray' is uncommon and can lead to fragile code. Use alternatives instead." },
		schema: []
	},
	name: RULE_NAME$46,
	create: create$46,
	defaultOptions: []
});
function create$46(context) {
	return { MemberExpression(node) {
		if (core.isChildrenToArray(context, node)) context.report({
			messageId: "default",
			node: node.property
		});
	} };
}

//#endregion
//#region src/rules/no-class-component.ts
const RULE_NAME$45 = "no-class-component";
var no_class_component_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Disallows class components except for error boundaries." },
		messages: { default: "Avoid using class components. Use function components instead." },
		schema: []
	},
	name: RULE_NAME$45,
	create: create$45,
	defaultOptions: []
});
function create$45(context) {
	if (!context.sourceCode.text.includes("Component")) return {};
	const { ctx, visitor } = core.useComponentCollectorLegacy(context);
	return defineRuleListener(visitor, { "Program:exit"(program) {
		for (const { name = "anonymous", node: component } of ctx.getAllComponents(program)) {
			if (component.body.body.some((m) => core.isComponentDidCatch(m) || core.isGetDerivedStateFromError(m))) continue;
			context.report({
				messageId: "default",
				node: component,
				data: { name }
			});
		}
	} });
}

//#endregion
//#region src/rules/no-clone-element.ts
const RULE_NAME$44 = "no-clone-element";
var no_clone_element_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Disallows 'cloneElement'." },
		messages: { default: "Using 'cloneElement' is uncommon and can lead to fragile code. Use alternatives instead." },
		schema: []
	},
	name: RULE_NAME$44,
	create: create$44,
	defaultOptions: []
});
function create$44(context) {
	return { CallExpression(node) {
		if (core.isCloneElementCall(context, node)) context.report({
			messageId: "default",
			node
		});
	} };
}

//#endregion
//#region src/rules/no-component-will-mount.ts
const RULE_NAME$43 = "no-component-will-mount";
var no_component_will_mount_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Replaces usage of 'componentWillMount' with 'UNSAFE_componentWillMount'." },
		fixable: "code",
		messages: { default: "[Deprecated] Use 'UNSAFE_componentWillMount' instead." },
		schema: []
	},
	name: RULE_NAME$43,
	create: create$43,
	defaultOptions: []
});
function create$43(context) {
	if (!context.sourceCode.text.includes("componentWillMount")) return {};
	const { ctx, visitor } = core.useComponentCollectorLegacy(context);
	return defineRuleListener(visitor, { "Program:exit"(program) {
		for (const { node: component } of ctx.getAllComponents(program)) {
			const { body } = component.body;
			for (const member of body) if (core.isComponentWillMount(member)) context.report({
				messageId: "default",
				node: member,
				fix(fixer) {
					if (!("key" in member)) return null;
					return fixer.replaceText(member.key, "UNSAFE_componentWillMount");
				}
			});
		}
	} });
}

//#endregion
//#region src/rules/no-component-will-receive-props.ts
const RULE_NAME$42 = "no-component-will-receive-props";
var no_component_will_receive_props_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Replaces usage of 'componentWillReceiveProps' with 'UNSAFE_componentWillReceiveProps'." },
		fixable: "code",
		messages: { default: "[Deprecated] Use 'UNSAFE_componentWillReceiveProps' instead." },
		schema: []
	},
	name: RULE_NAME$42,
	create: create$42,
	defaultOptions: []
});
function create$42(context) {
	if (!context.sourceCode.text.includes("componentWillReceiveProps")) return {};
	const { ctx, visitor } = core.useComponentCollectorLegacy(context);
	return defineRuleListener(visitor, { "Program:exit"(program) {
		for (const { node: component } of ctx.getAllComponents(program)) {
			const { body } = component.body;
			for (const member of body) if (core.isComponentWillReceiveProps(member)) context.report({
				messageId: "default",
				node: member,
				fix(fixer) {
					if (!("key" in member)) return null;
					return fixer.replaceText(member.key, "UNSAFE_componentWillReceiveProps");
				}
			});
		}
	} });
}

//#endregion
//#region src/rules/no-component-will-update.ts
const RULE_NAME$41 = "no-component-will-update";
var no_component_will_update_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Replaces usage of 'componentWillUpdate' with 'UNSAFE_componentWillUpdate'." },
		fixable: "code",
		messages: { default: "[Deprecated] Use 'UNSAFE_componentWillUpdate' instead." },
		schema: []
	},
	name: RULE_NAME$41,
	create: create$41,
	defaultOptions: []
});
function create$41(context) {
	if (!context.sourceCode.text.includes("componentWillUpdate")) return {};
	const { ctx, visitor } = core.useComponentCollectorLegacy(context);
	return defineRuleListener(visitor, { "Program:exit"(program) {
		for (const { node: component } of ctx.getAllComponents(program)) {
			const { body } = component.body;
			for (const member of body) if (core.isComponentWillUpdate(member)) context.report({
				messageId: "default",
				node: member,
				fix(fixer) {
					if (!("key" in member)) return null;
					return fixer.replaceText(member.key, "UNSAFE_componentWillUpdate");
				}
			});
		}
	} });
}

//#endregion
//#region src/rules/no-context-provider.ts
const RULE_NAME$40 = "no-context-provider";
var no_context_provider_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Replaces usage of '<Context.Provider>' with '<Context>'." },
		fixable: "code",
		messages: { default: "In React 19, you can render '<Context>' as a provider instead of '<Context.Provider>'." },
		schema: []
	},
	name: RULE_NAME$40,
	create: create$40,
	defaultOptions: []
});
function create$40(context) {
	if (!context.sourceCode.text.includes("Provider")) return {};
	const { version } = getSettingsFromContext(context);
	if (compare(version, "19.0.0", "<")) return {};
	return { JSXElement(node) {
		const parts = core.getJsxElementType(context, node).split(".");
		const selfName = parts.pop();
		const contextFullName = parts.join(".");
		const contextSelfName = parts.pop();
		if (selfName !== "Provider") return;
		if (contextSelfName == null || !contextSelfName.endsWith("Context")) return;
		context.report({
			messageId: "default",
			node,
			fix(fixer) {
				if (!core.isComponentNameLoose(contextSelfName)) return null;
				const openingElement = node.openingElement;
				const closingElement = node.closingElement;
				if (closingElement == null) return fixer.replaceText(openingElement.name, contextFullName);
				return [fixer.replaceText(openingElement.name, contextFullName), fixer.replaceText(closingElement.name, contextFullName)];
			}
		});
	} };
}

//#endregion
//#region src/rules/no-create-ref.ts
const RULE_NAME$39 = "no-create-ref";
var no_create_ref_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Disallows 'createRef' in function components." },
		messages: { default: "[Deprecated] Use 'useRef' instead." },
		schema: []
	},
	name: RULE_NAME$39,
	create: create$39,
	defaultOptions: []
});
function create$39(context) {
	return { CallExpression(node) {
		if (core.isCreateRefCall(context, node) && ast.findParentNode(node, core.isClassComponent) == null) context.report({
			messageId: "default",
			node
		});
	} };
}

//#endregion
//#region src/rules/no-direct-mutation-state.ts
const RULE_NAME$38 = "no-direct-mutation-state";
function isConstructorFunction(node) {
	return ast.isOneOf([AST_NODE_TYPES.FunctionDeclaration, AST_NODE_TYPES.FunctionExpression])(node) && ast.isMethodOrProperty(node.parent) && node.parent.key.type === AST_NODE_TYPES.Identifier && node.parent.key.name === "constructor";
}
var no_direct_mutation_state_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Disallows direct mutation of 'this.state'." },
		messages: { default: "Do not mutate state directly. Use 'setState()' instead." },
		schema: []
	},
	name: RULE_NAME$38,
	create: create$38,
	defaultOptions: []
});
function create$38(context) {
	return { AssignmentExpression(node) {
		if (!core.isAssignmentToThisState(node)) return;
		const parentClass = ast.findParentNode(node, ast.isOneOf([AST_NODE_TYPES.ClassDeclaration, AST_NODE_TYPES.ClassExpression]));
		if (parentClass == null) return;
		if (core.isClassComponent(parentClass) && context.sourceCode.getScope(node).block !== ast.findParentNode(node, isConstructorFunction)) context.report({
			messageId: "default",
			node
		});
	} };
}

//#endregion
//#region src/rules/no-duplicate-key.ts
const RULE_NAME$37 = "no-duplicate-key";
var no_duplicate_key_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Prevents duplicate 'key' props on sibling elements when rendering lists." },
		messages: { default: "The 'key' prop must be unique to its sibling elements." },
		schema: []
	},
	name: RULE_NAME$37,
	create: create$37,
	defaultOptions: []
});
function create$37(context) {
	if (!context.sourceCode.text.includes("key=")) return {};
	const keyedEntries = /* @__PURE__ */ new Map();
	function isKeyValueEqual(a, b) {
		const aValue = a.value;
		const bValue = b.value;
		if (aValue == null || bValue == null) return false;
		return ast.isNodeEqual(aValue, bValue);
	}
	return {
		"JSXAttribute[name.name='key']"(node) {
			const jsxElement = node.parent.parent;
			switch (jsxElement.parent.type) {
				case AST_NODE_TYPES.ArrayExpression:
				case AST_NODE_TYPES.JSXElement:
				case AST_NODE_TYPES.JSXFragment: {
					const root = jsxElement.parent;
					const prevKeys = keyedEntries.get(root)?.keys ?? [];
					keyedEntries.set(root, {
						hasDuplicate: prevKeys.some((prevKey) => isKeyValueEqual(prevKey, node)),
						keys: [...prevKeys, node],
						root: jsxElement.parent
					});
					break;
				}
				default: {
					const call = ast.findParentNode(jsxElement, (n) => n.type === AST_NODE_TYPES.CallExpression && n.callee.type === AST_NODE_TYPES.MemberExpression && n.callee.property.type === AST_NODE_TYPES.Identifier && n.callee.property.name === "map");
					const iter = ast.findParentNode(jsxElement, (n) => n === call || ast.isFunction(n));
					if (!ast.isFunction(iter)) return;
					const arg0 = call?.arguments[0];
					if (call == null || arg0 == null) return;
					if (ast.getUnderlyingExpression(arg0) !== iter) return;
					keyedEntries.set(call, {
						hasDuplicate: node.value?.type === AST_NODE_TYPES.Literal,
						keys: [node],
						root: call
					});
				}
			}
		},
		"Program:exit"() {
			for (const { hasDuplicate, keys } of keyedEntries.values()) {
				if (!hasDuplicate) continue;
				for (const key of keys) context.report({
					messageId: "default",
					node: key,
					data: { value: context.sourceCode.getText(key) }
				});
			}
		}
	};
}

//#endregion
//#region src/rules/no-forward-ref.ts
const RULE_NAME$36 = "no-forward-ref";
var no_forward_ref_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Replaces usage of 'forwardRef' with passing 'ref' as a prop." },
		fixable: "code",
		messages: { default: "In React 19, 'forwardRef' is no longer necessary. Pass 'ref' as a prop instead." },
		schema: []
	},
	name: RULE_NAME$36,
	create: create$36,
	defaultOptions: []
});
function create$36(context) {
	if (!context.sourceCode.text.includes("forwardRef")) return {};
	const { version } = getSettingsFromContext(context);
	if (compare(version, "19.0.0", "<")) return {};
	return { CallExpression(node) {
		if (!core.isForwardRefCall(context, node)) return;
		const id = ast.getFunctionId(node);
		const fix = canFix(context, node) ? getFix(context, node) : null;
		context.report({
			messageId: "default",
			node: id ?? node,
			fix
		});
	} };
}
/**
* Determine whether the given CallExpression can be safely auto-fixed by replacing
* the usage of `forwardRef` with passing `ref` as a prop
*
* @param context The rule context object
* @param node The CallExpression node to check
* @returns True if the call can be auto-fixed, false otherwise
*/
function canFix(context, node) {
	const { importSource } = getSettingsFromContext(context);
	const initialScope = context.sourceCode.getScope(node);
	switch (node.callee.type) {
		case AST_NODE_TYPES.Identifier: return core.isInitializedFromReact(node.callee.name, initialScope, importSource);
		case AST_NODE_TYPES.MemberExpression: return node.callee.object.type === AST_NODE_TYPES.Identifier && core.isInitializedFromReact(node.callee.object.name, initialScope, importSource);
		default: return false;
	}
}
/**
* Generates the fix for the `forwardRef` call
* @param context The rule context
* @param node The `forwardRef` call expression
* @returns A fixer function that applies the changes
*/
function getFix(context, node) {
	return (fixer) => {
		const [componentNode] = node.arguments;
		if (componentNode == null || !ast.isFunction(componentNode)) return [];
		return [
			fixer.removeRange([node.range[0], componentNode.range[0]]),
			fixer.removeRange([componentNode.range[1], node.range[1]]),
			...getComponentPropsFixes(context, fixer, componentNode, node.typeArguments?.params ?? [])
		];
	};
}
/**
* Generates fixes for the component's props and ref arguments
* @param context The rule context
* @param fixer The rule fixer
* @param node The function component node
* @param typeArguments The type arguments from the `forwardRef` call
* @returns An array of fixes for the component's signature
*/
function getComponentPropsFixes(context, fixer, node, typeArguments) {
	const getText = (node) => context.sourceCode.getText(node);
	const [arg0, arg1] = node.params;
	const [typeArg0, typeArg1] = typeArguments;
	if (arg0 == null) return [];
	const fixedArg0Text = match(arg0).with({ type: AST_NODE_TYPES.Identifier }, (n) => `...${n.name}`).with({ type: AST_NODE_TYPES.ObjectPattern }, (n) => n.properties.map(getText).join(", ")).otherwise(() => null);
	const fixedArg1Text = match(arg1).with(P.nullish, () => "ref").with({
		type: AST_NODE_TYPES.Identifier,
		name: "ref"
	}, () => "ref").with({
		type: AST_NODE_TYPES.Identifier,
		name: P.string
	}, (n) => `ref: ${n.name}`).otherwise(() => null);
	if (fixedArg0Text == null || fixedArg1Text == null) return [];
	if (typeArg0 == null || typeArg1 == null) return [fixer.replaceText(arg0, [
		"{",
		fixedArg1Text + ",",
		fixedArg0Text,
		"}"
	].join(" ")), ...arg1 == null ? [] : [fixer.remove(arg1), fixer.removeRange([arg0.range[1], arg1.range[0]])]];
	const typeArg0Text = getText(typeArg0);
	const typeArg1Text = getText(typeArg1);
	return [fixer.replaceText(arg0, [
		"{",
		fixedArg1Text + ",",
		fixedArg0Text,
		"}:",
		typeArg1Text,
		"&",
		"{",
		`ref?:`,
		`React.RefObject<${typeArg0Text} | null>`,
		"}"
	].join(" ")), ...arg1 == null ? [] : [fixer.remove(arg1), fixer.removeRange([arg0.range[1], arg1.range[0]])]];
}

//#endregion
//#region src/rules/no-implicit-key.ts
const RULE_NAME$35 = "no-implicit-key";
var no_implicit_key_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Prevents implicitly passing the 'key' prop to components." },
		messages: { default: "This spread attribute implicitly passes the 'key' prop to a component, this could lead to unexpected behavior. If you intend to pass the 'key' prop, use 'key={value}'." },
		schema: []
	},
	name: RULE_NAME$35,
	create: create$35,
	defaultOptions: []
});
function create$35(context) {
	const services = ESLintUtils.getParserServices(context, false);
	const checker = services.program.getTypeChecker();
	return { JSXSpreadAttribute(node) {
		for (const type of unionConstituents(getConstrainedTypeAtLocation(services, node.argument))) {
			const key = type.getProperty("key");
			if (key == null) continue;
			if (getFullyQualifiedNameEx(checker, key).toLowerCase().endsWith("react.attributes.key")) continue;
			context.report({
				messageId: "default",
				node
			});
		}
	} };
}

//#endregion
//#region src/rules/no-leaked-conditional-rendering.ts
const RULE_NAME$34 = "no-leaked-conditional-rendering";
var no_leaked_conditional_rendering_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Prevents problematic leaked values from being rendered." },
		messages: { default: "Potential leaked value {{value}} that might cause unintentionally rendered values or rendering crashes." },
		schema: []
	},
	name: RULE_NAME$34,
	create: create$34,
	defaultOptions: []
});
function create$34(context) {
	if (!context.sourceCode.text.includes("&&")) return {};
	const { version } = getSettingsFromContext(context);
	const allowedVariants = [
		"any",
		"boolean",
		"nullish",
		"object",
		"enum",
		"falsy boolean",
		"truthy bigint",
		"truthy boolean",
		"truthy number",
		"truthy string",
		...compare(version, "18.0.0", "<") ? [] : ["string", "falsy string"]
	];
	const services = ESLintUtils.getParserServices(context, false);
	/**
	* Recursively inspects a node to find potential leaked conditional rendering
	* @param node The AST node to inspect
	* @returns A report descriptor if a problem is found, otherwise `unit`
	*/
	function getReportDescriptor(node) {
		if (node == null) return unit;
		if (ast.is(AST_NODE_TYPES.JSXExpressionContainer)(node)) return getReportDescriptor(node.expression);
		if (ast.isJSX(node)) return unit;
		if (ast.isTypeExpression(node)) return getReportDescriptor(node.expression);
		return match(node).with({
			type: AST_NODE_TYPES.LogicalExpression,
			operator: "&&"
		}, ({ left, right }) => {
			if (left.type === AST_NODE_TYPES.UnaryExpression && left.operator === "!") return getReportDescriptor(right);
			const initialScope = context.sourceCode.getScope(left);
			if (ast.isIdentifier(left, "NaN") || getStaticValue(left, initialScope)?.value === "NaN") return {
				messageId: "default",
				node: left,
				data: { value: context.sourceCode.getText(left) }
			};
			const leftTypeVariants = getTypeVariants(unionConstituents(getConstrainedTypeAtLocation(services, left)));
			if (Array.from(leftTypeVariants.values()).every((type) => allowedVariants.some((allowed) => allowed === type))) return getReportDescriptor(right);
			return {
				messageId: "default",
				node: left,
				data: { value: context.sourceCode.getText(left) }
			};
		}).with({ type: AST_NODE_TYPES.ConditionalExpression }, ({ alternate, consequent }) => {
			return getReportDescriptor(consequent) ?? getReportDescriptor(alternate);
		}).with({ type: AST_NODE_TYPES.Identifier }, (n) => {
			const variableDefNode = findVariable(n.name, context.sourceCode.getScope(n))?.defs.at(0)?.node;
			return match(variableDefNode).with({ init: P.select({ type: P.not(AST_NODE_TYPES.VariableDeclaration) }) }, getReportDescriptor).otherwise(() => unit);
		}).otherwise(() => unit);
	}
	return { JSXExpressionContainer: flow(getReportDescriptor, report(context)) };
}

//#endregion
//#region src/rules/no-missing-component-display-name.ts
const RULE_NAME$33 = "no-missing-component-display-name";
var no_missing_component_display_name_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Enforces that all components have a 'displayName' that can be used in DevTools." },
		messages: { default: "Add missing 'displayName' for component." },
		schema: []
	},
	name: RULE_NAME$33,
	create: create$33,
	defaultOptions: []
});
function create$33(context) {
	if (!context.sourceCode.text.includes("memo") && !context.sourceCode.text.includes("forwardRef")) return {};
	const { ctx, visitor } = core.useComponentCollector(context, {
		collectDisplayName: true,
		hint: core.DEFAULT_COMPONENT_DETECTION_HINT
	});
	return defineRuleListener(visitor, { "Program:exit"(program) {
		for (const { node, displayName, flag } of ctx.getAllComponents(program)) {
			const id = ast.getFunctionId(node);
			const isMemoOrForwardRef = (flag & (core.ComponentFlag.ForwardRef | core.ComponentFlag.Memo)) > 0n;
			if (id != null) continue;
			if (!isMemoOrForwardRef) continue;
			if (displayName == null) context.report({
				messageId: "default",
				node
			});
		}
	} });
}

//#endregion
//#region src/rules/no-missing-context-display-name.ts
const RULE_NAME$32 = "no-missing-context-display-name";
var no_missing_context_display_name_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Enforces that all contexts have a 'displayName' that can be used in DevTools." },
		fixable: "code",
		messages: { default: "Add missing 'displayName' for context." },
		schema: []
	},
	name: RULE_NAME$32,
	create: create$32,
	defaultOptions: []
});
function create$32(context) {
	if (!context.sourceCode.text.includes("createContext")) return {};
	const createCalls = [];
	const displayNameAssignments = [];
	return {
		[ast.SEL_DISPLAY_NAME_ASSIGNMENT_EXPRESSION](node) {
			displayNameAssignments.push(node);
		},
		CallExpression(node) {
			if (!core.isCreateContextCall(context, node)) return;
			createCalls.push(node);
		},
		"Program:exit"() {
			for (const call of createCalls) {
				const id = findEnclosingAssignmentTarget(call);
				if (id == null) {
					context.report({
						messageId: "default",
						node: call
					});
					continue;
				}
				if (!displayNameAssignments.some((node) => {
					const left = node.left;
					if (left.type !== AST_NODE_TYPES.MemberExpression) return false;
					const object = left.object;
					return isAssignmentTargetEqual(context, id, object);
				})) context.report({
					messageId: "default",
					node: id,
					fix(fixer) {
						if (id.type !== AST_NODE_TYPES.Identifier || id.parent !== call.parent) return [];
						return fixer.insertTextAfter(context.sourceCode.getTokenAfter(call) ?? call, [
							"\n",
							id.name,
							".",
							"displayName",
							" ",
							"=",
							" ",
							JSON.stringify(id.name),
							";"
						].join(""));
					}
				});
			}
		}
	};
}

//#endregion
//#region src/rules/no-missing-key.ts
const RULE_NAME$31 = "no-missing-key";
var no_missing_key_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Disallows missing 'key' on items in list rendering." },
		messages: {
			default: "Missing 'key' for element when rendering list.",
			unexpectedFragmentSyntax: "Use fragment component instead of '<>' because it does not support `key`."
		},
		schema: []
	},
	name: RULE_NAME$31,
	create: create$31,
	defaultOptions: []
});
function create$31(ctx) {
	let inChildrenToArray = false;
	function check(node) {
		if (node.type === AST_NODE_TYPES.JSXElement) return core.getJsxAttribute(ctx, node)("key") == null ? {
			messageId: "default",
			node
		} : null;
		if (node.type === AST_NODE_TYPES.JSXFragment) return {
			messageId: "unexpectedFragmentSyntax",
			node
		};
		return null;
	}
	function checkExpr(node) {
		switch (node.type) {
			case AST_NODE_TYPES.ConditionalExpression: return check(node.consequent) ?? check(node.alternate);
			case AST_NODE_TYPES.LogicalExpression: return check(node.left) ?? check(node.right);
			case AST_NODE_TYPES.JSXElement:
			case AST_NODE_TYPES.JSXFragment: return check(node);
			default: return null;
		}
	}
	function checkBlock(node) {
		return ast.getNestedReturnStatements(node).filter((stmt) => stmt.argument != null).map((stmt) => check(stmt.argument)).filter((d) => d != null);
	}
	return {
		ArrayExpression(node) {
			if (inChildrenToArray) return;
			const elements = node.elements.filter(ast.is(AST_NODE_TYPES.JSXElement));
			if (elements.length === 0) return;
			const scope = ctx.sourceCode.getScope(node);
			for (const el of elements) if (core.getJsxAttribute(ctx, el, scope)("key") == null) ctx.report({
				messageId: "default",
				node: el
			});
		},
		CallExpression(node) {
			inChildrenToArray ||= core.isChildrenToArrayCall(ctx, node);
			if (inChildrenToArray) return;
			if (node.callee.type !== AST_NODE_TYPES.MemberExpression) return;
			if (node.callee.property.type !== AST_NODE_TYPES.Identifier) return;
			const name = node.callee.property.name;
			const idx = name === "from" ? 1 : name === "map" ? 0 : -1;
			if (idx < 0) return;
			const cb = node.arguments[idx];
			if (!ast.isFunction(cb)) return;
			if (cb.body.type === AST_NODE_TYPES.BlockStatement) checkBlock(cb.body).forEach(report(ctx));
			else report(ctx)(checkExpr(cb.body));
		},
		"CallExpression:exit"(node) {
			if (core.isChildrenToArrayCall(ctx, node)) inChildrenToArray = false;
		},
		JSXFragment(node) {
			if (inChildrenToArray) return;
			if (node.parent.type === AST_NODE_TYPES.ArrayExpression) ctx.report({
				messageId: "unexpectedFragmentSyntax",
				node
			});
		}
	};
}

//#endregion
//#region src/rules/no-misused-capture-owner-stack.ts
const RULE_NAME$30 = "no-misused-capture-owner-stack";
var no_misused_capture_owner_stack_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Prevents incorrect usage of 'captureOwnerStack'." },
		messages: {
			missingDevelopmentOnlyCheck: `Don't call 'captureOwnerStack' directly. Use 'if (process.env.NODE_ENV !== "production") {...}' to conditionally access it.`,
			useNamespaceImport: "Don't use named imports of 'captureOwnerStack' in files that are bundled for development and production. Use a namespace import instead."
		},
		schema: []
	},
	name: RULE_NAME$30,
	create: create$30,
	defaultOptions: []
});
function create$30(context) {
	if (!context.sourceCode.text.includes("captureOwnerStack")) return {};
	const { importSource } = getSettingsFromContext(context);
	return {
		CallExpression(node) {
			if (!core.isCaptureOwnerStackCall(context, node)) return;
			if (ast.findParentNode(node, isDevelopmentOnlyCheck) == null) context.report({
				messageId: "missingDevelopmentOnlyCheck",
				node
			});
		},
		ImportDeclaration(node) {
			if (node.source.value !== importSource) return;
			for (const specifier of node.specifiers) {
				if (specifier.type !== AST_NODE_TYPES.ImportSpecifier) continue;
				if (specifier.imported.type !== AST_NODE_TYPES.Identifier) continue;
				if (specifier.imported.name === "captureOwnerStack") context.report({
					messageId: "useNamespaceImport",
					node: specifier
				});
			}
		}
	};
}
function isDevelopmentOnlyCheck(node) {
	if (node.type !== AST_NODE_TYPES.IfStatement) return false;
	return ast.isProcessEnvNodeEnvCompare(node.test, "!==", "production");
}

//#endregion
//#region src/rules/no-nested-component-definitions.ts
const RULE_NAME$29 = "no-nested-component-definitions";
var no_nested_component_definitions_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Disallows nesting component definitions inside other components." },
		messages: { default: "Do not nest component definitions inside other components or props. {{suggestion}}" },
		schema: []
	},
	name: RULE_NAME$29,
	create: create$29,
	defaultOptions: []
});
function create$29(context) {
	const hint = core.ComponentDetectionHint.DoNotIncludeJsxWithNumberValue | core.ComponentDetectionHint.DoNotIncludeJsxWithBooleanValue | core.ComponentDetectionHint.DoNotIncludeJsxWithNullValue | core.ComponentDetectionHint.DoNotIncludeJsxWithStringValue | core.ComponentDetectionHint.DoNotIncludeJsxWithUndefinedValue | core.ComponentDetectionHint.RequireBothSidesOfLogicalExpressionToBeJsx | core.ComponentDetectionHint.RequireBothBranchesOfConditionalExpressionToBeJsx | core.ComponentDetectionHint.DoNotIncludeFunctionDefinedInArrayPattern | core.ComponentDetectionHint.DoNotIncludeFunctionDefinedInArrayExpression | core.ComponentDetectionHint.DoNotIncludeFunctionDefinedAsArrayMapCallback;
	const fCollector = core.useComponentCollector(context, { hint });
	const cCollector = core.useComponentCollectorLegacy(context);
	return defineRuleListener(fCollector.visitor, cCollector.visitor, { "Program:exit"(program) {
		const fComponents = [...fCollector.ctx.getAllComponents(program)];
		const cComponents = [...cCollector.ctx.getAllComponents(program)];
		const isFunctionComponent = (node) => {
			return ast.isFunction(node) && fComponents.some((component) => component.node === node);
		};
		const isClassComponent = (node) => {
			return ast.isClass(node) && cComponents.some((component) => component.node === node);
		};
		for (const { name, node: component } of fComponents) {
			if (name == null) continue;
			if (core.isDirectValueOfRenderPropertyLoose(component)) continue;
			if (isInsideJSXAttributeValue(component)) {
				if (!core.isDeclaredInRenderPropLoose(component)) context.report({
					messageId: "default",
					node: component,
					data: {
						name,
						suggestion: "Move it to the top level or pass it as a prop."
					}
				});
				continue;
			}
			if (isInsideCreateElementProps(context, component)) {
				context.report({
					messageId: "default",
					node: component,
					data: {
						name,
						suggestion: "Move it to the top level or pass it as a prop."
					}
				});
				continue;
			}
			const parentComponent = ast.findParentNode(component, isFunctionComponent);
			if (parentComponent != null && !core.isDirectValueOfRenderPropertyLoose(parentComponent)) {
				context.report({
					messageId: "default",
					node: component,
					data: {
						name,
						suggestion: component.parent.type === AST_NODE_TYPES.Property ? "Move it to the top level or pass it as a prop." : "Move it to the top level."
					}
				});
				continue;
			}
			if (isInsideRenderMethod(component)) context.report({
				messageId: "default",
				node: component,
				data: {
					name,
					suggestion: "Move it to the top level."
				}
			});
		}
		for (const { name = "unknown", node: component } of cComponents) {
			if (ast.findParentNode(component, (n) => isClassComponent(n) || isFunctionComponent(n)) == null) continue;
			context.report({
				messageId: "default",
				node: component,
				data: {
					name,
					suggestion: component.parent.type === AST_NODE_TYPES.Property ? "Move it to the top level or pass it as a prop." : "Move it to the top level."
				}
			});
		}
	} });
}
/**
* Determine whether the node is inside JSX attribute value
* @param node The AST node to check
* @returns `true` if the node is inside JSX attribute value
*/
function isInsideJSXAttributeValue(node) {
	return node.parent.type === AST_NODE_TYPES.JSXAttribute || core.findParentJsxAttribute(node, (n) => n.value?.type === AST_NODE_TYPES.JSXExpressionContainer) != null;
}
/**
* Check whether a given node is declared inside a class component's render block
* Ex: class C extends React.Component { render() { const Nested = () => <div />; } }
* @param node The AST node being checked
* @returns `true` if the node is inside a class component's render block
*/
function isInsideRenderMethod(node) {
	return ast.findParentNode(node, (n) => core.isRenderMethodLike(n) && core.isClassComponent(n.parent.parent)) != null;
}
/**
* Determine whether the node is inside `createElement`'s props argument
* @param context The rule context
* @param node The AST node to check
* @returns `true` if the node is inside `createElement`'s props
*/
function isInsideCreateElementProps(context, node) {
	const call = ast.findParentNode(node, core.isCreateElementCall(context));
	if (call == null) return false;
	const prop = ast.findParentNode(node, ast.is(AST_NODE_TYPES.ObjectExpression));
	if (prop == null) return false;
	return prop === call.arguments[1];
}

//#endregion
//#region src/rules/no-nested-lazy-component-declarations.ts
const RULE_NAME$28 = "no-nested-lazy-component-declarations";
var no_nested_lazy_component_declarations_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Disallows nesting lazy component declarations inside other components." },
		messages: { default: "Do not declare lazy components inside other components. Instead, always declare them at the top level of your module." },
		schema: []
	},
	name: RULE_NAME$28,
	create: create$28,
	defaultOptions: []
});
function create$28(context) {
	const hint = core.ComponentDetectionHint.None;
	const collector = core.useComponentCollector(context, { hint });
	const collectorLegacy = core.useComponentCollectorLegacy(context);
	const lazyComponentDeclarations = /* @__PURE__ */ new Set();
	return defineRuleListener(collector.visitor, collectorLegacy.visitor, {
		ImportExpression(node) {
			const lazyCall = ast.findParentNode(node, (n) => core.isLazyCall(context, n));
			if (lazyCall != null) lazyComponentDeclarations.add(lazyCall);
		},
		"Program:exit"(program) {
			const functionComponents = collector.ctx.getAllComponents(program);
			const classComponents = collectorLegacy.ctx.getAllComponents(program);
			for (const lazy of lazyComponentDeclarations) if (ast.findParentNode(lazy, (n) => {
				if (ast.isJSX(n)) return true;
				if (n.type === AST_NODE_TYPES.CallExpression) return core.isHookCall(n) || core.isCreateElementCall(context, n) || core.isCreateContextCall(context, n);
				if (ast.isFunction(n)) return functionComponents.some((c) => c.node === n);
				if (ast.isClass(n)) return classComponents.some((c) => c.node === n);
				return false;
			}) != null) context.report({
				messageId: "default",
				node: lazy
			});
		}
	});
}

//#endregion
//#region src/rules/no-redundant-should-component-update.ts
const RULE_NAME$27 = "no-redundant-should-component-update";
function isShouldComponentUpdate(node) {
	return ast.isMethodOrProperty(node) && node.key.type === AST_NODE_TYPES.Identifier && node.key.name === "shouldComponentUpdate";
}
var no_redundant_should_component_update_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Disallows 'shouldComponentUpdate' when extending 'React.PureComponent'." },
		messages: { default: "'{{componentName}}' does not need 'shouldComponentUpdate' when extending 'React.PureComponent'." },
		schema: []
	},
	name: RULE_NAME$27,
	create: create$27,
	defaultOptions: []
});
function create$27(context) {
	if (!context.sourceCode.text.includes("shouldComponentUpdate")) return {};
	const { ctx, visitor } = core.useComponentCollectorLegacy(context);
	return defineRuleListener(visitor, { "Program:exit"(program) {
		for (const { name = "PureComponent", node: component, flag } of ctx.getAllComponents(program)) {
			if ((flag & core.ComponentFlag.PureComponent) === 0n) continue;
			const { body } = component.body;
			for (const member of body) if (isShouldComponentUpdate(member)) context.report({
				messageId: "default",
				node: member,
				data: { componentName: name }
			});
		}
	} });
}

//#endregion
//#region src/rules/no-set-state-in-component-did-mount.ts
const RULE_NAME$26 = "no-set-state-in-component-did-mount";
var no_set_state_in_component_did_mount_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Disallows calling 'this.setState' in 'componentDidMount' outside functions such as callbacks." },
		messages: { default: "Do not call `this.setState` in `componentDidMount` outside functions such as callbacks." },
		schema: []
	},
	name: RULE_NAME$26,
	create: create$26,
	defaultOptions: []
});
function create$26(context) {
	if (!context.sourceCode.text.includes("componentDidMount")) return {};
	return { CallExpression(node) {
		if (!core.isThisSetState(node)) return;
		const enclosingClassNode = ast.findParentNode(node, core.isClassComponent);
		const enclosingMethodNode = ast.findParentNode(node, (n) => n === enclosingClassNode || core.isComponentDidMount(n));
		if (enclosingClassNode == null || enclosingMethodNode == null || enclosingMethodNode === enclosingClassNode) return;
		const enclosingMethodScope = context.sourceCode.getScope(enclosingMethodNode);
		const setStateCallParentScope = context.sourceCode.getScope(node).upper;
		if (enclosingMethodNode.parent === enclosingClassNode.body && setStateCallParentScope === enclosingMethodScope) context.report({
			messageId: "default",
			node
		});
	} };
}

//#endregion
//#region src/rules/no-set-state-in-component-did-update.ts
const RULE_NAME$25 = "no-set-state-in-component-did-update";
var no_set_state_in_component_did_update_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Disallows calling 'this.setState' in 'componentDidUpdate' outside functions such as callbacks." },
		messages: { default: "Do not call `this.setState` in `componentDidUpdate` outside functions such as callbacks." },
		schema: []
	},
	name: RULE_NAME$25,
	create: create$25,
	defaultOptions: []
});
function create$25(context) {
	if (!context.sourceCode.text.includes("componentDidUpdate")) return {};
	return { CallExpression(node) {
		if (!core.isThisSetState(node)) return;
		const enclosingClassNode = ast.findParentNode(node, core.isClassComponent);
		const enclosingMethodNode = ast.findParentNode(node, (n) => n === enclosingClassNode || core.isComponentDidUpdate(n));
		if (enclosingClassNode == null || enclosingMethodNode == null || enclosingMethodNode === enclosingClassNode) return;
		const enclosingMethodScope = context.sourceCode.getScope(enclosingMethodNode);
		const setStateCallParentScope = context.sourceCode.getScope(node).upper;
		if (enclosingMethodNode.parent === enclosingClassNode.body && setStateCallParentScope === enclosingMethodScope) context.report({
			messageId: "default",
			node
		});
	} };
}

//#endregion
//#region src/rules/no-set-state-in-component-will-update.ts
const RULE_NAME$24 = "no-set-state-in-component-will-update";
var no_set_state_in_component_will_update_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Disallows calling 'this.setState' in 'componentWillUpdate' outside functions such as callbacks." },
		messages: { default: "Do not call `this.setState` in `componentWillUpdate` outside functions such as callbacks." },
		schema: []
	},
	name: RULE_NAME$24,
	create: create$24,
	defaultOptions: []
});
function create$24(context) {
	if (!context.sourceCode.text.includes("componentWillUpdate")) return {};
	return { CallExpression(node) {
		if (!core.isThisSetState(node)) return;
		const enclosingClassNode = ast.findParentNode(node, core.isClassComponent);
		const enclosingMethodNode = ast.findParentNode(node, (n) => n === enclosingClassNode || core.isComponentWillUpdate(n));
		if (enclosingClassNode == null || enclosingMethodNode == null || enclosingMethodNode === enclosingClassNode) return;
		const enclosingMethodScope = context.sourceCode.getScope(enclosingMethodNode);
		const setStateCallParentScope = context.sourceCode.getScope(node).upper;
		if (enclosingMethodNode.parent === enclosingClassNode.body && setStateCallParentScope === enclosingMethodScope) context.report({
			messageId: "default",
			node
		});
	} };
}

//#endregion
//#region src/rules/no-unnecessary-key.ts
const RULE_NAME$23 = "no-unnecessary-key";
var no_unnecessary_key_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Disallows unnecessary 'key' props on nested child elements when rendering lists." },
		messages: { default: "Unnecessary `key` prop on this element. {{reason}}" },
		schema: []
	},
	name: RULE_NAME$23,
	create: create$23,
	defaultOptions: []
});
function create$23(context) {
	if (!context.sourceCode.text.includes("key=")) return {};
	const jsxConfig = {
		...core.getJsxConfigFromContext(context),
		...core.getJsxConfigFromAnnotation(context)
	};
	return { JSXAttribute(node) {
		if (node.name.name !== "key") return;
		const jsxElement = node.parent.parent;
		if (core.isJsxFragmentElement(context, jsxElement, jsxConfig)) return;
		if (jsxElement.openingElement.attributes.some((attr) => attr.type === AST_NODE_TYPES.JSXSpreadAttribute)) return;
		if (ast.findParentNode(jsxElement, (n) => core.isRenderFunctionLoose(context, n)) != null) return;
		const mapCallback = ast.findParentNode(jsxElement, isArrayMethodCallback);
		if (mapCallback == null || ast.findParentNode(jsxElement, ast.isFunction) !== mapCallback) return;
		if (context.sourceCode.getScope(mapCallback) !== context.sourceCode.getScope(jsxElement)) return;
		const keyedElementOrElse = ast.findParentNode(jsxElement, (n) => {
			if (n === mapCallback) return true;
			return ast.isJSXElement(n) && core.getJsxAttribute(context, n)("key") != null;
		});
		if (keyedElementOrElse == null || keyedElementOrElse === mapCallback) return;
		context.report({
			messageId: "default",
			node,
			data: { reason: "A parent element already has a `key` prop in the same list rendering context." }
		});
	} };
}
function getArrayMethodCallbackPosition(methodName) {
	switch (methodName) {
		case "filter":
		case "flatMap":
		case "forEach":
		case "map":
		case "reduce":
		case "reduceRight": return 0;
		case "from":
		case "fromAsync": return 1;
		default: return -1;
	}
}
function isArrayMethodCallback(node) {
	const parent = node.parent;
	if (parent?.type !== AST_NODE_TYPES.CallExpression) return false;
	if (parent.callee.type !== AST_NODE_TYPES.MemberExpression || parent.callee.property.type !== AST_NODE_TYPES.Identifier) return false;
	return parent.arguments[getArrayMethodCallbackPosition(parent.callee.property.name)] === node;
}

//#endregion
//#region src/rules/no-unnecessary-use-callback.ts
const RULE_NAME$22 = "no-unnecessary-use-callback";
var no_unnecessary_use_callback_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Disallows unnecessary usage of 'useCallback'." },
		messages: {
			default: "An 'useCallback' with empty deps and no references to the component scope may be unnecessary.",
			noUnnecessaryUseCallbackInsideUseEffect: "{{name}} is only used inside 1 useEffect, which may be unnecessary. You can move the computation into useEffect directly and merge the dependency arrays."
		},
		schema: []
	},
	name: RULE_NAME$22,
	create: create$22,
	defaultOptions: []
});
function create$22(context) {
	if (!context.sourceCode.text.includes("useCallback")) return {};
	return { VariableDeclarator(node) {
		const { id, init } = node;
		if (id.type !== AST_NODE_TYPES.Identifier || init?.type !== AST_NODE_TYPES.CallExpression || !core.isUseCallbackCall(init)) return;
		const [cbk, ...rest] = context.sourceCode.getDeclaredVariables(node);
		if (cbk == null || rest.length > 0) return;
		const checkForUsageInsideUseEffectReport = checkForUsageInsideUseEffect$1(context.sourceCode, init);
		const scope = context.sourceCode.getScope(init);
		const component = context.sourceCode.getScope(init).block;
		if (!ast.isFunction(component)) return;
		const [arg0, arg1] = init.arguments;
		if (arg0 == null || arg1 == null) return;
		if (!match(arg1).with({ type: AST_NODE_TYPES.ArrayExpression }, (n) => n.elements.length === 0).with({ type: AST_NODE_TYPES.Identifier }, (n) => {
			const variableNode = getVariableDefinitionNode(findVariable(n.name, scope), 0);
			if (variableNode?.type !== AST_NODE_TYPES.ArrayExpression) return false;
			return variableNode.elements.length === 0;
		}).otherwise(() => false)) {
			report(context)(checkForUsageInsideUseEffectReport);
			return;
		}
		const arg0Node = match(arg0).with({ type: AST_NODE_TYPES.ArrowFunctionExpression }, (n) => {
			if (n.body.type === AST_NODE_TYPES.ArrowFunctionExpression) return n.body;
			return n;
		}).with({ type: AST_NODE_TYPES.FunctionExpression }, identity).with({ type: AST_NODE_TYPES.Identifier }, (n) => {
			const variableNode = getVariableDefinitionNode(findVariable(n.name, scope), 0);
			if (variableNode?.type !== AST_NODE_TYPES.ArrowFunctionExpression && variableNode?.type !== AST_NODE_TYPES.FunctionExpression) return null;
			return variableNode;
		}).otherwise(() => null);
		if (arg0Node == null) return;
		if (!getChildScopes(context.sourceCode.getScope(arg0Node)).flatMap((x) => x.references).some((x) => x.resolved?.scope.block === component)) {
			context.report({
				messageId: "default",
				node
			});
			return;
		}
		report(context)(checkForUsageInsideUseEffectReport);
	} };
}
function checkForUsageInsideUseEffect$1(sourceCode, node) {
	if (!/use\w*Effect/u.test(sourceCode.text)) return;
	if (!isVariableDeclarator(node.parent)) return;
	if (!isIdentifier(node.parent.id)) return;
	const usages = (sourceCode.getDeclaredVariables(node.parent)[0]?.references ?? []).filter((ref) => ref.init !== true);
	if (usages.length === 0) return;
	const effectSet = /* @__PURE__ */ new Set();
	for (const usage of usages) {
		const effect = ast.findParentNode(usage.identifier, core.isUseEffectLikeCall);
		if (effect == null) return;
		effectSet.add(effect);
		if (effectSet.size > 1) return;
	}
	return {
		messageId: "noUnnecessaryUseCallbackInsideUseEffect",
		node,
		data: { name: node.parent.id.name }
	};
}

//#endregion
//#region src/rules/no-unnecessary-use-memo.ts
const RULE_NAME$21 = "no-unnecessary-use-memo";
var no_unnecessary_use_memo_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Disallows unnecessary usage of 'useMemo'." },
		messages: {
			default: "An 'useMemo' with empty deps and no references to the component scope may be unnecessary.",
			noUnnecessaryUseMemoInsideUseEffect: "{{name}} is only used inside 1 useEffect, which may be unnecessary. You can move the computation into useEffect directly and merge the dependency arrays."
		},
		schema: []
	},
	name: RULE_NAME$21,
	create: create$21,
	defaultOptions: []
});
function create$21(context) {
	if (!context.sourceCode.text.includes("useMemo")) return {};
	return { VariableDeclarator(node) {
		const { id, init } = node;
		if (id.type !== AST_NODE_TYPES.Identifier || init?.type !== AST_NODE_TYPES.CallExpression || !core.isUseMemoCall(init)) return;
		const [mem, ...rest] = context.sourceCode.getDeclaredVariables(node);
		if (mem == null || rest.length > 0) return;
		const checkForUsageInsideUseEffectReport = checkForUsageInsideUseEffect(context.sourceCode, init);
		const scope = context.sourceCode.getScope(init);
		const component = scope.block;
		if (!ast.isFunction(component)) return;
		const [arg0, arg1] = init.arguments;
		if (arg0 == null || arg1 == null) return;
		if (ast.isFunction(arg0) && [...ast.getNestedCallExpressions(arg0.body), ...ast.getNestedNewExpressions(arg0.body)].length > 0) {
			report(context)(checkForUsageInsideUseEffectReport);
			return;
		}
		if (!match(arg1).with({ type: AST_NODE_TYPES.ArrayExpression }, (n) => n.elements.length === 0).with({ type: AST_NODE_TYPES.Identifier }, (n) => {
			const variableNode = getVariableDefinitionNode(findVariable(n.name, scope), 0);
			if (variableNode?.type !== AST_NODE_TYPES.ArrayExpression) return false;
			return variableNode.elements.length === 0;
		}).otherwise(() => false)) {
			report(context)(checkForUsageInsideUseEffectReport);
			return;
		}
		const arg0Node = match(arg0).with({ type: AST_NODE_TYPES.ArrowFunctionExpression }, (n) => {
			if (n.body.type === AST_NODE_TYPES.ArrowFunctionExpression) return n.body;
			return n;
		}).with({ type: AST_NODE_TYPES.FunctionExpression }, identity).with({ type: AST_NODE_TYPES.Identifier }, (n) => {
			const variableNode = getVariableDefinitionNode(findVariable(n.name, scope), 0);
			if (variableNode?.type !== AST_NODE_TYPES.ArrowFunctionExpression && variableNode?.type !== AST_NODE_TYPES.FunctionExpression) return null;
			return variableNode;
		}).otherwise(() => null);
		if (arg0Node == null) return;
		if (!getChildScopes(context.sourceCode.getScope(arg0Node)).flatMap((x) => x.references).some((x) => x.resolved?.scope.block === component)) {
			context.report({
				messageId: "default",
				node
			});
			return;
		}
		report(context)(checkForUsageInsideUseEffectReport);
	} };
}
function checkForUsageInsideUseEffect(sourceCode, node) {
	if (!/use\w*Effect/u.test(sourceCode.text)) return;
	if (!isVariableDeclarator(node.parent)) return;
	if (!isIdentifier(node.parent.id)) return;
	const usages = (sourceCode.getDeclaredVariables(node.parent)[0]?.references ?? []).filter((ref) => ref.init !== true);
	if (usages.length === 0) return;
	const effectSet = /* @__PURE__ */ new Set();
	for (const usage of usages) {
		const effect = ast.findParentNode(usage.identifier, core.isUseEffectLikeCall);
		if (effect == null) return;
		effectSet.add(effect);
		if (effectSet.size > 1) return;
	}
	return {
		messageId: "noUnnecessaryUseMemoInsideUseEffect",
		node,
		data: { name: node.parent.id.name }
	};
}

//#endregion
//#region src/rules/no-unnecessary-use-prefix.ts
const RULE_NAME$20 = "no-unnecessary-use-prefix";
const WELL_KNOWN_HOOKS = ["useMDXComponents"];
function containsUseComments(context, node) {
	return context.sourceCode.getCommentsInside(node).some(({ value }) => /use\([\s\S]*?\)/u.test(value) || /use[A-Z0-9]\w*\([\s\S]*?\)/u.test(value));
}
var no_unnecessary_use_prefix_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Enforces that a function with the 'use' prefix uses at least one Hook inside it." },
		messages: { default: "If your function doesn't call any Hooks, avoid the 'use' prefix. Instead, write it as a regular function without the 'use' prefix." },
		schema: []
	},
	name: RULE_NAME$20,
	create: create$20,
	defaultOptions: []
});
function create$20(context) {
	const { ctx, visitor } = core.useHookCollector(context);
	return defineRuleListener(visitor, { "Program:exit"(program) {
		for (const { id, name, node, hookCalls } of ctx.getAllHooks(program)) {
			if (hookCalls.length > 0) continue;
			if (ast.isFunctionEmpty(node)) continue;
			if (WELL_KNOWN_HOOKS.includes(name)) continue;
			if (containsUseComments(context, node)) continue;
			if (ast.findParentNode(node, ast.isViMockCallback) != null) continue;
			context.report({
				messageId: "default",
				node: id ?? node,
				data: { name }
			});
		}
	} });
}

//#endregion
//#region src/rules/no-unsafe-component-will-mount.ts
const RULE_NAME$19 = "no-unsafe-component-will-mount";
var no_unsafe_component_will_mount_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Warns about the use of 'UNSAFE_componentWillMount' in class components." },
		messages: { default: "Do not use 'UNSAFE_componentWillMount'." },
		schema: []
	},
	name: RULE_NAME$19,
	create: create$19,
	defaultOptions: []
});
function create$19(context) {
	if (!context.sourceCode.text.includes("UNSAFE_componentWillMount")) return {};
	const { ctx, visitor } = core.useComponentCollectorLegacy(context);
	return defineRuleListener(visitor, { "Program:exit"(program) {
		for (const { node: component } of ctx.getAllComponents(program)) {
			const { body } = component.body;
			for (const member of body) if (core.isUnsafeComponentWillMount(member)) context.report({
				messageId: "default",
				node: member
			});
		}
	} });
}

//#endregion
//#region src/rules/no-unsafe-component-will-receive-props.ts
const RULE_NAME$18 = "no-unsafe-component-will-receive-props";
var no_unsafe_component_will_receive_props_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Warns about the use of 'UNSAFE_componentWillReceiveProps' in class components." },
		messages: { default: "Do not use 'UNSAFE_componentWillReceiveProps'." },
		schema: []
	},
	name: RULE_NAME$18,
	create: create$18,
	defaultOptions: []
});
function create$18(context) {
	if (!context.sourceCode.text.includes("UNSAFE_componentWillReceiveProps")) return {};
	const { ctx, visitor } = core.useComponentCollectorLegacy(context);
	return defineRuleListener(visitor, { "Program:exit"(program) {
		for (const { node: component } of ctx.getAllComponents(program)) {
			const { body } = component.body;
			for (const member of body) if (core.isUnsafeComponentWillReceiveProps(member)) context.report({
				messageId: "default",
				node: member
			});
		}
	} });
}

//#endregion
//#region src/rules/no-unsafe-component-will-update.ts
const RULE_NAME$17 = "no-unsafe-component-will-update";
var no_unsafe_component_will_update_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Warns about the use of 'UNSAFE_componentWillUpdate' in class components." },
		messages: { default: "Do not use 'UNSAFE_componentWillUpdate'." },
		schema: []
	},
	name: RULE_NAME$17,
	create: create$17,
	defaultOptions: []
});
function create$17(context) {
	if (!context.sourceCode.text.includes("UNSAFE_componentWillUpdate")) return {};
	const { ctx, visitor } = core.useComponentCollectorLegacy(context);
	return defineRuleListener(visitor, { "Program:exit"(program) {
		for (const { node: component } of ctx.getAllComponents(program)) {
			const { body } = component.body;
			for (const member of body) if (core.isUnsafeComponentWillUpdate(member)) context.report({
				messageId: "default",
				node: member
			});
		}
	} });
}

//#endregion
//#region src/rules/no-unstable-context-value.ts
const RULE_NAME$16 = "no-unstable-context-value";
var no_unstable_context_value_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Prevents non-stable values (i.e., object literals) from being used as a value for 'Context.Provider'." },
		messages: { unstableContextValue: "A/an '{{kind}}' passed as the value prop to the context provider should not be constructed. It will change on every render. {{suggestion}}" },
		schema: []
	},
	name: RULE_NAME$16,
	create: create$16,
	defaultOptions: []
});
function create$16(context) {
	if (ast.getFileDirectives(context.sourceCode.ast).some((d) => d.directive === "use memo")) return {};
	const { version } = getSettingsFromContext(context);
	const isReact18OrBelow = compare(version, "19.0.0", "<");
	const { ctx, visitor } = core.useComponentCollector(context);
	const constructions = /* @__PURE__ */ new WeakMap();
	return defineRuleListener(visitor, {
		JSXOpeningElement(node) {
			const selfName = core.getJsxElementType(context, node.parent).split(".").at(-1);
			if (selfName == null) return;
			if (!isContextName(selfName, isReact18OrBelow)) return;
			const functionEntry = ctx.getCurrentEntry();
			if (functionEntry == null) return;
			const attribute = node.attributes.find((attribute) => attribute.type === AST_NODE_TYPES.JSXAttribute && attribute.name.name === "value");
			if (attribute == null || !("value" in attribute)) return;
			const value = attribute.value;
			if (value?.type !== AST_NODE_TYPES.JSXExpressionContainer) return;
			const valueExpression = value.expression;
			const construction = getObjectType(valueExpression, context.sourceCode.getScope(valueExpression));
			if (construction == null) return;
			if (core.isHookCall(construction.node)) return;
			getOrElseUpdate(constructions, functionEntry.node, () => []).push(construction);
		},
		"Program:exit"(program) {
			for (const { node: component, directives } of ctx.getAllComponents(program)) for (const construction of constructions.get(component) ?? []) {
				if (directives.some((d) => d.directive === "use memo")) return;
				const { kind, node: constructionNode } = construction;
				const suggestion = kind === "function" ? "Consider wrapping it in a useCallback hook." : "Consider wrapping it in a useMemo hook.";
				context.report({
					messageId: "unstableContextValue",
					node: constructionNode,
					data: {
						kind: ast.getHumanReadableKind(constructionNode),
						suggestion
					}
				});
			}
		}
	});
}
function isContextName(name, isReact18OrBelow) {
	if (name === "Provider") return true;
	if (!isReact18OrBelow) return name.endsWith("Context") || name.endsWith("CONTEXT");
	return false;
}

//#endregion
//#region src/rules/no-unstable-default-props.ts
const RULE_NAME$15 = "no-unstable-default-props";
const defaultOptions$2 = [{ safeDefaultProps: [] }];
const schema$1 = [{
	type: "object",
	additionalProperties: false,
	properties: { safeDefaultProps: {
		type: "array",
		items: { type: "string" }
	} }
}];
var no_unstable_default_props_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Prevents using referential-type values as default props in object destructuring." },
		messages: { default: "A/an '{{kind}}' as default prop. This could lead to potential infinite render loop in React. Use a variable instead of '{{kind}}'." },
		schema: schema$1
	},
	name: RULE_NAME$15,
	create: create$15,
	defaultOptions: defaultOptions$2
});
function extractIdentifier(node) {
	if (node.type === AST_NODE_TYPES.NewExpression && node.callee.type === AST_NODE_TYPES.Identifier) return node.callee.name;
	if (node.type === AST_NODE_TYPES.CallExpression && node.callee.type === AST_NODE_TYPES.MemberExpression) {
		const { object } = node.callee;
		if (object.type === AST_NODE_TYPES.Identifier) return object.name;
	}
	return null;
}
function create$15(context, [options]) {
	if (ast.getFileDirectives(context.sourceCode.ast).some((d) => d.directive === "use memo")) return {};
	const { ctx, visitor } = core.useComponentCollector(context);
	const declarators = /* @__PURE__ */ new WeakMap();
	const { safeDefaultProps = [] } = options;
	const safePatterns = safeDefaultProps.map((s) => toRegExp(s));
	return defineRuleListener(visitor, {
		[ast.SEL_OBJECT_DESTRUCTURING_VARIABLE_DECLARATOR](node) {
			const functionEntry = ctx.getCurrentEntry();
			if (functionEntry == null) return;
			getOrElseUpdate(declarators, functionEntry.node, () => []).push(node);
		},
		"Program:exit"(program) {
			for (const { node: component } of ctx.getAllComponents(program)) {
				const { params } = component;
				const [props] = params;
				if (props == null) continue;
				const properties = match(props).with({ type: AST_NODE_TYPES.ObjectPattern }, ({ properties }) => properties).with({ type: AST_NODE_TYPES.Identifier }, ({ name }) => {
					return declarators.get(component)?.filter((d) => d.init.name === name).flatMap((d) => d.id.properties) ?? [];
				}).otherwise(() => []);
				for (const prop of properties) {
					if (prop.type !== AST_NODE_TYPES.Property || prop.value.type !== AST_NODE_TYPES.AssignmentPattern) continue;
					const { value } = prop;
					const { right } = value;
					const construction = getObjectType(value, context.sourceCode.getScope(value));
					if (construction == null) continue;
					if (core.isHookCall(construction.node)) continue;
					if (safePatterns.length > 0) {
						const identifier = extractIdentifier(right);
						if (identifier != null && safePatterns.some((pattern) => pattern.test(identifier))) continue;
					}
					context.report({
						messageId: "default",
						node: right,
						data: { kind: ast.getHumanReadableKind(right) }
					});
				}
			}
		}
	});
}

//#endregion
//#region src/rules/no-unused-class-component-members.ts
const RULE_NAME$14 = "no-unused-class-component-members";
const LIFECYCLE_METHODS = new Set([
	"componentDidCatch",
	"componentDidMount",
	"componentDidUpdate",
	"componentWillMount",
	"componentWillReceiveProps",
	"componentWillUnmount",
	"componentWillUpdate",
	"constructor",
	"getSnapshotBeforeUpdate",
	"render",
	"shouldComponentUpdate",
	"state",
	"UNSAFE_componentWillMount",
	"UNSAFE_componentWillReceiveProps",
	"UNSAFE_componentWillUpdate"
]);
function isKeyLiteral$1(node, key) {
	return match(key).with({ type: AST_NODE_TYPES.Literal }, constTrue).with({
		type: AST_NODE_TYPES.TemplateLiteral,
		expressions: []
	}, constTrue).with({ type: AST_NODE_TYPES.Identifier }, () => !node.computed).otherwise(constFalse);
}
var no_unused_class_component_members_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Warns about unused class component methods and properties." },
		messages: { default: "Unused method or property '{{methodName}}'' of class '{{className}}'." },
		schema: []
	},
	name: RULE_NAME$14,
	create: create$14,
	defaultOptions: []
});
function create$14(context) {
	const classStack = [];
	const methodStack = [];
	const propertyDefs = /* @__PURE__ */ new WeakMap();
	const propertyUsages = /* @__PURE__ */ new WeakMap();
	function classEnter(node) {
		classStack.push(node);
		if (!core.isClassComponent(node)) return;
		propertyDefs.set(node, /* @__PURE__ */ new Set());
		propertyUsages.set(node, /* @__PURE__ */ new Set());
	}
	function classExit() {
		const currentClass = classStack.pop();
		if (currentClass == null || !core.isClassComponent(currentClass)) return;
		const id = ast.getClassId(currentClass);
		const defs = propertyDefs.get(currentClass);
		const usages = propertyUsages.get(currentClass);
		if (defs == null) return;
		for (const def of defs) {
			const methodName = ast.getPropertyName(def);
			if (methodName == null) continue;
			if ((usages?.has(methodName) ?? false) || LIFECYCLE_METHODS.has(methodName)) continue;
			context.report({
				messageId: "default",
				node: def,
				data: {
					className: id != null ? context.sourceCode.getText(id) : "Component",
					methodName
				}
			});
		}
	}
	function methodEnter(node) {
		methodStack.push(node);
		const currentClass = classStack.at(-1);
		if (currentClass == null || !core.isClassComponent(currentClass)) return;
		if (node.static) return;
		if (isKeyLiteral$1(node, node.key)) propertyDefs.get(currentClass)?.add(node.key);
	}
	function methodExit() {
		methodStack.pop();
	}
	return {
		ClassDeclaration: classEnter,
		"ClassDeclaration:exit": classExit,
		ClassExpression: classEnter,
		"ClassExpression:exit": classExit,
		MemberExpression(node) {
			const currentClass = classStack.at(-1);
			const currentMethod = methodStack.at(-1);
			if (currentClass == null || currentMethod == null) return;
			if (!core.isClassComponent(currentClass) || currentMethod.static) return;
			if (!ast.isThisExpressionLoose(node.object) || !isKeyLiteral$1(node, node.property)) return;
			if (node.parent.type === AST_NODE_TYPES.AssignmentExpression && node.parent.left === node) {
				propertyDefs.get(currentClass)?.add(node.property);
				return;
			}
			const propertyName = ast.getPropertyName(node.property);
			if (propertyName != null) propertyUsages.get(currentClass)?.add(propertyName);
		},
		MethodDefinition: methodEnter,
		"MethodDefinition:exit": methodExit,
		PropertyDefinition: methodEnter,
		"PropertyDefinition:exit": methodExit,
		VariableDeclarator(node) {
			const currentClass = classStack.at(-1);
			const currentMethod = methodStack.at(-1);
			if (currentClass == null || currentMethod == null) return;
			if (!core.isClassComponent(currentClass) || currentMethod.static) return;
			if (node.init != null && ast.isThisExpressionLoose(node.init) && node.id.type === AST_NODE_TYPES.ObjectPattern) {
				for (const prop of node.id.properties) if (prop.type === AST_NODE_TYPES.Property && isKeyLiteral$1(prop, prop.key)) {
					const keyName = ast.getPropertyName(prop.key);
					if (keyName != null) propertyUsages.get(currentClass)?.add(keyName);
				}
			}
		}
	};
}

//#endregion
//#region src/rules/no-unused-props.ts
const RULE_NAME$13 = "no-unused-props";
var no_unused_props_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Warns about component props that are defined but never used." },
		messages: { default: "Prop `{{name}}` is declared but never used" },
		schema: []
	},
	name: RULE_NAME$13,
	create: create$13,
	defaultOptions: []
});
function create$13(context) {
	const services = ESLintUtils.getParserServices(context, false);
	const { ctx, visitor } = core.useComponentCollector(context);
	return defineRuleListener(visitor, { "Program:exit"(program) {
		const checker = services.program.getTypeChecker();
		const totalDeclaredProps = /* @__PURE__ */ new Set();
		const totalUsedProps = /* @__PURE__ */ new Set();
		for (const component of ctx.getAllComponents(program)) {
			const [props] = component.node.params;
			if (props == null) continue;
			const usedPropKeys = /* @__PURE__ */ new Set();
			if (!collectUsedPropKeysOfParameter(context, usedPropKeys, props)) continue;
			const tsNode = services.esTreeNodeToTSNodeMap.get(props);
			const declaredProps = checker.getTypeAtLocation(tsNode).getProperties();
			for (const declaredProp of declaredProps) {
				totalDeclaredProps.add(declaredProp);
				if (usedPropKeys.has(declaredProp.name)) totalUsedProps.add(declaredProp);
			}
		}
		const unusedProps = [...totalDeclaredProps].filter((x) => !totalUsedProps.has(x));
		for (const unusedProp of unusedProps) reportUnusedProp(context, services, unusedProp);
	} });
}
function collectUsedPropKeysOfParameter(context, usedPropKeys, parameter) {
	switch (parameter.type) {
		case AST_NODE_TYPES.Identifier: return collectUsedPropKeysOfIdentifier(context, usedPropKeys, parameter);
		case AST_NODE_TYPES.ObjectPattern: return collectUsedPropKeysOfObjectPattern(context, usedPropKeys, parameter);
		default: return false;
	}
}
function collectUsedPropKeysOfObjectPattern(context, usedPropKeys, objectPattern) {
	for (const property of objectPattern.properties) switch (property.type) {
		case AST_NODE_TYPES.Property: {
			const key = getKeyOfExpression(property.key);
			if (key == null) return false;
			usedPropKeys.add(key);
			break;
		}
		case AST_NODE_TYPES.RestElement:
			if (!collectUsedPropsOfRestElement(context, usedPropKeys, property)) return false;
			break;
	}
	return true;
}
function collectUsedPropsOfRestElement(context, usedPropKeys, restElement) {
	switch (restElement.argument.type) {
		case AST_NODE_TYPES.Identifier: return collectUsedPropKeysOfIdentifier(context, usedPropKeys, restElement.argument);
		default: return false;
	}
}
function collectUsedPropKeysOfIdentifier(context, usedPropKeys, identifier) {
	const variable = context.sourceCode.getScope(identifier).variables.find((v) => v.name === identifier.name);
	if (variable == null) return false;
	for (const ref of variable.references) {
		if (ref.identifier === identifier) continue;
		if (!collectUsedPropKeysOfReference(context, usedPropKeys, identifier, ref)) return false;
	}
	return true;
}
function collectUsedPropKeysOfReference(context, usedPropKeys, identifier, ref) {
	const { parent } = ref.identifier;
	switch (parent.type) {
		case AST_NODE_TYPES.MemberExpression:
			if (parent.object.type === AST_NODE_TYPES.Identifier && parent.object.name === identifier.name) {
				const key = getKeyOfExpression(parent.property);
				if (key == null) return false;
				usedPropKeys.add(key);
				return true;
			}
			break;
		case AST_NODE_TYPES.VariableDeclarator:
			if (parent.id.type === AST_NODE_TYPES.ObjectPattern && parent.init === ref.identifier) return collectUsedPropKeysOfObjectPattern(context, usedPropKeys, parent.id);
			break;
	}
	return false;
}
function getKeyOfExpression(expr) {
	switch (expr.type) {
		case AST_NODE_TYPES.Identifier: return expr.name;
		case AST_NODE_TYPES.Literal: if (typeof expr.value === "string") return expr.value;
	}
	return null;
}
function reportUnusedProp(context, services, prop) {
	const declaration = prop.getDeclarations()?.[0];
	if (declaration == null) return;
	const declarationNode = services.tsNodeToESTreeNodeMap.get(declaration);
	if (declarationNode == null) return;
	const nodeToReport = declarationNode.type === AST_NODE_TYPES.TSPropertySignature ? declarationNode.key : declarationNode;
	context.report({
		messageId: "default",
		node: nodeToReport,
		data: { name: prop.name }
	});
}

//#endregion
//#region src/rules/no-unused-state.ts
const RULE_NAME$12 = "no-unused-state";
function isKeyLiteral(node, key) {
	return match(key).with({ type: AST_NODE_TYPES.Literal }, constTrue).with({
		type: AST_NODE_TYPES.TemplateLiteral,
		expressions: []
	}, constTrue).with({ type: AST_NODE_TYPES.Identifier }, () => !node.computed).otherwise(constFalse);
}
var no_unused_state_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Warns about unused class component state." },
		messages: { default: "Unused class component state in '{{className}}'" },
		schema: []
	},
	name: RULE_NAME$12,
	create: create$12,
	defaultOptions: []
});
function create$12(context) {
	const classStack = [];
	const methodStack = [];
	const constructorStack = [];
	const stateDefs = /* @__PURE__ */ new WeakMap();
	function classEnter(node) {
		classStack.push(node);
	}
	function classExit() {
		const currentClass = classStack.pop();
		if (currentClass == null || !core.isClassComponent(currentClass)) return;
		const id = ast.getClassId(currentClass);
		const { node: defNode, isUsed = false } = stateDefs.get(currentClass) ?? {};
		if (defNode == null || isUsed) return;
		context.report({
			messageId: "default",
			node: defNode,
			data: { className: id != null ? context.sourceCode.getText(id) : "Component" }
		});
	}
	function methodEnter(node) {
		methodStack.push(node);
		const currentClass = classStack.at(-1);
		if (currentClass == null || !core.isClassComponent(currentClass)) return;
		if (node.static) {
			if (core.isGetDerivedStateFromProps(node) && isMatching({ params: [P.nonNullable, ...P.array()] })(node.value)) {
				const defNode = stateDefs.get(currentClass)?.node;
				stateDefs.set(currentClass, {
					node: defNode,
					isUsed: true
				});
			}
			return;
		}
		if (ast.getPropertyName(node.key) === "state") stateDefs.set(currentClass, {
			node: node.key,
			isUsed: false
		});
	}
	function methodExit() {
		methodStack.pop();
	}
	function constructorEnter(node) {
		constructorStack.push(node);
	}
	function constructorExit() {
		constructorStack.pop();
	}
	return {
		AssignmentExpression(node) {
			if (!core.isAssignmentToThisState(node)) return;
			const currentClass = classStack.at(-1);
			if (currentClass == null || !core.isClassComponent(currentClass)) return;
			const currentConstructor = constructorStack.at(-1);
			if (currentConstructor == null || !currentClass.body.body.includes(currentConstructor)) return;
			const isUsed = stateDefs.get(currentClass)?.isUsed ?? false;
			stateDefs.set(currentClass, {
				node: node.left,
				isUsed
			});
		},
		ClassDeclaration: classEnter,
		"ClassDeclaration:exit": classExit,
		ClassExpression: classEnter,
		"ClassExpression:exit": classExit,
		MemberExpression(node) {
			if (!ast.isThisExpressionLoose(node.object)) return;
			if (ast.getPropertyName(node.property) !== "state") return;
			const currentClass = classStack.at(-1);
			if (currentClass == null || !core.isClassComponent(currentClass)) return;
			const currentMethod = methodStack.at(-1);
			if (currentMethod == null || currentMethod.static) return;
			if (currentMethod === constructorStack.at(-1)) return;
			if (!currentClass.body.body.includes(currentMethod)) return;
			const defNode = stateDefs.get(currentClass)?.node;
			stateDefs.set(currentClass, {
				node: defNode,
				isUsed: true
			});
		},
		MethodDefinition: methodEnter,
		"MethodDefinition:exit": methodExit,
		"MethodDefinition[key.name='constructor']": constructorEnter,
		"MethodDefinition[key.name='constructor']:exit": constructorExit,
		PropertyDefinition: methodEnter,
		"PropertyDefinition:exit": methodExit,
		VariableDeclarator(node) {
			const currentClass = classStack.at(-1);
			if (currentClass == null || !core.isClassComponent(currentClass)) return;
			const currentMethod = methodStack.at(-1);
			if (currentMethod == null || currentMethod.static) return;
			if (currentMethod === constructorStack.at(-1)) return;
			if (!currentClass.body.body.includes(currentMethod)) return;
			if (node.init == null || !ast.isThisExpressionLoose(node.init) || node.id.type !== AST_NODE_TYPES.ObjectPattern) return;
			if (!node.id.properties.some((prop) => {
				if (prop.type === AST_NODE_TYPES.Property && isKeyLiteral(prop, prop.key)) return ast.getPropertyName(prop.key) === "state";
				return false;
			})) return;
			const defNode = stateDefs.get(currentClass)?.node;
			stateDefs.set(currentClass, {
				node: defNode,
				isUsed: true
			});
		}
	};
}

//#endregion
//#region src/rules/no-use-context.ts
const RULE_NAME$11 = "no-use-context";
var no_use_context_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Replaces usage of 'useContext' with 'use'." },
		fixable: "code",
		messages: { default: "In React 19, 'use' is preferred over 'useContext' because it is more flexible." },
		schema: []
	},
	name: RULE_NAME$11,
	create: create$11,
	defaultOptions: []
});
function create$11(context) {
	if (!context.sourceCode.text.includes("useContext")) return {};
	const settings = getSettingsFromContext(context);
	if (compare(settings.version, "19.0.0", "<")) return {};
	const hookCalls = /* @__PURE__ */ new Set();
	return {
		CallExpression(node) {
			if (!core.isHookCall(node)) return;
			hookCalls.add(node);
		},
		ImportDeclaration(node) {
			if (node.source.value !== settings.importSource) return;
			const isUseImported = node.specifiers.some(isMatching({ local: {
				type: AST_NODE_TYPES.Identifier,
				name: "use"
			} }));
			for (const specifier of node.specifiers) {
				if (specifier.type !== AST_NODE_TYPES.ImportSpecifier) continue;
				if (specifier.imported.type !== AST_NODE_TYPES.Identifier) continue;
				if (specifier.imported.name === "useContext") context.report({
					messageId: "default",
					node: specifier,
					fix(fixer) {
						if (isUseImported) {
							const tokenBefore = context.sourceCode.getTokenBefore(specifier);
							return [
								fixer.remove(specifier),
								...tokenBefore?.value === "," ? [fixer.replaceTextRange([tokenBefore.range[1], specifier.range[0]], "")] : [],
								...getCorrelativeTokens(context, specifier).map((token) => fixer.remove(token))
							];
						}
						return fixer.replaceText(specifier.imported, "use");
					}
				});
			}
		},
		"Program:exit"() {
			for (const node of hookCalls) {
				if (!core.isUseContextCall(node)) continue;
				context.report({
					messageId: "default",
					node: node.callee,
					fix(fixer) {
						switch (node.callee.type) {
							case AST_NODE_TYPES.Identifier: return fixer.replaceText(node.callee, "use");
							case AST_NODE_TYPES.MemberExpression: return fixer.replaceText(node.callee.property, "use");
						}
						return null;
					}
				});
			}
		}
	};
}
function getCorrelativeTokens(context, node) {
	const tokenBefore = context.sourceCode.getTokenBefore(node);
	const tokenAfter = context.sourceCode.getTokenAfter(node);
	const tokens = [];
	if (tokenAfter?.value !== "," && tokenBefore?.value === ",") tokens.push(tokenBefore);
	if (tokenAfter?.value === ",") tokens.push(tokenAfter);
	return tokens;
}

//#endregion
//#region src/rules/no-useless-forward-ref.ts
const RULE_NAME$10 = "no-useless-forward-ref";
var no_useless_forward_ref_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Disallows useless 'forwardRef' calls on components that don't use 'ref's." },
		messages: { default: "A 'forwardRef' is used with this component but no 'ref' parameter is set." },
		schema: []
	},
	name: RULE_NAME$10,
	create: create$10,
	defaultOptions: []
});
function create$10(context) {
	return { CallExpression(node) {
		if (!core.isForwardRefCall(context, node)) return;
		const [component] = node.arguments;
		if (component == null || !ast.isFunction(component)) return;
		if (component.params[1] != null) return;
		context.report({
			messageId: "default",
			node: node.callee
		});
	} };
}

//#endregion
//#region src/rules/no-useless-fragment.ts
const RULE_NAME$9 = "no-useless-fragment";
const defaultOptions$1 = [{
	allowEmptyFragment: false,
	allowExpressions: true
}];
const schema = [{
	type: "object",
	additionalProperties: false,
	properties: {
		allowEmptyFragment: {
			type: "boolean",
			description: "Allow empty fragments"
		},
		allowExpressions: {
			type: "boolean",
			description: "Allow fragments with a single expression child"
		}
	}
}];
var no_useless_fragment_default = createRule({
	meta: {
		type: "problem",
		defaultOptions: [...defaultOptions$1],
		docs: { description: "Disallows useless fragment elements." },
		fixable: "code",
		messages: { default: "A fragment {{reason}} is useless." },
		schema
	},
	name: RULE_NAME$9,
	create: create$9,
	defaultOptions: defaultOptions$1
});
function create$9(context, [option]) {
	const { allowEmptyFragment = false, allowExpressions = true } = option;
	const jsxConfig = {
		...core.getJsxConfigFromContext(context),
		...core.getJsxConfigFromAnnotation(context)
	};
	/**
	* Check if a fragment node is useless and should be reported
	*/
	function checkNode(context, node) {
		if (node.type === AST_NODE_TYPES.JSXElement && core.getJsxAttribute(context, node)("key") != null) return;
		if (core.isJsxHostElement(context, node.parent)) context.report({
			messageId: "default",
			node,
			data: { reason: "placed inside a host component" },
			fix: getFix(context, node)
		});
		if (node.children.length === 0) {
			if (allowEmptyFragment) return;
			context.report({
				messageId: "default",
				node,
				data: { reason: "contains less than two children" },
				fix: getFix(context, node)
			});
			return;
		}
		const isChildElement = ast.isOneOf([AST_NODE_TYPES.JSXElement, AST_NODE_TYPES.JSXFragment])(node.parent);
		switch (true) {
			case allowExpressions && !isChildElement && node.children.length === 1 && core.isJsxText(node.children.at(0)): return;
			case !allowExpressions && isChildElement:
				context.report({
					messageId: "default",
					node,
					data: { reason: "contains less than two children" },
					fix: getFix(context, node)
				});
				return;
			case !allowExpressions && !isChildElement && node.children.length === 1:
				context.report({
					messageId: "default",
					node,
					data: { reason: "contains less than two children" },
					fix: getFix(context, node)
				});
				return;
		}
		const nonPaddingChildren = node.children.filter((child) => !isPaddingSpaces(child));
		const firstNonPaddingChild = nonPaddingChildren.at(0);
		if (nonPaddingChildren.length === 0 || nonPaddingChildren.length === 1 && firstNonPaddingChild?.type !== AST_NODE_TYPES.JSXExpressionContainer) context.report({
			messageId: "default",
			node,
			data: { reason: "contains less than two children" },
			fix: getFix(context, node)
		});
	}
	function getFix(context, node) {
		if (!canFix(context, node)) return null;
		return (fixer) => {
			const opener = node.type === AST_NODE_TYPES.JSXFragment ? node.openingFragment : node.openingElement;
			const closer = node.type === AST_NODE_TYPES.JSXFragment ? node.closingFragment : node.closingElement;
			const childrenText = opener.type === AST_NODE_TYPES.JSXOpeningElement && opener.selfClosing ? "" : context.sourceCode.getText().slice(opener.range[1], closer?.range[0]);
			return fixer.replaceText(node, trimLikeReact(childrenText));
		};
	}
	/**
	* Check if it's safe to automatically fix the fragment
	*/
	function canFix(context, node) {
		if (node.parent.type === AST_NODE_TYPES.JSXElement || node.parent.type === AST_NODE_TYPES.JSXFragment) return core.isJsxHostElement(context, node.parent);
		if (node.children.length === 0) return false;
		return !node.children.some((child) => core.isJsxText(child) && !isWhiteSpace(child) || ast.is(AST_NODE_TYPES.JSXExpressionContainer)(child));
	}
	return {
		JSXElement(node) {
			if (!core.isJsxFragmentElement(context, node, jsxConfig)) return;
			checkNode(context, node);
		},
		JSXFragment(node) {
			checkNode(context, node);
		}
	};
}
/**
* Check if a Literal or JSXText node is whitespace
*/
function isWhiteSpace(node) {
	return typeof node.value === "string" && node.raw.trim() === "";
}
/**
* Check if a node is padding spaces (whitespace with line breaks)
*/
function isPaddingSpaces(node) {
	return core.isJsxText(node) && isWhiteSpace(node) && node.raw.includes("\n");
}
/**
* Trim whitespace like React would in JSX
*/
function trimLikeReact(text) {
	const leadingSpaces = /^\s*/.exec(text)?.[0] ?? "";
	const trailingSpaces = /\s*$/.exec(text)?.[0] ?? "";
	const start = leadingSpaces.includes("\n") ? leadingSpaces.length : 0;
	const end = trailingSpaces.includes("\n") ? text.length - trailingSpaces.length : text.length;
	return text.slice(start, end);
}

//#endregion
//#region src/rules/prefer-destructuring-assignment.ts
const RULE_NAME$8 = "prefer-destructuring-assignment";
var prefer_destructuring_assignment_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Enforces destructuring assignment for component props and context." },
		messages: { default: "Use destructuring assignment for component props." },
		schema: []
	},
	name: RULE_NAME$8,
	create: create$8,
	defaultOptions: []
});
function create$8(context) {
	const { ctx, visitor } = core.useComponentCollector(context);
	return defineRuleListener(visitor, { "Program:exit"(program) {
		for (const component of ctx.getAllComponents(program)) {
			if (component.name == null || component.isExportDefaultDeclaration) continue;
			const [props] = component.node.params;
			if (props == null) continue;
			if (props.type !== AST_NODE_TYPES.Identifier) continue;
			const propName = props.name;
			const propReferences = context.sourceCode.getScope(component.node).variables.find((v) => v.name === propName)?.references ?? [];
			for (const ref of propReferences) {
				const { parent } = ref.identifier;
				if (parent.type !== AST_NODE_TYPES.MemberExpression) continue;
				context.report({
					messageId: "default",
					node: parent
				});
			}
		}
	} });
}

//#endregion
//#region src/rules/prefer-namespace-import.ts
const RULE_NAME$7 = "prefer-namespace-import";
var prefer_namespace_import_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Enforces importing React via a namespace import." },
		fixable: "code",
		messages: { default: "Prefer importing React as 'import * as React from \"{{importSource}}\"';" },
		schema: []
	},
	name: RULE_NAME$7,
	create: create$7,
	defaultOptions: []
});
function create$7(context) {
	const { importSource } = getSettingsFromContext(context);
	return { [`ImportDeclaration[source.value="${importSource}"] ImportDefaultSpecifier`](node) {
		const hasOtherSpecifiers = node.parent.specifiers.length > 1;
		context.report({
			messageId: "default",
			node: hasOtherSpecifiers ? node : node.parent,
			data: { importSource },
			fix(fixer) {
				const importDeclarationText = context.sourceCode.getText(node.parent);
				const semi = importDeclarationText.endsWith(";") ? ";" : "";
				const quote = node.parent.source.raw.at(0) ?? "'";
				const importStringPrefix = `import${node.parent.importKind === "type" ? " type" : ""}`;
				const importSourceQuoted = `${quote}${importSource}${quote}`;
				if (!hasOtherSpecifiers) return fixer.replaceText(node.parent, `${importStringPrefix} * as ${node.local.name} from ${importSourceQuoted}${semi}`);
				const specifiers = importDeclarationText.slice(importDeclarationText.indexOf("{"), importDeclarationText.indexOf("}") + 1);
				return fixer.replaceText(node.parent, [`${importStringPrefix} * as ${node.local.name} from ${importSourceQuoted}${semi}`, `${importStringPrefix} ${specifiers} from ${importSourceQuoted}${semi}`].join("\n"));
			}
		});
	} };
}

//#endregion
//#region src/rules/prefer-read-only-props.ts
const RULE_NAME$6 = "prefer-read-only-props";
var prefer_read_only_props_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Enforces read-only props in components." },
		messages: { default: "A function component's props should be read-only." },
		schema: []
	},
	name: RULE_NAME$6,
	create: create$6,
	defaultOptions: []
});
function create$6(context) {
	const services = ESLintUtils.getParserServices(context, false);
	const checker = services.program.getTypeChecker();
	const { ctx, visitor } = core.useComponentCollector(context);
	return defineRuleListener(visitor, { "Program:exit"(program) {
		for (const component of ctx.getAllComponents(program)) {
			const [props] = component.node.params;
			if (component.id == null || component.name == null) continue;
			if (props == null) continue;
			const propsType = getConstrainedTypeAtLocation(services, props);
			if (isTypeReadonly(services.program, propsType)) continue;
			if (isTypeReadonlyLoose(services, propsType)) continue;
			if (propsType.isClassOrInterface() && isClassOrInterfaceReadonlyLoose(checker, propsType)) continue;
			context.report({
				messageId: "default",
				node: props
			});
		}
	} });
}
function isTypeReadonlyLoose(services, type) {
	try {
		const im = getTypeImmutability(services.program, type);
		return isUnknown(im) || isImmutable(im) || isReadonlyShallow(im) || isReadonlyDeep(im);
	} catch {
		return true;
	}
}
function isClassOrInterfaceReadonlyLoose(checker, type) {
	const props = type.getProperties();
	const types = type.getBaseTypes() ?? [];
	if (props.length === 0) return true;
	if (types.length === 0) return props.every((p) => isPropertyReadonlyInType(type, p.getEscapedName(), checker));
	return props.every((p) => {
		if (isPropertyReadonlyInType(type, p.getEscapedName(), checker)) return true;
		return types.every((t) => isPropertyReadonlyInType(t, p.getEscapedName(), checker));
	});
}

//#endregion
//#region src/rules/prefer-use-state-lazy-initialization.ts
const RULE_NAME$5 = "prefer-use-state-lazy-initialization";
const ALLOW_LIST = [
	"Boolean",
	"String",
	"Number"
];
var prefer_use_state_lazy_initialization_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Enforces wrapping function calls made inside 'useState' in an 'initializer function'." },
		messages: { default: "To prevent re-computation, consider using lazy initial state for useState calls that involve function calls. Ex: 'useState(() => getValue())'." },
		schema: []
	},
	name: RULE_NAME$5,
	create: create$5,
	defaultOptions: []
});
function create$5(context) {
	return { CallExpression(node) {
		if (!core.isUseStateCall(node)) return;
		const [useStateInput] = node.arguments;
		if (useStateInput == null) return;
		for (const expr of ast.getNestedNewExpressions(useStateInput)) {
			if (!("name" in expr.callee)) continue;
			if (ALLOW_LIST.includes(expr.callee.name)) continue;
			if (ast.findParentNode(expr, core.isUseCall) != null) continue;
			context.report({
				messageId: "default",
				node: expr
			});
		}
		for (const expr of ast.getNestedCallExpressions(useStateInput)) {
			if (!("name" in expr.callee)) continue;
			if (core.isHookName(expr.callee.name)) continue;
			if (ALLOW_LIST.includes(expr.callee.name)) continue;
			if (ast.findParentNode(expr, core.isUseCall) != null) continue;
			context.report({
				messageId: "default",
				node: expr
			});
		}
	} };
}

//#endregion
//#region src/rules-removed/no-default-props.ts
const RULE_NAME$4 = "no-default-props";
var no_default_props_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Disallows the 'defaultProps' property in favor of ES6 default parameters." },
		messages: { default: "[Deprecated] Use ES6 default parameters instead." },
		schema: []
	},
	name: RULE_NAME$4,
	create: create$4,
	defaultOptions: []
});
function create$4(context) {
	if (!context.sourceCode.text.includes("defaultProps")) return {};
	return { AssignmentExpression(node) {
		if (node.operator !== "=" || node.left.type !== AST_NODE_TYPES.MemberExpression) return;
		const { object, property } = node.left;
		if (object.type !== AST_NODE_TYPES.Identifier) return;
		if (property.type !== AST_NODE_TYPES.Identifier || property.name !== "defaultProps") return;
		if (!core.isComponentNameLoose(object.name)) return;
		const variableNode = getVariableDefinitionNode(findVariable(object.name, context.sourceCode.getScope(node)), 0);
		if (variableNode == null) return;
		if (!ast.isFunction(variableNode)) return;
		context.report({
			messageId: "default",
			node: property
		});
	} };
}

//#endregion
//#region src/rules-removed/no-forbidden-props.ts
const RULE_NAME$3 = "no-forbidden-props";
const defaultOptions = [{ forbid: [{ prop: "/_/" }] }];
var no_forbidden_props_default = createRule({
	meta: {
		type: "problem",
		defaultOptions: [...defaultOptions],
		deprecated: {
			deprecatedSince: "2.3.2",
			message: "This rule is deprecated and will be removed in future versions.",
			replacedBy: [{ rule: {
				name: "no-restricted-syntax",
				url: "https://eslint.org/docs/latest/rules/no-restricted-syntax"
			} }]
		},
		docs: { description: "Disallows certain props on components." },
		messages: { default: "Prop \"{{name}}\" is forbidden." },
		schema: [{
			type: "object",
			additionalProperties: false,
			properties: { forbid: {
				type: "array",
				items: { anyOf: [
					{ type: "string" },
					{
						type: "object",
						additionalProperties: false,
						properties: {
							excludedNodes: {
								type: "array",
								items: { type: "string" },
								uniqueItems: true
							},
							prop: { type: "string" }
						},
						required: ["prop"]
					},
					{
						type: "object",
						additionalProperties: false,
						properties: {
							includedNodes: {
								type: "array",
								items: { type: "string" },
								uniqueItems: true
							},
							prop: { type: "string" }
						},
						required: ["prop"]
					}
				] }
			} }
		}]
	},
	name: RULE_NAME$3,
	create: create$3,
	defaultOptions
});
function create$3(context, [option]) {
	const { forbid } = option;
	return { JSXOpeningElement(node) {
		let nodeName = null;
		if (node.name.type === AST_NODE_TYPES.JSXIdentifier) nodeName = node.name.name;
		else if (node.name.type === AST_NODE_TYPES.JSXNamespacedName) nodeName = node.name.name.name;
		for (const attr of node.attributes) {
			if (attr.type === AST_NODE_TYPES.JSXSpreadAttribute) continue;
			const name = attr.name.name;
			if (typeof name !== "string") continue;
			for (const forbiddenPropItem of forbid) {
				if (typeof forbiddenPropItem !== "string" && nodeName != null) {
					if ("excludedNodes" in forbiddenPropItem && forbiddenPropItem.excludedNodes.includes(nodeName)) continue;
					if ("includedNodes" in forbiddenPropItem && !forbiddenPropItem.includedNodes.includes(nodeName)) continue;
				}
				if (toRegExp(typeof forbiddenPropItem === "string" ? forbiddenPropItem : forbiddenPropItem.prop).test(name)) context.report({
					messageId: "default",
					node: attr,
					data: { name }
				});
			}
		}
	} };
}

//#endregion
//#region src/rules-removed/no-prop-types.ts
const RULE_NAME$2 = "no-prop-types";
var no_prop_types_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Disallows 'propTypes' in favor of TypeScript or another type-checking solution." },
		messages: { default: "[Deprecated] Use TypeScript or another type-checking solution instead." },
		schema: []
	},
	name: RULE_NAME$2,
	create: create$2,
	defaultOptions: []
});
function create$2(context) {
	if (!context.sourceCode.text.includes("propTypes")) return {};
	return {
		AssignmentExpression(node) {
			if (node.operator !== "=" || node.left.type !== AST_NODE_TYPES.MemberExpression) return;
			const { object, property } = node.left;
			if (object.type !== AST_NODE_TYPES.Identifier) return;
			if (property.type !== AST_NODE_TYPES.Identifier || property.name !== "propTypes") return;
			if (!core.isComponentNameLoose(object.name)) return;
			const variableNode = getVariableDefinitionNode(findVariable(object.name, context.sourceCode.getScope(node)), 0);
			if (variableNode != null && (ast.isFunction(variableNode) || core.isClassComponent(variableNode))) context.report({
				messageId: "default",
				node: property
			});
		},
		PropertyDefinition(node) {
			if (!core.isClassComponent(node.parent.parent)) return;
			if (!node.static || node.key.type !== AST_NODE_TYPES.Identifier || node.key.name !== "propTypes") return;
			context.report({
				messageId: "default",
				node
			});
		}
	};
}

//#endregion
//#region src/rules-removed/no-string-refs.ts
const RULE_NAME$1 = "no-string-refs";
var no_string_refs_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Replaces string refs with callback refs." },
		fixable: "code",
		messages: { default: "[Deprecated] Use callback refs instead." },
		schema: []
	},
	name: RULE_NAME$1,
	create: create$1,
	defaultOptions: []
});
function create$1(context) {
	const state = { isWithinClassComponent: false };
	function onClassBodyEnter(node) {
		if (core.isClassComponent(node.parent)) state.isWithinClassComponent = true;
	}
	function onClassBodyExit() {
		state.isWithinClassComponent = false;
	}
	return {
		ClassBody: onClassBodyEnter,
		"ClassBody:exit": onClassBodyExit,
		JSXAttribute(node) {
			if (node.name.name !== "ref") return;
			const refName = getJsxAttributeValueText(context, node.value);
			if (refName == null) return;
			context.report({
				messageId: "default",
				node,
				fix(fixer) {
					if (node.value == null) return null;
					if (!state.isWithinClassComponent) return null;
					return fixer.replaceText(node.value, `{(ref) => { this.refs[${refName}] = ref; }}`);
				}
			});
		}
	};
}
/**
* Extracts the text content from a JSX attribute's value
* @param context The rule context
* @param node The JSX attribute value node
* @returns The text of the attribute value, or null if not a string-like value
*/
function getJsxAttributeValueText(context, node) {
	if (node == null) return null;
	switch (true) {
		case node.type === AST_NODE_TYPES.Literal && typeof node.value === "string": return context.sourceCode.getText(node);
		case node.type === AST_NODE_TYPES.JSXExpressionContainer && node.expression.type === AST_NODE_TYPES.Literal && typeof node.expression.value === "string": return context.sourceCode.getText(node.expression);
		case node.type === AST_NODE_TYPES.JSXExpressionContainer && node.expression.type === AST_NODE_TYPES.TemplateLiteral: return context.sourceCode.getText(node.expression);
		default: return null;
	}
}

//#endregion
//#region src/rules-removed/no-unnecessary-use-ref.ts
const RULE_NAME = "no-unnecessary-use-ref";
var no_unnecessary_use_ref_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Disallows unnecessary usage of 'useRef'." },
		messages: { default: "Unnecessary use of 'useRef'. Instead, co-locate the value inside the effect that uses it." },
		schema: []
	},
	name: RULE_NAME,
	create,
	defaultOptions: []
});
function create(context) {
	if (!context.sourceCode.text.includes("useRef")) return {};
	return { VariableDeclarator(node) {
		const { id, init } = node;
		if (id.type !== AST_NODE_TYPES.Identifier || init == null || !core.isUseRefCall(init)) return;
		const [ref, ...rest] = context.sourceCode.getDeclaredVariables(node);
		if (ref == null || rest.length > 0) return;
		if (ref.name.toLowerCase().startsWith("prev")) return;
		const effects = /* @__PURE__ */ new Set();
		let globalUsages = 0;
		for (const { identifier, init } of ref.references) {
			if (init != null) continue;
			const effect = ast.findParentNode(identifier, core.isUseEffectLikeCall);
			if (effect == null) globalUsages++;
			else effects.add(effect);
		}
		if (globalUsages > 0 || effects.size !== 1) return;
		context.report({
			messageId: "default",
			node: node.parent
		});
	} };
}

//#endregion
//#region src/plugin.ts
const plugin = {
	meta: {
		name: name$6,
		version
	},
	rules: {
		"jsx-dollar": jsx_dollar_default,
		"jsx-key-before-spread": jsx_key_before_spread_default,
		"jsx-no-comment-textnodes": jsx_no_comment_textnodes_default,
		"jsx-no-duplicate-props": jsx_no_duplicate_props_default,
		"jsx-no-iife": jsx_no_iife_default,
		"jsx-no-undef": jsx_no_undef_default,
		"jsx-shorthand-boolean": jsx_shorthand_boolean_default,
		"jsx-shorthand-fragment": jsx_shorthand_fragment_default,
		"jsx-uses-react": jsx_uses_react_default,
		"jsx-uses-vars": jsx_uses_vars_default,
		"no-access-state-in-setstate": no_access_state_in_setstate_default,
		"no-array-index-key": no_array_index_key_default,
		"no-children-count": no_children_count_default,
		"no-children-for-each": no_children_for_each_default,
		"no-children-map": no_children_map_default,
		"no-children-only": no_children_only_default,
		"no-children-prop": no_children_prop_default,
		"no-children-to-array": no_children_to_array_default,
		"no-class-component": no_class_component_default,
		"no-clone-element": no_clone_element_default,
		"no-component-will-mount": no_component_will_mount_default,
		"no-component-will-receive-props": no_component_will_receive_props_default,
		"no-component-will-update": no_component_will_update_default,
		"no-context-provider": no_context_provider_default,
		"no-create-ref": no_create_ref_default,
		"no-direct-mutation-state": no_direct_mutation_state_default,
		"no-duplicate-key": no_duplicate_key_default,
		"no-forward-ref": no_forward_ref_default,
		"no-implicit-key": no_implicit_key_default,
		"no-leaked-conditional-rendering": no_leaked_conditional_rendering_default,
		"no-missing-component-display-name": no_missing_component_display_name_default,
		"no-missing-context-display-name": no_missing_context_display_name_default,
		"no-missing-key": no_missing_key_default,
		"no-misused-capture-owner-stack": no_misused_capture_owner_stack_default,
		"no-nested-component-definitions": no_nested_component_definitions_default,
		"no-nested-lazy-component-declarations": no_nested_lazy_component_declarations_default,
		"no-redundant-should-component-update": no_redundant_should_component_update_default,
		"no-set-state-in-component-did-mount": no_set_state_in_component_did_mount_default,
		"no-set-state-in-component-did-update": no_set_state_in_component_did_update_default,
		"no-set-state-in-component-will-update": no_set_state_in_component_will_update_default,
		"no-unnecessary-key": no_unnecessary_key_default,
		"no-unnecessary-use-callback": no_unnecessary_use_callback_default,
		"no-unnecessary-use-memo": no_unnecessary_use_memo_default,
		"no-unnecessary-use-prefix": no_unnecessary_use_prefix_default,
		"no-unsafe-component-will-mount": no_unsafe_component_will_mount_default,
		"no-unsafe-component-will-receive-props": no_unsafe_component_will_receive_props_default,
		"no-unsafe-component-will-update": no_unsafe_component_will_update_default,
		"no-unstable-context-value": no_unstable_context_value_default,
		"no-unstable-default-props": no_unstable_default_props_default,
		"no-unused-class-component-members": no_unused_class_component_members_default,
		"no-unused-props": no_unused_props_default,
		"no-unused-state": no_unused_state_default,
		"no-use-context": no_use_context_default,
		"no-useless-forward-ref": no_useless_forward_ref_default,
		"no-useless-fragment": no_useless_fragment_default,
		"prefer-destructuring-assignment": prefer_destructuring_assignment_default,
		"prefer-namespace-import": prefer_namespace_import_default,
		"prefer-read-only-props": prefer_read_only_props_default,
		"prefer-use-state-lazy-initialization": prefer_use_state_lazy_initialization_default,
		"no-default-props": no_default_props_default,
		"no-forbidden-props": no_forbidden_props_default,
		"no-prop-types": no_prop_types_default,
		"no-string-refs": no_string_refs_default,
		"no-unnecessary-use-ref": no_unnecessary_use_ref_default
	}
};

//#endregion
//#region src/configs/recommended.ts
var recommended_exports = /* @__PURE__ */ __exportAll({
	name: () => name$5,
	plugins: () => plugins$5,
	rules: () => rules$6,
	settings: () => settings$5
});
const name$5 = "react-x/recommended";
const rules$6 = {
	"react-x/jsx-key-before-spread": "warn",
	"react-x/jsx-no-comment-textnodes": "warn",
	"react-x/jsx-no-duplicate-props": "warn",
	"react-x/jsx-uses-react": "warn",
	"react-x/jsx-uses-vars": "warn",
	"react-x/no-access-state-in-setstate": "error",
	"react-x/no-array-index-key": "warn",
	"react-x/no-children-count": "warn",
	"react-x/no-children-for-each": "warn",
	"react-x/no-children-map": "warn",
	"react-x/no-children-only": "warn",
	"react-x/no-children-to-array": "warn",
	"react-x/no-clone-element": "warn",
	"react-x/no-component-will-mount": "error",
	"react-x/no-component-will-receive-props": "error",
	"react-x/no-component-will-update": "error",
	"react-x/no-context-provider": "warn",
	"react-x/no-create-ref": "error",
	"react-x/no-default-props": "error",
	"react-x/no-direct-mutation-state": "error",
	"react-x/no-forward-ref": "warn",
	"react-x/no-missing-key": "error",
	"react-x/no-nested-component-definitions": "error",
	"react-x/no-nested-lazy-component-declarations": "error",
	"react-x/no-prop-types": "error",
	"react-x/no-redundant-should-component-update": "error",
	"react-x/no-set-state-in-component-did-mount": "warn",
	"react-x/no-set-state-in-component-did-update": "warn",
	"react-x/no-set-state-in-component-will-update": "warn",
	"react-x/no-string-refs": "error",
	"react-x/no-unnecessary-use-prefix": "warn",
	"react-x/no-unsafe-component-will-mount": "warn",
	"react-x/no-unsafe-component-will-receive-props": "warn",
	"react-x/no-unsafe-component-will-update": "warn",
	"react-x/no-use-context": "warn",
	"react-x/no-useless-forward-ref": "warn",
	"react-x/prefer-use-state-lazy-initialization": "warn"
};
const plugins$5 = { "react-x": plugin };
const settings$5 = { "react-x": DEFAULT_ESLINT_REACT_SETTINGS };

//#endregion
//#region src/configs/_ts.ts
/**
* Disables rules that are already handled by TypeScript
*/
const rules$5 = {
	"react-x/jsx-no-duplicate-props": "off",
	"react-x/jsx-no-undef": "off",
	"react-x/jsx-uses-react": "off",
	"react-x/jsx-uses-vars": "off"
};

//#endregion
//#region src/configs/recommended-typescript.ts
var recommended_typescript_exports = /* @__PURE__ */ __exportAll({
	name: () => name$4,
	plugins: () => plugins$4,
	rules: () => rules$4,
	settings: () => settings$4
});
const name$4 = "react-x/recommended-typescript";
const rules$4 = {
	...rules$6,
	...rules$5
};
const plugins$4 = { ...plugins$5 };
const settings$4 = { ...settings$5 };

//#endregion
//#region src/configs/recommended-type-checked.ts
var recommended_type_checked_exports = /* @__PURE__ */ __exportAll({
	name: () => name$3,
	plugins: () => plugins$3,
	rules: () => rules$3,
	settings: () => settings$3
});
const name$3 = "react-x/recommended-type-checked";
const rules$3 = {
	...rules$4,
	"react-x/no-implicit-key": "error",
	"react-x/no-leaked-conditional-rendering": "error"
};
const plugins$3 = { ...plugins$4 };
const settings$3 = { ...settings$4 };

//#endregion
//#region src/configs/strict.ts
var strict_exports = /* @__PURE__ */ __exportAll({
	name: () => name$2,
	plugins: () => plugins$2,
	rules: () => rules$2,
	settings: () => settings$2
});
const name$2 = "react-x/strict";
const rules$2 = {
	...rules$6,
	"react-x/jsx-no-iife": "error",
	"react-x/no-children-prop": "error",
	"react-x/no-class-component": "error",
	"react-x/no-misused-capture-owner-stack": "error",
	"react-x/no-unnecessary-use-callback": "warn",
	"react-x/no-unnecessary-use-memo": "warn",
	"react-x/no-unstable-context-value": "warn",
	"react-x/no-unstable-default-props": "warn",
	"react-x/no-unused-class-component-members": "warn",
	"react-x/no-unused-state": "warn",
	"react-x/no-useless-fragment": "warn",
	"react-x/prefer-destructuring-assignment": "warn"
};
const plugins$2 = { ...plugins$5 };
const settings$2 = { ...settings$5 };

//#endregion
//#region src/configs/strict-typescript.ts
var strict_typescript_exports = /* @__PURE__ */ __exportAll({
	name: () => name$1,
	plugins: () => plugins$1,
	rules: () => rules$1,
	settings: () => settings$1
});
const name$1 = "react-x/strict-typescript";
const rules$1 = {
	...rules$2,
	...rules$5
};
const plugins$1 = { ...plugins$2 };
const settings$1 = { ...settings$2 };

//#endregion
//#region src/configs/strict-type-checked.ts
var strict_type_checked_exports = /* @__PURE__ */ __exportAll({
	name: () => name,
	plugins: () => plugins,
	rules: () => rules,
	settings: () => settings
});
const name = "react-x/strict-type-checked";
const rules = {
	...rules$1,
	"react-x/no-implicit-key": "error",
	"react-x/no-leaked-conditional-rendering": "error",
	"react-x/no-unused-props": "warn"
};
const plugins = { ...plugins$1 };
const settings = { ...settings$1 };

//#endregion
//#region src/index.ts
const { toFlatConfig } = getConfigAdapters("react-x", plugin);
var src_default = {
	...plugin,
	configs: {
		["disable-experimental"]: toFlatConfig(disable_experimental_exports),
		["disable-type-checked"]: toFlatConfig(disable_type_checked_exports),
		["recommended"]: toFlatConfig(recommended_exports),
		["recommended-type-checked"]: toFlatConfig(recommended_type_checked_exports),
		["recommended-typescript"]: toFlatConfig(recommended_typescript_exports),
		["strict"]: toFlatConfig(strict_exports),
		["strict-type-checked"]: toFlatConfig(strict_type_checked_exports),
		["strict-typescript"]: toFlatConfig(strict_typescript_exports)
	}
};

//#endregion
export { src_default as default };