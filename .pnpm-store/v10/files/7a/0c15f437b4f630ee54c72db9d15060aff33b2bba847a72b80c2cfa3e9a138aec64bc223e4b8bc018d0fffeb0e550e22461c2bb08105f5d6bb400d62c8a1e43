import * as ast from "@eslint-react/ast";
import { unit } from "@eslint-react/eff";
import { TSESTree } from "@typescript-eslint/types";
import { RegExpLike, RuleContext } from "@eslint-react/shared";
import { ESLintUtils, TSESTree as TSESTree$1 } from "@typescript-eslint/utils";
import { Scope } from "@typescript-eslint/scope-manager";
import * as typescript from "typescript";

//#region src/api/is-from-react.d.ts
/**
 * Check if a variable is initialized from React import
 * @param name The variable name
 * @param initialScope The initial scope
 * @param importSource Alternative import source of React (e.g., "preact/compat")
 * @returns True if the variable is initialized or derived from React import
 */
declare function isInitializedFromReact(name: string, initialScope: Scope, importSource?: string): boolean;
//#endregion
//#region src/api/is-from-react-native.d.ts
/**
 * if a variable is initialized from React Native import
 * @param name The variable name
 * @param initialScope The initial scope
 * @param importSource Alternative import source of React Native (e.g., "react-native-web")
 * @returns True if the variable is initialized from React Native import
 */
declare function isInitializedFromReactNative(name: string, initialScope: Scope, importSource?: string): boolean;
//#endregion
//#region src/api/is-react-api.d.ts
declare namespace isReactAPI {
  type ReturnType = {
    (context: RuleContext, node: unit | null | TSESTree.Node): node is TSESTree.Identifier | TSESTree.MemberExpression;
    (context: RuleContext): (node: unit | null | TSESTree.Node) => node is TSESTree.MemberExpression | TSESTree.Identifier;
  };
}
/**
 * Check if the node is a React API identifier or member expression
 * @param api The React API name to check against (e.g., "useState", "React.memo")
 * @returns A predicate function to check if a node matches the API
 */
declare function isReactAPI(api: string): isReactAPI.ReturnType;
declare namespace isReactAPICall {
  type ReturnType = {
    (context: RuleContext, node: unit | null | TSESTree.Node): node is TSESTree.CallExpression;
    (context: RuleContext): (node: unit | null | TSESTree.Node) => node is TSESTree.CallExpression;
  };
}
/**
 * Check if the node is a call expression to a specific React API
 * @param api The React API name to check against
 * @returns A predicate function to check if a node is a call to the API
 */
declare function isReactAPICall(api: string): isReactAPICall.ReturnType;
declare const isCaptureOwnerStack: isReactAPI.ReturnType;
declare const isChildrenCount: isReactAPI.ReturnType;
declare const isChildrenForEach: isReactAPI.ReturnType;
declare const isChildrenMap: isReactAPI.ReturnType;
declare const isChildrenOnly: isReactAPI.ReturnType;
declare const isChildrenToArray: isReactAPI.ReturnType;
declare const isCloneElement: isReactAPI.ReturnType;
declare const isCreateContext: isReactAPI.ReturnType;
declare const isCreateElement: isReactAPI.ReturnType;
declare const isCreateRef: isReactAPI.ReturnType;
declare const isForwardRef: isReactAPI.ReturnType;
declare const isMemo: isReactAPI.ReturnType;
declare const isLazy: isReactAPI.ReturnType;
declare const isCaptureOwnerStackCall: isReactAPICall.ReturnType;
declare const isChildrenCountCall: isReactAPICall.ReturnType;
declare const isChildrenForEachCall: isReactAPICall.ReturnType;
declare const isChildrenMapCall: isReactAPICall.ReturnType;
declare const isChildrenOnlyCall: isReactAPICall.ReturnType;
declare const isChildrenToArrayCall: isReactAPICall.ReturnType;
declare const isCloneElementCall: isReactAPICall.ReturnType;
declare const isCreateContextCall: isReactAPICall.ReturnType;
declare const isCreateElementCall: isReactAPICall.ReturnType;
declare const isCreateRefCall: isReactAPICall.ReturnType;
declare const isForwardRefCall: isReactAPICall.ReturnType;
declare const isMemoCall: isReactAPICall.ReturnType;
declare const isLazyCall: isReactAPICall.ReturnType;
//#endregion
//#region src/component/component-detection-hint.d.ts
type ComponentDetectionHint = bigint;
/**
 * Hints for component collector
 */
