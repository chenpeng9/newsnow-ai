import { RE_CAMEL_CASE, RE_CONSTANT_CASE, RE_KEBAB_CASE, RE_PASCAL_CASE, RE_SNAKE_CASE, WEBSITE_URL, defineRuleListener, getConfigAdapters, getSettingsFromContext, toRegExp } from "@eslint-react/shared";
import * as core from "@eslint-react/core";
import { ESLintUtils } from "@typescript-eslint/utils";
import { findEnclosingAssignmentTarget } from "@eslint-react/var";
import { AST_NODE_TYPES } from "@typescript-eslint/types";
import { compare } from "compare-versions";
import { P, match } from "ts-pattern";
import * as ast from "@eslint-react/ast";
import { camelCase, kebabCase, pascalCase, snakeCase } from "string-ts";
import path from "node:path";
import { isObject } from "@eslint-react/eff";

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
const name$1 = "react-naming-convention/recommended";
const rules = {
	"react-naming-convention/context-name": "warn",
	"react-naming-convention/id-name": "warn",
	"react-naming-convention/ref-name": "warn",
	"react-naming-convention/use-state": "warn"
};

//#endregion
//#region package.json
var name = "eslint-plugin-react-naming-convention";
var version = "2.13.0";

//#endregion
//#region src/utils/create-rule.ts
function getDocsUrl(ruleName) {
	return `${WEBSITE_URL}/docs/rules/naming-convention-${ruleName}`;
}
const createRule = ESLintUtils.RuleCreator(getDocsUrl);

//#endregion
//#region src/rules/component-name.ts
const defaultOptions$3 = [{
	allowAllCaps: false,
	excepts: [],
	rule: "PascalCase"
}];
const schema$3 = [{ anyOf: [{
	type: "string",
	enum: ["PascalCase", "CONSTANT_CASE"]
}, {
	type: "object",
	additionalProperties: false,
	properties: {
		allowAllCaps: { type: "boolean" },
		excepts: {
			type: "array",
			items: {
				type: "string",
				format: "regex"
			}
		},
		rule: {
			type: "string",
			enum: ["PascalCase", "CONSTANT_CASE"]
		}
	}
}] }];
const RULE_NAME$6 = "component-name";
var component_name_default = createRule({
	meta: {
		type: "problem",
		defaultOptions: [...defaultOptions$3],
		docs: { description: "Enforces naming conventions for components." },
		messages: { invalidComponentName: "A component name '{{name}}' does not match {{rule}}." },
		schema: schema$3
	},
	name: RULE_NAME$6,
	create: create$6,
	defaultOptions: defaultOptions$3
});
function create$6(context) {
	const options = normalizeOptions(context.options);
	const { rule } = options;
	const fCollector = core.useComponentCollector(context);
	const cCollector = core.useComponentCollectorLegacy(context);
	return defineRuleListener(fCollector.visitor, cCollector.visitor, { "Program:exit"(program) {
		for (const { id, name, node: component } of fCollector.ctx.getAllComponents(program)) {
			if (isValidName(name, options)) continue;
			context.report({
				messageId: "invalidComponentName",
				node: id ?? component,
				data: {
					name,
					rule
				}
			});
		}
		for (const { id, name, node } of cCollector.ctx.getAllComponents(program)) {
			if (isValidName(name, options)) continue;
			context.report({
				messageId: "invalidComponentName",
				node: id ?? node,
				data: {
					name,
					rule
				}
			});
		}
	} });
}
function normalizeOptions(options) {
	const opts = options[0];
	const defaultOpts = defaultOptions$3[0];
	if (opts == null) return defaultOpts;
	return {
		...defaultOpts,
		...typeof opts === "string" ? { rule: opts } : {
			...opts,
			excepts: opts.excepts?.map((s) => toRegExp(s)) ?? []
		}
	};
}
function isValidName(name, options) {
	if (name == null) return true;
	if (options.excepts.some((regex) => regex.test(name))) return true;
	const normalized = name.split(".").at(-1) ?? name;
	switch (options.rule) {
		case "CONSTANT_CASE": return RE_CONSTANT_CASE.test(normalized);
		case "PascalCase":
			if (normalized.length > 3 && /^[A-Z]+$/u.test(normalized)) return options.allowAllCaps;
			return RE_PASCAL_CASE.test(normalized);
	}
}

