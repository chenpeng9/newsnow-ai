import { unit } from "@eslint-react/eff";
import { z } from "zod/v4";
import * as tseslint from "@typescript-eslint/utils/ts-eslint";
import { ReportDescriptor, RuleListener } from "@typescript-eslint/utils/ts-eslint";

//#region src/_id.d.ts
/**
 * A generator for unique ids.
 */
declare class IdGenerator {
  private n;
  private prefix;
  /**
   * @param prefix Optional. A prefix of generated ids.
   */
  constructor(prefix?: string);
  /**
   * Generates an id.
   * @returns A generated id.
   */
  next(): string;
}
//#endregion
//#region src/types.d.ts
/**
 * Rule severity.
 * @since 0.0.1
 */
type SeverityName = "off" | "warn" | "error";
/**
 * The numeric severity level for a rule.
 *
 * - `0` means off.
 * - `1` means warn.
 * - `2` means error.
 */
type SeverityLevel = 0 | 1 | 2;
/**
 * The severity of a rule in a configuration.
 */
type Severity = SeverityName | SeverityLevel;
/**
 * Rule declaration.
 * @internal
 * @since 0.0.1
 */
type RuleConfig<RuleOptions extends unknown[] = unknown[]> = Severity | [Severity, ...Partial<RuleOptions>];
/**
 * Rule context.
 * @since 0.0.1
 */
type RuleContext<MessageIds extends string = string, Options extends readonly unknown[] = readonly unknown[]> = tseslint.RuleContext<MessageIds, Options>;
/**
 * Rule feature.
 * @since 1.20.0
 */
type RuleFeature = "CFG" | "DBG" | "FIX" | "MOD" | "TSC" | "EXP";
/**
 * The numeric policy value for a rule (severity level).
 */
type RulePolicy = number;
/**
 * A suggestion for fixing a reported issue.
 */
type RuleSuggest<MessageIds extends string = string> = {
  /** The message ID for the suggestion. */messageId: MessageIds; /** Optional data to pass to the message formatter. */
  data?: Record<string, unknown>; /** The fix function to apply the suggestion. */
  fix: tseslint.ReportFixFunction;
};
/**
 * A collection of settings.
 */
interface SettingsConfig {
  [key: string]: unknown;
}
/**
 * A rule with a compatible shape for use with `defineConfig()` and `tseslint.config()`.
 * Intentionally wide/inaccurate for compatibility purposes.
 */
interface CompatibleRule {
  meta: Record<string, any>;
  create: (...args: any[]) => any;
}
/**
 * A plugin with a compatible shape for use with `defineConfig()` and `tseslint.config()`.
 * Intentionally wide/inaccurate for compatibility purposes.
 */
interface CompatiblePlugin {
  meta: {
    name: string;
    version: string;
  };
  rules: Record<string, CompatibleRule>;
}
/**
 * A configuration object with a compatible shape for use with `defineConfig()` and `tseslint.config()`.
 * Intentionally wide/inaccurate for compatibility purposes.
 */
interface CompatibleConfig {
  /** Optional configuration name. */
  name?: string;
  /** Rule configurations. */
  rules?: Record<string, RuleConfig>;
  /** Shared settings. */
  settings?: SettingsConfig;
}
//#endregion
//#region src/config-adapters.d.ts
/**
 * Get configuration adapters for converting between flat and legacy config formats
 * @param pluginName The name of the plugin
 * @param plugin The plugin instance
 * @returns Object with toFlatConfig and toLegacyConfig functions
 */
declare function getConfigAdapters(pluginName: string, plugin: CompatiblePlugin): {
  readonly toFlatConfig: (config: CompatibleConfig) => {
    plugins: {
      [pluginName]: CompatiblePlugin;
    };
    name?: string;
    rules?: Record<string, RuleConfig>;
    settings?: SettingsConfig;
  };
  readonly toLegacyConfig: ({
    rules
  }: CompatibleConfig) => {
    plugins: string[];
    rules: Record<string, RuleConfig<unknown[]>> | undefined;
  };
};
//#endregion
//#region src/constants.d.ts
/**
 * The NPM scope for this project.
 */
declare const NPM_SCOPE = "@eslint-react";
/**
 * The GitHub repository for this project.
 */
declare const GITHUB_URL = "https://github.com/Rel1cx/eslint-react";
/**
 * The URL to the project's website.
 */
declare const WEBSITE_URL = "https://eslint-react.xyz";
/**
 * Regular expressions for matching a HTML tag name
 */
declare const RE_HTML_TAG: RegExp;
/**
 * Regular expression for matching a TypeScript file extension.
 */