declare const ComponentDetectionHint: {
  readonly DoNotIncludeFunctionDefinedOnObjectMethod: bigint;
  readonly DoNotIncludeFunctionDefinedOnClassMethod: bigint;
  readonly DoNotIncludeFunctionDefinedOnClassProperty: bigint;
  readonly DoNotIncludeFunctionDefinedInArrayPattern: bigint;
  readonly DoNotIncludeFunctionDefinedInArrayExpression: bigint;
  readonly DoNotIncludeFunctionDefinedAsArrayMapCallback: bigint;
  readonly DoNotIncludeFunctionDefinedAsArrayFlatMapCallback: bigint;
  readonly None: 0n;
  readonly DoNotIncludeJsxWithNullValue: bigint;
  readonly DoNotIncludeJsxWithNumberValue: bigint;
  readonly DoNotIncludeJsxWithBigIntValue: bigint;
  readonly DoNotIncludeJsxWithStringValue: bigint;
  readonly DoNotIncludeJsxWithBooleanValue: bigint;
  readonly DoNotIncludeJsxWithUndefinedValue: bigint;
  readonly DoNotIncludeJsxWithEmptyArrayValue: bigint;
  readonly DoNotIncludeJsxWithCreateElementValue: bigint;
  readonly RequireAllArrayElementsToBeJsx: bigint;
  readonly RequireBothSidesOfLogicalExpressionToBeJsx: bigint;
  readonly RequireBothBranchesOfConditionalExpressionToBeJsx: bigint;
};
/**
 * Default component detection hint
 */
declare const DEFAULT_COMPONENT_DETECTION_HINT: bigint;
//#endregion
//#region src/semantic/semantic-node.d.ts
/**
 * Represents a semantic node in the AST
 * This is the base interface for all semantic nodes in the React semantic analysis
 */
interface SemanticNode {
  /** The identifier of the node */
  id: unit | TSESTree.Node;
  /** The unique key of the node */
  key: string;
  /** The kind of the node */
  kind: string;
  /** The name of the node */
  name: unit | string;
  /** The AST node */
  node: TSESTree.Node;
  /** The flag of the node */
  flag: bigint;
  /** The hint of the node */
  hint: bigint;
}
//#endregion
//#region src/semantic/semantic-func.d.ts
/**
 * Represents a semantic function node in the AST
 * This interface extends SemanticNode and provides additional properties for function analysis
 */
interface SemanticFunc extends SemanticNode {
  /** The identifier of the function */
  id: ast.FunctionID | unit;
  /** The AST node of the function */
  node: ast.TSESTreeFunction;
  /** The name of the function */
  name: string | unit;
  /** The return type annotation of the function */
  type: TSESTree.TSTypeAnnotation | unit;
  /** The body of the function */
  body: TSESTree.BlockStatement | TSESTree.Expression;
  /** The directives of the function (e.g., "use strict", "use client", "use server", etc.) */
  directives: ast.TSESTreeDirective[];
  /** The parameters of the function */
  parameters: TSESTree.Parameter[];
  /** The type parameters of the function */
  typeParameters: TSESTree.TSTypeParameterDeclaration | unit;
}
//#endregion
//#region src/component/component-flag.d.ts
type ComponentFlag = bigint;
/**
 * Component flag constants
 */
declare const ComponentFlag: {
  /** No flags set */None: bigint; /** Indicates the component is a pure component (e.g., extends PureComponent) */
  PureComponent: bigint; /** Indicates the component creates elements using `createElement` instead of JSX */
  CreateElement: bigint; /** Indicates the component is memoized (e.g., React.memo) */
  Memo: bigint; /** Indicates the component forwards a ref (e.g., React.forwardRef) */
  ForwardRef: bigint;
};
//#endregion
//#region src/component/component-semantic-node.d.ts
/**
 * Represents a React Function Component
 */
interface FunctionComponentSemanticNode extends SemanticNode {
  /**
   * The identifier or identifier sequence of the component
   */
  id: unit | ast.FunctionID;
  /**
   * The kind of component
   */
  kind: "function-component";
  /**
   * The AST node of the function
   */
  node: ast.TSESTreeFunction;
  /**
   * Flags describing the component's characteristics
   */
  flag: ComponentFlag;
  /**
   * Hint for how the component was detected
   */
  hint: ComponentDetectionHint;
  /**
   * List of expressions returned by the component
   */
  rets: TSESTree.ReturnStatement["argument"][];
  /**
   * The initialization path of the function
   */
  initPath: unit | ast.FunctionInitPath;
  /**
   * Indicates if the component is inside an export default declaration
   */
  isExportDefault: boolean;
  /**
   * Indicates if the component is itself an export default declaration
   */
  isExportDefaultDeclaration: boolean;
  /**
   * List of hook calls within the component
   */
  hookCalls: TSESTree.CallExpression[];
  /**
   * The display name of the component
   */
  displayName: unit | TSESTree.Expression;
  /**
   * The directives used in the function (e.g., "use strict", "use client", etc.)
   */
  directives: ast.TSESTreeDirective[];
}
/**
 * Represents a React Class Component
 */
interface ClassComponentSemanticNode extends SemanticNode {
  /**
   * The identifier of the component
   */
  id: unit | TSESTree.BindingName;
  /**
   * The kind of component
   */
  kind: "class-component";
  /**
   * The AST node of the class
   */
  node: ast.TSESTreeClass;
  /**
   * Flags describing the component's characteristics
   */
  flag: ComponentFlag;
  /**
   * Hint for how the component was detected
   */
  hint: ComponentDetectionHint;
  /**
   * List of methods and properties in the class
   */
  methods: ast.TSESTreeMethodOrProperty[];
  /**
   * The display name of the component
   */
  displayName: unit | TSESTree.Expression;
}
/**
 * Represents a React Component
 */