//#endregion
//#region src/rules/context-name.ts
const RULE_NAME$5 = "context-name";
var context_name_default = createRule({
	meta: {
		type: "suggestion",
		docs: { description: "Enforces the context name to be a valid component name with the suffix 'Context'." },
		messages: { invalidContextName: "A context name must be a valid component name with the suffix 'Context'." },
		schema: []
	},
	name: RULE_NAME$5,
	create: create$5,
	defaultOptions: []
});
function create$5(context) {
	if (!context.sourceCode.text.includes("createContext")) return {};
	const { version } = getSettingsFromContext(context);
	if (compare(version, "19.0.0", "<")) return {};
	return { CallExpression(node) {
		if (!core.isCreateContextCall(context, node)) return;
		const [id, name] = match(findEnclosingAssignmentTarget(node)).with({
			type: AST_NODE_TYPES.Identifier,
			name: P.string
		}, (id) => [id, id.name]).with({
			type: AST_NODE_TYPES.MemberExpression,
			property: { name: P.string }
		}, (id) => [id, id.property.name]).otherwise(() => [null, null]);
		if (id == null) return;
		if (core.isComponentName(name) && name.endsWith("Context")) return;
		context.report({
			messageId: "invalidContextName",
			node: id
		});
	} };
}

//#endregion
//#region src/rules/id-name.ts
const RULE_NAME$4 = "id-name";
var id_name_default = createRule({
	meta: {
		type: "suggestion",
		docs: { description: "Enforces identifier names assigned from 'useId' calls to be either 'id' or end with 'Id'." },
		messages: { invalidIdName: "An identifier assigned from 'useId' must be named 'id' or end with 'Id'." },
		schema: []
	},
	name: RULE_NAME$4,
	create: create$4,
	defaultOptions: []
});
function create$4(context) {
	if (!context.sourceCode.text.includes("useId")) return {};
	return { CallExpression(node) {
		if (!core.isUseIdCall(node)) return;
		const [id, name] = match(findEnclosingAssignmentTarget(node)).with({
			type: AST_NODE_TYPES.Identifier,
			name: P.string
		}, (id) => [id, id.name]).with({
			type: AST_NODE_TYPES.MemberExpression,
			property: { name: P.string }
		}, (id) => [id, id.property.name]).otherwise(() => [null, null]);
		if (id == null) return;
		if (name.endsWith("Id") || name === "id") return;
		context.report({
			messageId: "invalidIdName",
			node: id
		});
	} };
}

//#endregion
//#region src/rules/ref-name.ts
const RULE_NAME$3 = "ref-name";
var ref_name_default = createRule({
	meta: {
		type: "suggestion",
		docs: { description: "Enforces identifier names assigned from 'useRef' calls to be either 'ref' or end with 'Ref'." },
		messages: { invalidRefName: "A ref identifier must be named 'ref' or ending in 'Ref'." },
		schema: []
	},
	name: RULE_NAME$3,
	create: create$3,
	defaultOptions: []
});
function create$3(context) {
	if (!context.sourceCode.text.includes("useRef")) return {};
	return { CallExpression(node) {
		if (!core.isUseRefCall(node)) return;
		if (ast.getUnderlyingExpression(node.parent).type === AST_NODE_TYPES.MemberExpression) return;
		const [id, name] = match(findEnclosingAssignmentTarget(node)).with({
			type: AST_NODE_TYPES.Identifier,
			name: P.string
		}, (id) => [id, id.name]).with({
			type: AST_NODE_TYPES.MemberExpression,
			property: { name: P.string }
		}, (id) => [id, id.property.name]).otherwise(() => [null, null]);
		if (id == null) return;
		if (name.endsWith("Ref") || name === "ref") return;
		context.report({
			messageId: "invalidRefName",
			node: id
		});
	} };
}