declare const RE_TS_EXT: RegExp;
/**
 * Regular expression for matching a JavaScript file extension.
 */
declare const RE_JS_EXT: RegExp;
/**
 * Regular expression for matching a PascalCase string.
 */
declare const RE_PASCAL_CASE: RegExp;
/**
 * Regular expression for matching a camelCase string.
 */
declare const RE_CAMEL_CASE: RegExp;
/**
 * Regular expression for matching a kebab-case string.
 */
declare const RE_KEBAB_CASE: RegExp;
/**
 * Regular expression for matching a snake_case string.
 */
declare const RE_SNAKE_CASE: RegExp;
/**
 * Regular expression for matching a CONSTANT_CASE string.
 */
declare const RE_CONSTANT_CASE: RegExp;
declare const RE_JAVASCRIPT_PROTOCOL: RegExp;
/**
 * Regular expression for matching a valid JavaScript identifier.
 */
declare const RE_JS_IDENTIFIER: RegExp;
/**
 * Regular expression for matching a RegExp string.
 */
declare const RE_REGEXP_STR: RegExp;
/**
 * Regular expression for matching a `@jsx` annotation comment.
 */
declare const RE_ANNOTATION_JSX: RegExp;
/**
 * Regular expression for matching a `@jsxFrag` annotation comment.
 */
declare const RE_ANNOTATION_JSX_FRAG: RegExp;
/**
 * Regular expression for matching a `@jsxRuntime` annotation comment.
 */
declare const RE_ANNOTATION_JSX_RUNTIME: RegExp;
/**
 * Regular expression for matching a `@jsxImportSource` annotation comment.
 */
declare const RE_ANNOTATION_JSX_IMPORT_SOURCE: RegExp;
/**
 * Regular expression for matching a React component name.
 */
declare const RE_COMPONENT_NAME: RegExp;
/**
 * Regular expression for matching a React component name (loose).
 */
declare const RE_COMPONENT_NAME_LOOSE: RegExp;
/**
 * Regular expression for matching a React Hook name.
 */
declare const RE_HOOK_NAME: RegExp;
//#endregion
//#region src/define-rule-listener.d.ts
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
declare function defineRuleListener(base: RuleListener, ...rest: RuleListener[]): RuleListener;
//#endregion
//#region src/react-version.d.ts
/**
 * Gets the React version from the project's dependencies.
 * @param fallback The fallback version to return if React is not found.
 * @returns The detected React version or the fallback version.
 */
declare function getReactVersion(fallback: string): string;
//#endregion
//#region src/regexp.d.ts
/**
 * A type represents RegExp-like object with `test` method.
 */
type RegExpLike = {
  test: (s: string) => boolean;
};
/**
 * Convert a string to the `RegExp`.
 * Normal strings (e.g., `"foo"`) is converted to `/^foo$/` of `RegExp`.
 * Strings like `"/^foo/i"` are converted to `/^foo/i` of `RegExp`.
 * @see https://github.com/sveltejs/eslint-plugin-svelte/blob/main/packages/eslint-plugin-svelte/src/utils/regexp.ts
 * @param string The string to convert.
 * @returns Returns the `RegExp`.
 */
declare function toRegExp(string: string | unit): RegExpLike;
/**
 * Check whether given string is regexp string
 * @param string The string to check
 * @returns boolean
 */
declare function isRegExp(string: string): boolean;
//#endregion
//#region src/report.d.ts
/**
 * Creates a report function for the given rule context.
 * @param context The ESLint rule context.
 * @returns A function that can be used to report violations.
 */
declare function report(context: RuleContext): (descriptor?: null | ReportDescriptor<string>) => void;
//#endregion
//#region src/settings.d.ts
/**
 * Schema for ESLint React settings configuration
 * @internal
 */