type ComponentSemanticNode = ClassComponentSemanticNode | FunctionComponentSemanticNode;
//#endregion
//#region src/component/component-collector.d.ts
interface FunctionEntry$1 extends FunctionComponentSemanticNode {
  isComponentDefinition: boolean;
}
declare namespace useComponentCollector {
  type Options = {
    collectDisplayName?: boolean;
    hint?: ComponentDetectionHint;
  };
  type ReturnType = {
    ctx: {
      getAllComponents: (node: TSESTree.Program) => FunctionComponentSemanticNode[];
      getCurrentEntries: () => FunctionEntry$1[];
      getCurrentEntry: () => FunctionEntry$1 | unit;
    };
    visitor: ESLintUtils.RuleListener;
  };
}
/**
 * Get a ctx and visitor object for the rule to collect function components
 * @param context The ESLint rule context
 * @param options The options to use
 * @returns The ctx and visitor of the collector
 */
declare function useComponentCollector(context: RuleContext, options?: useComponentCollector.Options): useComponentCollector.ReturnType;
//#endregion
//#region src/component/component-collector-legacy.d.ts
declare namespace useComponentCollectorLegacy {
  type ReturnType = {
    ctx: {
      getAllComponents: (node: TSESTree$1.Program) => ClassComponentSemanticNode[];
    };
    visitor: ESLintUtils.RuleListener;
  };
}
/**
 * Get a ctx and visitor object for the rule to collect class componentss
 * @param context The ESLint rule context
 * @returns The ctx and visitor of the collector
 */
declare function useComponentCollectorLegacy(context: RuleContext): useComponentCollectorLegacy.ReturnType;
/**
 * Check whether the given node is a this.setState() call
 * @param node The node to check
 * @internal
 */
declare function isThisSetState(node: TSESTree$1.CallExpression): boolean;
/**
 * Check whether the given node is an assignment to this.state
 * @param node The node to check
 * @internal
 */
declare function isAssignmentToThisState(node: TSESTree$1.AssignmentExpression): boolean;
//#endregion
//#region src/component/component-definition.d.ts
/**
 * Determine if a function node represents a valid React component definition
 *
 * @param context The rule context
 * @param node The function node to analyze
 * @param hint Component detection hints (bit flags) to customize detection logic
 * @returns `true` if the node is considered a component definition
 */
declare function isComponentDefinition(context: RuleContext, node: ast.TSESTreeFunction, hint: bigint): boolean;
//#endregion
//#region src/component/component-id.d.ts
/**
 * Get function component identifier from `const Component = memo(() => {});`
 * @param context The rule context
 * @param node The function node to analyze
 * @returns The function identifier or `unit` if not found
 */
declare function getFunctionComponentId(context: RuleContext, node: ast.TSESTreeFunction): ast.FunctionID | unit;
//#endregion
//#region src/component/component-init-path.d.ts
/**
 * Get component flag from init path
 * @param initPath The init path of the function component
 * @returns The component flag
 */
declare function getComponentFlagFromInitPath(initPath: FunctionComponentSemanticNode["initPath"]): bigint;
//#endregion
//#region src/component/component-is.d.ts
/**
 * Check if a node is a React class component
 * @param node The AST node to check
 * @returns `true` if the node is a class component, `false` otherwise
 */
declare function isClassComponent(node: TSESTree.Node): node is ast.TSESTreeClass;
/**
 * Check if a node is a React PureComponent
 * @param node The AST node to check
 * @returns `true` if the node is a PureComponent, `false` otherwise
 */
declare function isPureComponent(node: TSESTree.Node): boolean;
//#endregion
//#region src/component/component-method-callback.d.ts
/**
 * Check if the given node is a componentDidMount callback
 * @param node The node to check
 * @returns True if the node is a componentDidMount callback, false otherwise
 */
declare function isComponentDidMountCallback(node: TSESTree.Node): boolean;
/**
 * Check if the given node is a componentWillUnmount callback
 * @param node The node to check
 * @returns True if the node is a componentWillUnmount callback, false otherwise
 */