//#endregion
//#region src/rules/use-state.ts
const RULE_NAME$2 = "use-state";
const defaultOptions$2 = [{
	enforceAssignment: false,
	enforceSetterName: true
}];
const schema$2 = [{
	type: "object",
	additionalProperties: false,
	properties: {
		enforceAssignment: {
			type: "boolean",
			default: false
		},
		enforceSetterName: {
			type: "boolean",
			default: true
		}
	}
}];
var use_state_default = createRule({
	meta: {
		type: "suggestion",
		docs: { description: "Enforces destructuring and symmetric naming of the 'useState' hook value and setter." },
		messages: {
			invalidAssignment: "useState should be destructured into a value and setter pair, e.g., const [state, setState] = useState(...).",
			invalidSetterName: "The setter should be named 'set' followed by the capitalized state variable name, e.g., 'setState' for 'state'."
		},
		schema: schema$2
	},
	name: RULE_NAME$2,
	create: create$2,
	defaultOptions: defaultOptions$2
});
function create$2(context) {
	const { enforceAssignment = false, enforceSetterName = true } = context.options[0] ?? defaultOptions$2[0];
	return { CallExpression(node) {
		if (!core.isUseStateCall(node)) return;
		if (node.parent.type !== AST_NODE_TYPES.VariableDeclarator) {
			if (!enforceAssignment) return;
			context.report({
				messageId: "invalidAssignment",
				node
			});
			return;
		}
		const id = findEnclosingAssignmentTarget(node);
		if (id?.type !== AST_NODE_TYPES.ArrayPattern) {
			if (!enforceAssignment) return;
			context.report({
				messageId: "invalidAssignment",
				node: id ?? node
			});
			return;
		}
		const [value, setter] = id.elements;
		if (value == null) {
			if (!enforceAssignment) return;
			context.report({
				messageId: "invalidAssignment",
				node: id
			});
			return;
		}
		if (setter == null || !enforceSetterName) return;
		const setterName = match(setter).with({ type: AST_NODE_TYPES.Identifier }, (id) => id.name).otherwise(() => null);
		if (setterName == null || !setterName.startsWith("set")) {
			context.report({
				messageId: "invalidSetterName",
				node: setter
			});
			return;
		}
		const valueName = match(value).with({ type: AST_NODE_TYPES.Identifier }, ({ name }) => snakeCase(name)).with({ type: AST_NODE_TYPES.ObjectPattern }, ({ properties }) => {
			return properties.reduce((acc, prop) => {
				if (prop.type === AST_NODE_TYPES.Property && prop.key.type === AST_NODE_TYPES.Identifier) return [...acc, prop.key.name];
				return acc;
			}, []).join("_");
		}).otherwise(() => null);
		if (valueName == null) {
			context.report({
				messageId: "invalidSetterName",
				node: value
			});
			return;
		}
		if (snakeCase(setterName) !== `set_${valueName}`) {
			context.report({
				messageId: "invalidSetterName",
				node: setter
			});
			return;
		}
	} };
}

//#endregion
//#region src/rules-removed/filename.ts
const RULE_NAME$1 = "filename";
const defaultOptions$1 = [{
	excepts: [
		"index",
		String.raw`/^_/`,
		String.raw`/^\$/`,
		String.raw`/^[0-9]+$/`,
		String.raw`/^\[[^\]]+\]$/`
	],
	rule: "PascalCase"
}];
const schema$1 = [{ anyOf: [{
	type: "string",
	enum: [
		"PascalCase",
		"camelCase",
		"kebab-case",
		"snake_case"
	]
}, {
	type: "object",
	additionalProperties: false,
	properties: {
		excepts: {
			type: "array",
			items: {
				type: "string",
				format: "regex"
			}
		},
		extensions: {
			type: "array",
			items: { type: "string" },
			uniqueItems: true
		},
		rule: {
			type: "string",
			enum: [
				"PascalCase",
				"camelCase",
				"kebab-case",
				"snake_case"
			]
		}
	}
}] }];
var filename_default = createRule({
	meta: {
		type: "suggestion",
		defaultOptions: [...defaultOptions$1],
		docs: { description: "Enforces consistent file-naming conventions." },
		messages: {
			fileNameEmpty: "A source file must have non-empty name.",
			fileNameInvalidCase: "A source file with name '{{name}}' does not match {{rule}}. Rename it to '{{suggestion}}'."
		},
		schema: schema$1
	},
	name: RULE_NAME$1,
	create: create$1,
	defaultOptions: defaultOptions$1
});
function create$1(context) {
	const options = context.options[0] ?? defaultOptions$1[0];
	const rule = typeof options === "string" ? options : options.rule ?? "PascalCase";
	const excepts = typeof options === "string" ? [] : (options.excepts ?? []).map((s) => toRegExp(s));
	function validate(name, casing = rule, ignores = excepts) {
		if (ignores.some((pattern) => pattern.test(name))) return true;
		const filteredName = name.match(/[\w.-]/gu)?.join("") ?? "";
		if (filteredName.length === 0) return true;
		return match(casing).with("PascalCase", () => RE_PASCAL_CASE.test(filteredName)).with("camelCase", () => RE_CAMEL_CASE.test(filteredName)).with("kebab-case", () => RE_KEBAB_CASE.test(filteredName)).with("snake_case", () => RE_SNAKE_CASE.test(filteredName)).exhaustive();
	}
	function getSuggestion(name, casing = rule) {
		return match(casing).with("PascalCase", () => pascalCase(name)).with("camelCase", () => camelCase(name)).with("kebab-case", () => kebabCase(name)).with("snake_case", () => snakeCase(name)).exhaustive();
	}
	return { Program(node) {
		const [basename = "", ...rest] = path.basename(context.filename).split(".");
		if (basename.length === 0) {
			context.report({
				messageId: "fileNameEmpty",
				node
			});
			return;
		}
		if (validate(basename)) return;
		context.report({
			messageId: "fileNameInvalidCase",
			node,
			data: {
				name: context.filename,
				rule,
				suggestion: [getSuggestion(basename), ...rest].join(".")
			}
		});
	} };
}

