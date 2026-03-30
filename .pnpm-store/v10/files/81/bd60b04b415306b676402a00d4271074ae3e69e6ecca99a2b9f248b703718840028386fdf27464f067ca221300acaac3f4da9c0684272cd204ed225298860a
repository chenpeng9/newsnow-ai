import module from "node:module";
import path from "node:path";
import { constFalse, getOrElseUpdate, identity } from "@eslint-react/eff";
import { P, match } from "ts-pattern";
import { z } from "zod/v4";

//#region src/_id.ts
/**
* A generator for unique ids.
*/
var IdGenerator = class {
	n;
	prefix;
	/**
	* @param prefix Optional. A prefix of generated ids.
	*/
	constructor(prefix = "id_") {
		this.prefix = prefix;
		this.n = 0n;
	}
	/**
	* Generates an id.
	* @returns A generated id.
	*/
	next() {
		this.n = 1n + this.n;
		return this.prefix + this.n.toString(16);
	}
};

//#endregion
//#region src/config-adapters.ts
/**
* Get configuration adapters for converting between flat and legacy config formats
* @param pluginName The name of the plugin
* @param plugin The plugin instance
* @returns Object with toFlatConfig and toLegacyConfig functions
*/
function getConfigAdapters(pluginName, plugin) {
	function toFlatConfig(config) {
		return {
			...config,
			plugins: { [pluginName]: plugin }
		};
	}
	function toLegacyConfig({ rules }) {
		return {
			plugins: [pluginName],
			rules
		};
	}
	return {
		toFlatConfig,
		toLegacyConfig
	};
}

//#endregion
//#region src/constants.ts
/**
* The NPM scope for this project.
*/
const NPM_SCOPE = "@eslint-react";
/**
* The GitHub repository for this project.
*/
const GITHUB_URL = "https://github.com/Rel1cx/eslint-react";
/**
* The URL to the project's website.
*/
const WEBSITE_URL = "https://eslint-react.xyz";
/**
* Regular expressions for matching a HTML tag name
*/
const RE_HTML_TAG = /^[a-z][^-]*$/u;
/**
* Regular expression for matching a TypeScript file extension.
*/
const RE_TS_EXT = /^[cm]?tsx?$/u;
/**
* Regular expression for matching a JavaScript file extension.
*/
const RE_JS_EXT = /^[cm]?jsx?$/u;
/**
* Regular expression for matching a PascalCase string.
*/
const RE_PASCAL_CASE = /^[A-Z][\dA-Za-z]*$/u;
/**
* Regular expression for matching a camelCase string.
*/
const RE_CAMEL_CASE = /^[a-z][\dA-Za-z]*$/u;
/**
* Regular expression for matching a kebab-case string.
*/
const RE_KEBAB_CASE = /^[a-z][\d\-a-z]*$/u;
/**
* Regular expression for matching a snake_case string.
*/
const RE_SNAKE_CASE = /^[a-z][\d_a-z]*$/u;
/**
* Regular expression for matching a CONSTANT_CASE string.
*/
const RE_CONSTANT_CASE = /^[A-Z][\d_A-Z]*$/u;
const RE_JAVASCRIPT_PROTOCOL = /^[\u0000-\u001F ]*j[\t\n\r]*a[\t\n\r]*v[\t\n\r]*a[\t\n\r]*s[\t\n\r]*c[\t\n\r]*r[\t\n\r]*i[\t\n\r]*p[\t\n\r]*t[\t\n\r]*:/iu;
/**
* Regular expression for matching a valid JavaScript identifier.
*/
const RE_JS_IDENTIFIER = /^[_$a-z][\w$]*$/i;
/**
* Regular expression for matching a RegExp string.
*/
const RE_REGEXP_STR = /^\/(.+)\/([A-Za-z]*)$/u;
/**
* Regular expression for matching a `@jsx` annotation comment.
*/
const RE_ANNOTATION_JSX = /@jsx\s+(\S+)/u;
/**
* Regular expression for matching a `@jsxFrag` annotation comment.
*/
const RE_ANNOTATION_JSX_FRAG = /@jsxFrag\s+(\S+)/u;
/**
* Regular expression for matching a `@jsxRuntime` annotation comment.
*/
const RE_ANNOTATION_JSX_RUNTIME = /@jsxRuntime\s+(\S+)/u;
/**
* Regular expression for matching a `@jsxImportSource` annotation comment.
*/
const RE_ANNOTATION_JSX_IMPORT_SOURCE = /@jsxImportSource\s+(\S+)/u;
/**
* Regular expression for matching a React component name.
*/
const RE_COMPONENT_NAME = /^[A-Z]/u;
/**
* Regular expression for matching a React component name (loose).
*/
const RE_COMPONENT_NAME_LOOSE = /^_?[A-Z]/u;
/**
* Regular expression for matching a React Hook name.
*/
const RE_HOOK_NAME = /^use/u;