declare function isComponentWillUnmountCallback(node: TSESTree.Node): boolean;
//#endregion
//#region src/component/component-method-is.d.ts
declare const isRender: (node: TSESTree.Node) => node is ast.TSESTreeMethodOrProperty;
declare const isComponentDidCatch: (node: TSESTree.Node) => node is ast.TSESTreeMethodOrProperty;
declare const isComponentDidMount: (node: TSESTree.Node) => node is ast.TSESTreeMethodOrProperty;
declare const isComponentDidUpdate: (node: TSESTree.Node) => node is ast.TSESTreeMethodOrProperty;
declare const isComponentWillMount: (node: TSESTree.Node) => node is ast.TSESTreeMethodOrProperty;
declare const isComponentWillReceiveProps: (node: TSESTree.Node) => node is ast.TSESTreeMethodOrProperty;
declare const isComponentWillUnmount: (node: TSESTree.Node) => node is ast.TSESTreeMethodOrProperty;
declare const isComponentWillUpdate: (node: TSESTree.Node) => node is ast.TSESTreeMethodOrProperty;
declare const isGetChildContext: (node: TSESTree.Node) => node is ast.TSESTreeMethodOrProperty;
declare const isGetInitialState: (node: TSESTree.Node) => node is ast.TSESTreeMethodOrProperty;
declare const isGetSnapshotBeforeUpdate: (node: TSESTree.Node) => node is ast.TSESTreeMethodOrProperty;
declare const isShouldComponentUpdate: (node: TSESTree.Node) => node is ast.TSESTreeMethodOrProperty;
declare const isUnsafeComponentWillMount: (node: TSESTree.Node) => node is ast.TSESTreeMethodOrProperty;
declare const isUnsafeComponentWillReceiveProps: (node: TSESTree.Node) => node is ast.TSESTreeMethodOrProperty;
declare const isUnsafeComponentWillUpdate: (node: TSESTree.Node) => node is ast.TSESTreeMethodOrProperty;
declare const isGetDefaultProps: (node: TSESTree.Node) => node is ast.TSESTreeMethodOrProperty;
declare const isGetDerivedStateFromProps: (node: TSESTree.Node) => node is ast.TSESTreeMethodOrProperty;
declare const isGetDerivedStateFromError: (node: TSESTree.Node) => node is ast.TSESTreeMethodOrProperty;
//#endregion
//#region src/component/component-name.d.ts
/**
 * Check if a string matches the strict component name pattern
 * @param name The name to check
 */
declare function isComponentName(name: string): boolean;
/**
 * Check if a string matches the loose component name pattern
 * @param name The name to check
 */
declare function isComponentNameLoose(name: string): boolean;
/**
 * Check if a function has a loose component name
 * @param context The rule context
 * @param fn The function to check
 * @param allowNone Whether to allow no name
 * @returns Whether the function has a loose component name
 */
declare function isFunctionWithLooseComponentName(context: RuleContext, fn: ast.TSESTreeFunction, allowNone?: boolean): boolean;
//#endregion
//#region src/component/component-render-method.d.ts
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
declare function isRenderMethodLike(node: TSESTree.Node): node is ast.TSESTreeMethodOrProperty;
//#endregion
//#region src/component/component-render-prop.d.ts
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
declare function isRenderFunctionLoose(context: RuleContext, node: TSESTree.Node): node is ast.TSESTreeFunction;
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
declare function isRenderPropLoose(context: RuleContext, node: TSESTree.JSXAttribute): boolean;
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
declare function isDirectValueOfRenderPropertyLoose(node: TSESTree.Node): boolean;
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
declare function isDeclaredInRenderPropLoose(node: TSESTree.Node): boolean;
//#endregion
//#region src/component/component-wrapper.d.ts
/**
 * Check if the node is a call expression for a component wrapper
 * @param context The ESLint rule context
 * @param node The node to check
 * @returns `true` if the node is a call expression for a component wrapper
 */
declare function isComponentWrapperCall(context: RuleContext, node: TSESTree.Node): boolean;
/**
 * Check if the node is a call expression for a component wrapper loosely
 * @param context The ESLint rule context
 * @param node The node to check
 * @returns `true` if the node is a call expression for a component wrapper loosely
 */
declare function isComponentWrapperCallLoose(context: RuleContext, node: TSESTree.Node): boolean;
/**
 * Check if the node is a callback function passed to a component wrapper
 * @param context The ESLint rule context
 * @param node The node to check
 * @returns `true` if the node is a callback function passed to a component wrapper
 */
declare function isComponentWrapperCallback(context: RuleContext, node: TSESTree.Node): boolean;
/**
 * Check if the node is a callback function passed to a component wrapper loosely
 * @param context The ESLint rule context
 * @param node The node to check
 * @returns `true` if the node is a callback function passed to a component wrapper loosely
 */
declare function isComponentWrapperCallbackLoose(context: RuleContext, node: TSESTree.Node): boolean;
//#endregion
//#region src/function/function-kind.d.ts
/**
 * Represents the kind of a React function
 */
type ComponentKind = "client-function" | "server-function";
//#endregion
//#region src/function/function-semantic-node.d.ts
/**
 * Represents a React Client Function
 */
interface ClientFunctionSemanticNode extends SemanticFunc {
  /**
   * The kind of function
   */
  kind: "client-function";
}
/**
 * Represents a React Server Function
 */
interface ServerFunctionSemanticNode extends SemanticFunc {
  /**
   * The kind of function
   */
  kind: "server-function";
}
/**
 * Represents a React Function
 */