//#endregion
//#region src/rules-removed/filename-extension.ts
const RULE_NAME = "filename-extension";
const defaultOptions = [{
	allow: "as-needed",
	extensions: [".jsx", ".tsx"],
	ignoreFilesWithoutCode: false
}];
const schema = [{ anyOf: [{
	type: "string",
	enum: ["always", "as-needed"]
}, {
	type: "object",
	additionalProperties: false,
	properties: {
		allow: {
			type: "string",
			enum: ["always", "as-needed"]
		},
		extensions: {
			type: "array",
			items: { type: "string" },
			uniqueItems: true
		},
		ignoreFilesWithoutCode: { type: "boolean" }
	}
}] }];
var filename_extension_default = createRule({
	meta: {
		type: "suggestion",
		defaultOptions: [...defaultOptions],
		docs: { description: "Enforces consistent use of the JSX file extension." },
		messages: {
			missingJsxExtension: "Use {{extensions}} file extension for JSX files.",
			unnecessaryJsxExtension: "Do not use {{extensions}} file extension for files without JSX."
		},
		schema
	},
	name: RULE_NAME,
	create,
	defaultOptions
});
function create(context) {
	const options = context.options[0] ?? defaultOptions[0];
	const allow = isObject(options) ? options.allow : options;
	const extensions = isObject(options) && "extensions" in options ? options.extensions : defaultOptions[0].extensions;
	const extensionsString = extensions.map((ext) => `'${ext}'`).join(", ");
	const filename = context.filename;
	let hasJSXNode = false;
	return {
		JSXElement() {
			hasJSXNode = true;
		},
		JSXFragment() {
			hasJSXNode = true;
		},
		"Program:exit"(program) {
			const fileNameExt = filename.slice(filename.lastIndexOf("."));
			const isJSXExt = extensions.includes(fileNameExt);
			if (hasJSXNode && !isJSXExt) {
				context.report({
					messageId: "missingJsxExtension",
					node: program,
					data: { extensions: extensionsString }
				});
				return;
			}
			const hasCode = program.body.length > 0;
			const ignoreFilesWithoutCode = isObject(options) && options.ignoreFilesWithoutCode === true;
			if (!hasCode && ignoreFilesWithoutCode) return;
			if (!hasJSXNode && isJSXExt && allow === "as-needed") context.report({
				messageId: "unnecessaryJsxExtension",
				node: program,
				data: { extensions: extensionsString }
			});
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
	rules: {
		["component-name"]: component_name_default,
		["context-name"]: context_name_default,
		["id-name"]: id_name_default,
		["ref-name"]: ref_name_default,
		["use-state"]: use_state_default,
		["filename"]: filename_default,
		["filename-extension"]: filename_extension_default
	}
};

//#endregion
//#region src/index.ts
const { toFlatConfig } = getConfigAdapters("react-naming-convention", plugin);
var src_default = {
	...plugin,
	configs: { ["recommended"]: toFlatConfig(recommended_exports) }
};

//#endregion
export { src_default as default };