//#endregion
//#region src/define-rule-listener.ts
/**
* Defines a rule listener by merging multiple visitor objects
*
* @param base Base visitor object (target of merge)
* @param rest Additional visitor objects to merge (one or more)
* @returns Merged RuleListener object
*
* @example
* ```typescript
* const listener1 = { Identifier: () => console.log(1) };
* const listener2 = { Identifier: () => console.log(2) };
* const merged = defineRuleListener(listener1, listener2);
* // When encountering Identifier nodes, outputs 1 then 2
* ```
*/
function defineRuleListener(base, ...rest) {
	for (const r of rest) for (const key in r) {
		const existing = base[key];
		base[key] = existing ? (...args) => {
			existing(...args);
			r[key]?.(...args);
		} : r[key];
	}
	return base;
}

//#endregion
//#region src/react-version.ts
const _require = module.createRequire(process.cwd() + path.sep);
/**
* Gets the React version from the project's dependencies.
* @param fallback The fallback version to return if React is not found.
* @returns The detected React version or the fallback version.
*/
function getReactVersion(fallback) {
	try {
		return match(_require("react")).with({ version: P.select(P.string) }, identity).otherwise(() => fallback);
	} catch {
		return fallback;
	}
}

//#endregion
//#region src/regexp.ts
/**
* Convert a string to the `RegExp`.
* Normal strings (e.g., `"foo"`) is converted to `/^foo$/` of `RegExp`.
* Strings like `"/^foo/i"` are converted to `/^foo/i` of `RegExp`.
* @see https://github.com/sveltejs/eslint-plugin-svelte/blob/main/packages/eslint-plugin-svelte/src/utils/regexp.ts
* @param string The string to convert.
* @returns Returns the `RegExp`.
*/
function toRegExp(string) {
	if (string == null) return { test: constFalse };
	const [, pattern, flags = "u"] = RE_REGEXP_STR.exec(string) ?? [];
	if (pattern != null) return new RegExp(pattern, flags);
	return { test: (s) => s === string };
}
/**
* Check whether given string is regexp string
* @param string The string to check
* @returns boolean
*/
function isRegExp(string) {
	return RE_REGEXP_STR.test(string);
}

//#endregion
//#region src/report.ts
/**
* Creates a report function for the given rule context.
* @param context The ESLint rule context.
* @returns A function that can be used to report violations.
*/
function report(context) {
	return (descriptor) => {
		if (descriptor == null) return;
		return context.report(descriptor);
	};
}