type FunctionSemanticNode = ClientFunctionSemanticNode | ServerFunctionSemanticNode;
//#endregion
//#region src/hierarchy/find-enclosing-component-or-hook.d.ts
type FindEnclosingComponentOrHookFilter = (n: TSESTree.Node, name: string | null) => boolean;
/**
 * Find the enclosing React component or hook for a given AST node
 * @param node The AST node to start the search from
 * @param test Optional test function to customize component or hook identification
 * @returns The enclosing component or hook node, or `null` if none is ASAST.
 */
declare function findEnclosingComponentOrHook(node: TSESTree.Node | unit, test?: FindEnclosingComponentOrHookFilter): TSESTree.ArrowFunctionExpression | TSESTree.FunctionDeclarationWithName | TSESTree.FunctionDeclarationWithOptionalName | TSESTree.FunctionExpression | undefined;
//#endregion
//#region src/hierarchy/is-inside-component-or-hook.d.ts
/**
 * Check if a given AST node is inside a React component or hook
 * @param node The AST node to check
 * @returns True if the node is inside a component or hook, false otherwise
 */
declare function isInsideComponentOrHook(node: TSESTree.Node | unit): boolean;
//#endregion
//#region src/hook/hook-callback.d.ts
/**
 * Determine if a node is the setup function passed to a useEffect-like hook
 * @param node The AST node to check
 */
declare function isUseEffectSetupCallback(node: TSESTree.Node | unit): boolean;
/**
 * Determine if a node is the cleanup function returned by a useEffect-like hook's setup function
 * @param node The AST node to check
 */
declare function isUseEffectCleanupCallback(node: TSESTree.Node | unit): boolean;
//#endregion
//#region src/hook/hook-semantic-node.d.ts
/**
 * Represents a semantic hook node in the AST
 * This interface extends SemanticNode and provides additional properties for React hook analysis
 */
interface HookSemanticNode extends SemanticNode {
  /** The identifier of the hook */
  id: ast.FunctionID | unit;
  /** The AST node of the hook */
  node: ast.TSESTreeFunction;
  /** The name of the hook */
  name: string;
  /** The other hooks called by the hook */
  hookCalls: TSESTree.CallExpression[];
  /** The directives used in the function (e.g., "use strict", "use client", etc.) */
  directives: TSESTree.StringLiteral[];
}
//#endregion
//#region src/hook/hook-collector.d.ts
type FunctionEntry = {
  key: string;
  node: ast.TSESTreeFunction;
};
declare namespace useHookCollector {
  type ReturnType = {
    ctx: {
      getAllHooks(node: TSESTree$1.Program): HookSemanticNode[];
      getCurrentEntries(): FunctionEntry[];
      getCurrentEntry(): FunctionEntry | unit;
    };
    visitor: ESLintUtils.RuleListener;
  };
}
/**
 * Get a ctx and visitor object for the rule to collect hooks
 * @param context The ESLint rule context
 * @returns The ctx and visitor of the collector
 */
declare function useHookCollector(context: RuleContext): useHookCollector.ReturnType;
//#endregion
//#region src/hook/hook-id.d.ts
/**
 * Checks if the given node is a hook identifier
 * @param id The AST node to check
 * @returns `true` if the node is a hook identifier or member expression with hook name, `false` otherwise
 */
declare function isHookId(id: TSESTree.Node): id is TSESTree.Identifier | TSESTree.MemberExpression;
//#endregion
//#region src/hook/hook-is.d.ts
/**
 * Determine if a function node is a React Hook based on its name.
 * @param node The function node to check
 * @returns True if the function is a React Hook, false otherwise
 */
declare function isHook(node: ast.TSESTreeFunction | unit): boolean;
/**
 * Check if the given node is a React Hook call by its name.
 * @param node The node to check.
 * @returns `true` if the node is a React Hook call, `false` otherwise.
 */
declare function isHookCall(node: TSESTree.Node | unit): node is TSESTree.CallExpression;
/**
 * Check if a node is a call to a specific React hook.
 * Returns a function that accepts a hook name to check against.
 * @param node The AST node to check
 * @returns A function that takes a hook name and returns boolean
 */
declare function isHookCallWithName(node: TSESTree.Node | unit): (name: string) => boolean;
/**
 * Detect useEffect calls and variations (useLayoutEffect, etc.) using a regex pattern
 * @param node The AST node to check
 * @param additionalEffectHooks Regex pattern matching custom hooks that should be treated as effect hooks
 * @returns True if the node is a useEffect-like call
 */
declare function isUseEffectLikeCall(node: TSESTree.Node | unit, additionalEffectHooks?: RegExpLike): node is TSESTree.CallExpression;
/**
 * Detect useState calls and variations (useCustomState, etc.) using a regex pattern
 * @param node The AST node to check
 * @param additionalStateHooks Regex pattern matching custom hooks that should be treated as state hooks
 * @returns True if the node is a useState-like call
 */