declare const ESLintReactSettingsSchema: z.ZodObject<{
  importSource: z.ZodOptional<z.ZodString>;
  polymorphicPropName: z.ZodOptional<z.ZodString>;
  version: z.ZodOptional<z.ZodString>;
  additionalStateHooks: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * Schema for ESLint settings
 * @internal
 */
declare const ESLintSettingsSchema: z.ZodOptional<z.ZodObject<{
  "react-x": z.ZodOptional<z.ZodUnknown>;
}, z.core.$strip>>;
/**
 * ESLint settings type inferred from the settings schema.
 */
type ESLintSettings = z.infer<typeof ESLintSettingsSchema>;
/**
 * ESLint React settings type inferred from the React settings schema.
 */
type ESLintReactSettings = z.infer<typeof ESLintReactSettingsSchema>;
/**
 * Normalized ESLint React settings with processed values
 */
interface ESLintReactSettingsNormalized {
  additionalStateHooks: RegExpLike;
  importSource: string;
  polymorphicPropName: string | unit;
  version: string;
}
/**
 * Default ESLint React settings
 */
declare const DEFAULT_ESLINT_REACT_SETTINGS: {
  readonly version: "detect";
  readonly importSource: "react";
  readonly polymorphicPropName: "as";
};
/**
 * Default ESLint settings with React settings included
 */
declare const DEFAULT_ESLINT_SETTINGS: {
  readonly "react-x": {
    readonly version: "detect";
    readonly importSource: "react";
    readonly polymorphicPropName: "as";
  };
};
/**
 * Check if the provided settings conform to ESLintSettings schema
 * @param settings The settings object to validate
 */
declare function isESLintSettings(settings: unknown): settings is ESLintSettings;
/**
 * Check if the provided settings conform to ESLintReactSettings schema
 * @param settings The settings object to validate
 */
declare function isESLintReactSettings(settings: unknown): settings is ESLintReactSettings;
/**
 * Coerces unknown input to ESLintSettings type
 * @param settings The settings object to coerce
 */
declare const coerceESLintSettings: (settings: unknown) => Partial<ESLintSettings>;
/**
 * Decodes and validates ESLint settings, using defaults if invalid
 * @param settings The settings object to decode
 */
declare const decodeESLintSettings: (settings: unknown) => ESLintSettings;
/**
 * Coerces unknown input to ESLintReactSettings type
 * @param settings The settings object to coerce
 */
declare const coerceSettings: (settings: unknown) => Partial<ESLintReactSettings>;
/**
 * Decodes and validates ESLint React settings, using defaults if invalid
 * @param settings The settings object to decode
 */
declare const decodeSettings: (settings: unknown) => ESLintReactSettings;
/**
 * Normalizes ESLint React settings to a consistent internal format
 * Transforms component definitions and resolves version information
 */
declare const normalizeSettings: ({
  importSource,
  polymorphicPropName,
  version,
  additionalStateHooks,
  ...rest
}: ESLintReactSettings) => {
  readonly importSource: string;
  readonly polymorphicPropName: string;
  readonly version: string;
  readonly additionalStateHooks: RegExpLike;
};
/**
 * Retrieves normalized ESLint React settings from the rule context
 * Uses caching for performance optimization
 * @param context The ESLint rule context
 */
declare function getSettingsFromContext(context: RuleContext): ESLintReactSettingsNormalized;
/**
 * Helper function for defining typed settings for "react-x" in JavaScript files
 * Provides type checking without runtime transformation
 */
declare const defineSettings: (settings: ESLintReactSettings) => ESLintReactSettings;
declare module "@typescript-eslint/utils/ts-eslint" {
  interface SharedConfigurationSettings {
    ["react-x"]?: Partial<ESLintReactSettings>;
  }
}
//#endregion
export { CompatibleConfig, CompatiblePlugin, CompatibleRule, DEFAULT_ESLINT_REACT_SETTINGS, DEFAULT_ESLINT_SETTINGS, ESLintReactSettings, ESLintReactSettingsNormalized, ESLintReactSettingsSchema, ESLintSettings, ESLintSettingsSchema, GITHUB_URL, IdGenerator, NPM_SCOPE, RE_ANNOTATION_JSX, RE_ANNOTATION_JSX_FRAG, RE_ANNOTATION_JSX_IMPORT_SOURCE, RE_ANNOTATION_JSX_RUNTIME, RE_CAMEL_CASE, RE_COMPONENT_NAME, RE_COMPONENT_NAME_LOOSE, RE_CONSTANT_CASE, RE_HOOK_NAME, RE_HTML_TAG, RE_JAVASCRIPT_PROTOCOL, RE_JS_EXT, RE_JS_IDENTIFIER, RE_KEBAB_CASE, RE_PASCAL_CASE, RE_REGEXP_STR, RE_SNAKE_CASE, RE_TS_EXT, RegExpLike, RuleConfig, RuleContext, RuleFeature, RulePolicy, RuleSuggest, SettingsConfig, Severity, SeverityLevel, SeverityName, WEBSITE_URL, coerceESLintSettings, coerceSettings, decodeESLintSettings, decodeSettings, defineRuleListener, defineSettings, getConfigAdapters, getReactVersion, getSettingsFromContext, isESLintReactSettings, isESLintSettings, isRegExp, normalizeSettings, report, toRegExp };