//#endregion
//#region src/settings.ts
/**
* Schema for ESLint React settings configuration
* @internal
*/
const ESLintReactSettingsSchema = z.object({
	importSource: z.optional(z.string()),
	polymorphicPropName: z.optional(z.string()),
	version: z.optional(z.string()),
	additionalStateHooks: z.optional(z.string())
});
/**
* Schema for ESLint settings
* @internal
*/
const ESLintSettingsSchema = z.optional(z.object({ "react-x": z.optional(z.unknown()) }));
/**
* Default ESLint React settings
*/
const DEFAULT_ESLINT_REACT_SETTINGS = {
	version: "detect",
	importSource: "react",
	polymorphicPropName: "as"
};
/**
* Default ESLint settings with React settings included
*/
const DEFAULT_ESLINT_SETTINGS = { "react-x": DEFAULT_ESLINT_REACT_SETTINGS };
/**
* Check if the provided settings conform to ESLintSettings schema
* @param settings The settings object to validate
*/
function isESLintSettings(settings) {
	return ESLintSettingsSchema.safeParse(settings).success;
}
/**
* Check if the provided settings conform to ESLintReactSettings schema
* @param settings The settings object to validate
*/
function isESLintReactSettings(settings) {
	return ESLintReactSettingsSchema.safeParse(settings).success;
}
/**
* Coerces unknown input to ESLintSettings type
* @param settings The settings object to coerce
*/
const coerceESLintSettings = (settings) => {
	return settings;
};
/**
* Decodes and validates ESLint settings, using defaults if invalid
* @param settings The settings object to decode
*/
const decodeESLintSettings = (settings) => {
	if (isESLintSettings(settings)) return settings;
	return DEFAULT_ESLINT_SETTINGS;
};
/**
* Coerces unknown input to ESLintReactSettings type
* @param settings The settings object to coerce
*/
const coerceSettings = (settings) => {
	return settings;
};
/**
* Decodes and validates ESLint React settings, using defaults if invalid
* @param settings The settings object to decode
*/
const decodeSettings = (settings) => {
	if (isESLintReactSettings(settings)) return settings;
	return DEFAULT_ESLINT_REACT_SETTINGS;
};
/**
* Normalizes ESLint React settings to a consistent internal format
* Transforms component definitions and resolves version information
*/
const normalizeSettings = ({ importSource = "react", polymorphicPropName = "as", version, additionalStateHooks, ...rest }) => {
	return {
		...rest,
		importSource,
		polymorphicPropName,
		version: match(version).with(P.union(P.nullish, "", "detect"), () => getReactVersion("19.2.0")).otherwise(identity),
		additionalStateHooks: toRegExp(additionalStateHooks)
	};
};
const cache = /* @__PURE__ */ new Map();
/**
* Retrieves normalized ESLint React settings from the rule context
* Uses caching for performance optimization
* @param context The ESLint rule context
*/
function getSettingsFromContext(context) {
	const settings = context.settings;
	return getOrElseUpdate(cache, settings["react-x"], () => normalizeSettings(decodeSettings(settings["react-x"])));
}
/**
* Helper function for defining typed settings for "react-x" in JavaScript files
* Provides type checking without runtime transformation
*/
const defineSettings = identity;

//#endregion
export { DEFAULT_ESLINT_REACT_SETTINGS, DEFAULT_ESLINT_SETTINGS, ESLintReactSettingsSchema, ESLintSettingsSchema, GITHUB_URL, IdGenerator, NPM_SCOPE, RE_ANNOTATION_JSX, RE_ANNOTATION_JSX_FRAG, RE_ANNOTATION_JSX_IMPORT_SOURCE, RE_ANNOTATION_JSX_RUNTIME, RE_CAMEL_CASE, RE_COMPONENT_NAME, RE_COMPONENT_NAME_LOOSE, RE_CONSTANT_CASE, RE_HOOK_NAME, RE_HTML_TAG, RE_JAVASCRIPT_PROTOCOL, RE_JS_EXT, RE_JS_IDENTIFIER, RE_KEBAB_CASE, RE_PASCAL_CASE, RE_REGEXP_STR, RE_SNAKE_CASE, RE_TS_EXT, WEBSITE_URL, coerceESLintSettings, coerceSettings, decodeESLintSettings, decodeSettings, defineRuleListener, defineSettings, getConfigAdapters, getReactVersion, getSettingsFromContext, isESLintReactSettings, isESLintSettings, isRegExp, normalizeSettings, report, toRegExp };