declare function isUseStateLikeCall(node: TSESTree.Node | unit, additionalStateHooks?: RegExpLike): node is TSESTree.CallExpression;
declare const isUseCall: (node: TSESTree.Node | undefined) => boolean;
declare const isUseActionStateCall: (node: TSESTree.Node | undefined) => boolean;
declare const isUseCallbackCall: (node: TSESTree.Node | undefined) => boolean;
declare const isUseContextCall: (node: TSESTree.Node | undefined) => boolean;
declare const isUseDebugValueCall: (node: TSESTree.Node | undefined) => boolean;
declare const isUseDeferredValueCall: (node: TSESTree.Node | undefined) => boolean;
declare const isUseEffectCall: (node: TSESTree.Node | undefined) => boolean;
declare const isUseFormStatusCall: (node: TSESTree.Node | undefined) => boolean;
declare const isUseIdCall: (node: TSESTree.Node | undefined) => boolean;
declare const isUseImperativeHandleCall: (node: TSESTree.Node | undefined) => boolean;
declare const isUseInsertionEffectCall: (node: TSESTree.Node | undefined) => boolean;
declare const isUseLayoutEffectCall: (node: TSESTree.Node | undefined) => boolean;
declare const isUseMemoCall: (node: TSESTree.Node | undefined) => boolean;
declare const isUseOptimisticCall: (node: TSESTree.Node | undefined) => boolean;
declare const isUseReducerCall: (node: TSESTree.Node | undefined) => boolean;
declare const isUseRefCall: (node: TSESTree.Node | undefined) => boolean;
declare const isUseStateCall: (node: TSESTree.Node | undefined) => boolean;
declare const isUseSyncExternalStoreCall: (node: TSESTree.Node | undefined) => boolean;
declare const isUseTransitionCall: (node: TSESTree.Node | undefined) => boolean;
//#endregion
//#region src/hook/hook-name.d.ts
declare const REACT_BUILTIN_HOOK_NAMES: readonly ["use", "useActionState", "useCallback", "useContext", "useDebugValue", "useDeferredValue", "useEffect", "useFormStatus", "useId", "useImperativeHandle", "useInsertionEffect", "useLayoutEffect", "useMemo", "useOptimistic", "useReducer", "useRef", "useState", "useSyncExternalStore", "useTransition"];
/**
 * Catch all identifiers that begin with "use" followed by an uppercase Latin
 * character to exclude identifiers like "user".
 * @param name The name of the identifier to check.
 * @see https://github.com/facebook/react/blob/1d6c8168db1d82713202e842df3167787ffa00ed/packages/eslint-plugin-react-hooks/src/rules/RulesOfHooks.ts#L16
 */
declare function isHookName(name: string): boolean;
//#endregion
//#region src/jsx/jsx-attribute.d.ts
/**
 * Creates a helper function to find a specific JSX attribute by name
 * Handles direct attributes and spread attributes (variables or object literals)
 * @param context The ESLint rule context
 * @param node The JSX element node
 * @param initialScope (Optional) The initial scope to use for variable resolution
 */
declare function getJsxAttribute(context: RuleContext, node: TSESTree.JSXElement, initialScope?: Scope): (name: string) => TSESTree.JSXAttribute | TSESTree.JSXSpreadAttribute | undefined;
//#endregion
//#region src/jsx/jsx-attribute-name.d.ts
/**
 * Get the stringified name of a JSX attribute
 * @param context The ESLint rule context
 * @param node The JSX attribute node
 * @returns The name of the attribute
 */
declare function getJsxAttributeName(context: RuleContext, node: TSESTree$1.JSXAttribute): string;
//#endregion
//#region src/jsx/jsx-attribute-value.d.ts
/**
 * Represents possible JSX attribute value types that can be resolved
 */
type JsxAttributeValue = {
  kind: "boolean";
  toStatic(): true;
} | {
  kind: "element";
  node: TSESTree.JSXElement;
  toStatic(): unknown;
} | {
  kind: "literal";
  node: TSESTree.Literal;
  toStatic(): TSESTree.Literal["value"];
} | {
  kind: "expression";
  node: TSESTree.JSXExpressionContainer["expression"];
  toStatic(): unknown;
} | {
  kind: "spreadProps";
  node: TSESTree.JSXSpreadAttribute["argument"];
  toStatic(name?: string): unknown;
} | {
  kind: "spreadChild";
  node: TSESTree.JSXSpreadChild["expression"];
  toStatic(): unknown;
};
/**
 * Resolve the static value of a JSX attribute or spread attribute
 *
 * @param context - The ESLint rule context
 * @param attribute - The JSX attribute node to resolve
 * @returns An object containing the value kind, the node (if applicable), and a `toStatic` helper
 */
declare function resolveJsxAttributeValue(context: RuleContext, attribute: ast.TSESTreeJSXAttributeLike): {
  readonly kind: "boolean";
  readonly toStatic: () => true;
  readonly node?: never;
} | {
  readonly kind: "literal";
  readonly node: TSESTree.BigIntLiteral | TSESTree.BooleanLiteral | TSESTree.NullLiteral | TSESTree.NumberLiteral | TSESTree.RegExpLiteral | TSESTree.StringLiteral;
  readonly toStatic: () => string | number | bigint | boolean | RegExp | null;
} | {
  readonly kind: "expression";
  readonly node: TSESTree.JSXEmptyExpression | TSESTree.Expression;
  readonly toStatic: () => unknown;
} | {
  readonly kind: "element";
  readonly node: TSESTree.JSXElement;
  readonly toStatic: () => undefined;
} | {
  readonly kind: "spreadChild";
  readonly node: TSESTree.JSXEmptyExpression | TSESTree.Expression;
  readonly toStatic: () => undefined;
} | {
  readonly kind: "spreadProps";
  readonly node: TSESTree.Expression;
  readonly toStatic: (name?: string) => unknown;
};
//#endregion
//#region src/jsx/jsx-config.d.ts
declare const JsxEmit: {
  readonly None: 0;
  readonly Preserve: 1;
  readonly React: 2;
  readonly ReactNative: 3;
  readonly ReactJSX: 4;
  readonly ReactJSXDev: 5;
};
interface JsxConfig {
  jsx?: number;
  jsxFactory?: string;
  jsxFragmentFactory?: string;
  jsxImportSource?: string;
}
/**
 * Get JsxConfig from the rule context by reading compiler options
 * @param context The RuleContext
 * @returns JsxConfig derived from compiler options
 */
declare function getJsxConfigFromContext(context: RuleContext): {
  jsx: 4 | typescript.JsxEmit;
  jsxFactory: string;
  jsxFragmentFactory: string;
  jsxImportSource: string;
};
/**
 * Get JsxConfig from pragma comments (annotations) in the source code
 * @param context The RuleContext
 * @returns JsxConfig derived from pragma comments
 */
declare function getJsxConfigFromAnnotation(context: RuleContext): JsxConfig;
//#endregion
//#region src/jsx/jsx-detection.d.ts
/**
 * BitFlags for configuring JSX detection behavior
 */
type JsxDetectionHint = bigint;
declare const JsxDetectionHint: {
  readonly None: 0n;
  readonly DoNotIncludeJsxWithNullValue: bigint;
  readonly DoNotIncludeJsxWithNumberValue: bigint;
  readonly DoNotIncludeJsxWithBigIntValue: bigint;
  readonly DoNotIncludeJsxWithStringValue: bigint;
  readonly DoNotIncludeJsxWithBooleanValue: bigint;
  readonly DoNotIncludeJsxWithUndefinedValue: bigint;
  readonly DoNotIncludeJsxWithEmptyArrayValue: bigint;
  readonly DoNotIncludeJsxWithCreateElementValue: bigint;
  readonly RequireAllArrayElementsToBeJsx: bigint;
  readonly RequireBothSidesOfLogicalExpressionToBeJsx: bigint;
  readonly RequireBothBranchesOfConditionalExpressionToBeJsx: bigint;
};
/**
 * Default JSX detection configuration
 * Skips undefined and boolean literals (common in React)
 */
declare const DEFAULT_JSX_DETECTION_HINT: bigint;
/**
 * Check if a node is a `JSXText` or a `Literal` node
 * @param node The AST node to check
 * @returns `true` if the node is a `JSXText` or a `Literal` node
 */
declare function isJsxText(node: TSESTree$1.Node | null | unit): node is TSESTree$1.JSXText | TSESTree$1.Literal;
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
declare function isJsxLike(code: {
  getScope: (node: TSESTree$1.Node) => Scope;
}, node: TSESTree$1.Node | unit | null, hint?: JsxDetectionHint): boolean;
//#endregion
//#region src/jsx/jsx-element-is.d.ts
/**
 * Determine if a JSX element is a host element
 * Host elements in React start with lowercase letters (e.g., div, span)
 *
 * @param context ESLint rule context
 * @param node AST node to check
 * @returns boolean indicating if the element is a host element
 */
declare function isJsxHostElement(context: RuleContext, node: TSESTree.Node): boolean;
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
declare function isJsxFragmentElement(context: RuleContext, node: TSESTree.Node, jsxConfig?: Pick<JsxConfig, "jsxFragmentFactory">): boolean;
//#endregion
//#region src/jsx/jsx-element-type.d.ts
/**
 * Extracts the element type name from a JSX element or fragment
 * For JSX elements, returns the stringified name (e.g., "div", "Button", "React.Fragment")
 * For JSX fragments, returns an empty string
 *
 * @param context ESLint rule context
 * @param node JSX element or fragment node
 * @returns String representation of the element type
 */
declare function getJsxElementType(context: RuleContext, node: TSESTree.JSXElement | TSESTree.JSXFragment): string;
//#endregion
//#region src/jsx/jsx-hierarchy.d.ts
/**
 * Traverses up the AST to find a parent JSX attribute node that matches a given test
 *
 * @param node The starting AST node
 * @param test Optional predicate function to test if the attribute meets criteria
 *               Defaults to always returning true (matches any attribute)
 * @returns The first matching JSX attribute node found when traversing upwards, or undefined
 */
declare function findParentJsxAttribute(node: TSESTree.Node, test?: (node: TSESTree.JSXAttribute) => boolean): TSESTree.JSXAttribute | unit;
//#endregion
//#region src/jsx/jsx-stringify.d.ts
/**
 * Incomplete but sufficient stringification of JSX nodes for common use cases
 *
 * @param node JSX node from TypeScript ESTree
 * @returns String representation of the JSX node
 */
declare function stringifyJsx(node: TSESTree$1.JSXIdentifier | TSESTree$1.JSXNamespacedName | TSESTree$1.JSXMemberExpression | TSESTree$1.JSXOpeningElement | TSESTree$1.JSXClosingElement | TSESTree$1.JSXOpeningFragment | TSESTree$1.JSXClosingFragment | TSESTree$1.JSXText): string;
//#endregion
//#region src/ref/is-from-ref.d.ts
/**
 * Check if the variable with the given name is initialized or derived from a ref
 * @param name The variable name
 * @param initialScope The initial scope
 * @returns True if the variable is derived from a ref, false otherwise
 */
declare function isInitializedFromRef(name: string, initialScope: Scope): boolean;
/**
 * Get the init expression of a ref variable
 * @param name The variable name
 * @param initialScope The initial scope
 * @returns The init expression node if the variable is derived from a ref, or undefined otherwise
 */
declare function getRefInit(name: string, initialScope: Scope): TSESTree$1.Expression | unit;
//#endregion
//#region src/ref/ref-name.d.ts
/**
 * Check if a given name corresponds to a ref name
 * @param name The name to check
 * @returns True if the name is "ref" or ends with "Ref"
 */
declare function isRefName(name: string): boolean;
//#endregion
export { ClassComponentSemanticNode, ClientFunctionSemanticNode, ComponentDetectionHint, ComponentFlag, ComponentKind, ComponentSemanticNode, DEFAULT_COMPONENT_DETECTION_HINT, DEFAULT_JSX_DETECTION_HINT, FindEnclosingComponentOrHookFilter, FunctionComponentSemanticNode, FunctionSemanticNode, HookSemanticNode, JsxAttributeValue, JsxConfig, JsxDetectionHint, JsxEmit, REACT_BUILTIN_HOOK_NAMES, SemanticFunc, SemanticNode, ServerFunctionSemanticNode, findEnclosingComponentOrHook, findParentJsxAttribute, getComponentFlagFromInitPath, getFunctionComponentId, getJsxAttribute, getJsxAttributeName, getJsxConfigFromAnnotation, getJsxConfigFromContext, getJsxElementType, getRefInit, isAssignmentToThisState, isCaptureOwnerStack, isCaptureOwnerStackCall, isChildrenCount, isChildrenCountCall, isChildrenForEach, isChildrenForEachCall, isChildrenMap, isChildrenMapCall, isChildrenOnly, isChildrenOnlyCall, isChildrenToArray, isChildrenToArrayCall, isClassComponent, isCloneElement, isCloneElementCall, isComponentDefinition, isComponentDidCatch, isComponentDidMount, isComponentDidMountCallback, isComponentDidUpdate, isComponentName, isComponentNameLoose, isComponentWillMount, isComponentWillReceiveProps, isComponentWillUnmount, isComponentWillUnmountCallback, isComponentWillUpdate, isComponentWrapperCall, isComponentWrapperCallLoose, isComponentWrapperCallback, isComponentWrapperCallbackLoose, isCreateContext, isCreateContextCall, isCreateElement, isCreateElementCall, isCreateRef, isCreateRefCall, isDeclaredInRenderPropLoose, isDirectValueOfRenderPropertyLoose, isForwardRef, isForwardRefCall, isFunctionWithLooseComponentName, isGetChildContext, isGetDefaultProps, isGetDerivedStateFromError, isGetDerivedStateFromProps, isGetInitialState, isGetSnapshotBeforeUpdate, isHook, isHookCall, isHookCallWithName, isHookId, isHookName, isInitializedFromReact, isInitializedFromReactNative, isInitializedFromRef, isInsideComponentOrHook, isJsxFragmentElement, isJsxHostElement, isJsxLike, isJsxText, isLazy, isLazyCall, isMemo, isMemoCall, isPureComponent, isReactAPI, isReactAPICall, isRefName, isRender, isRenderFunctionLoose, isRenderMethodLike, isRenderPropLoose, isShouldComponentUpdate, isThisSetState, isUnsafeComponentWillMount, isUnsafeComponentWillReceiveProps, isUnsafeComponentWillUpdate, isUseActionStateCall, isUseCall, isUseCallbackCall, isUseContextCall, isUseDebugValueCall, isUseDeferredValueCall, isUseEffectCall, isUseEffectCleanupCallback, isUseEffectLikeCall, isUseEffectSetupCallback, isUseFormStatusCall, isUseIdCall, isUseImperativeHandleCall, isUseInsertionEffectCall, isUseLayoutEffectCall, isUseMemoCall, isUseOptimisticCall, isUseReducerCall, isUseRefCall, isUseStateCall, isUseStateLikeCall, isUseSyncExternalStoreCall, isUseTransitionCall, resolveJsxAttributeValue, stringifyJsx, useComponentCollector, useComponentCollectorLegacy, useHookCollector };