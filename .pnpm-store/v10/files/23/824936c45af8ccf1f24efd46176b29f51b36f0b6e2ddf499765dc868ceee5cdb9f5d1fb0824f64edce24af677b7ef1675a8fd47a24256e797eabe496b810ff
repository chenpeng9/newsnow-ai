import { unit } from "@eslint-react/eff";
import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/types";
import { TSESTree as TSESTree$1 } from "@typescript-eslint/utils";

//#region src/types.d.ts
/**
 * Represents function expressions and declarations in TSESTree
 */
type TSESTreeFunction = TSESTree$1.ArrowFunctionExpression | TSESTree$1.FunctionDeclaration | TSESTree$1.FunctionExpression;
/**
 * Represents all function-related types including TypeScript function types
 */
type TSESTreeFunctionType = TSESTree$1.TSCallSignatureDeclaration | TSESTree$1.TSConstructSignatureDeclaration | TSESTree$1.TSDeclareFunction | TSESTree$1.TSEmptyBodyFunctionExpression | TSESTree$1.TSFunctionType | TSESTree$1.TSMethodSignature | TSESTreeFunction;
/**
 * Represents class declarations and expressions in TSESTree
 */
type TSESTreeClass = TSESTree$1.ClassDeclaration | TSESTree$1.ClassExpression;
/**
 * Represents method definitions and property definitions in classes
 */
type TSESTreeMethodOrProperty = TSESTree$1.PropertyDefinition | TSESTree$1.MethodDefinition;
/**
 * Represents loop statements in TSESTree
 */
type TSESTreeLoop = TSESTree$1.DoWhileStatement | TSESTree$1.ForInStatement | TSESTree$1.ForOfStatement | TSESTree$1.ForStatement | TSESTree$1.WhileStatement;
/**
 * Represents TypeScript array and tuple types
 */
type TSESTreeArrayTupleType = TSESTree$1.TSArrayType | TSESTree$1.TSTupleType;
/**
 * Represents property-like nodes in TSESTree
 */
type TSESTreeProperty = TSESTree$1.PropertyDefinition | TSESTree$1.TSIndexSignature | TSESTree$1.TSParameterProperty | TSESTree$1.TSPropertySignature;
/**
 * Represents all JSX-related nodes in TSESTree
 */
type TSESTreeJSX = TSESTree$1.JSXAttribute | TSESTree$1.JSXChild | TSESTree$1.JSXClosingElement | TSESTree$1.JSXClosingFragment | TSESTree$1.JSXElement | TSESTree$1.JSXEmptyExpression | TSESTree$1.JSXExpression | TSESTree$1.JSXExpressionContainer | TSESTree$1.JSXFragment | TSESTree$1.JSXIdentifier | TSESTree$1.JSXIdentifierToken | TSESTree$1.JSXMemberExpression | TSESTree$1.JSXNamespacedName | TSESTree$1.JSXOpeningElement | TSESTree$1.JSXOpeningFragment | TSESTree$1.JSXSpreadAttribute | TSESTree$1.JSXSpreadChild | TSESTree$1.JSXTagNameExpression | TSESTree$1.JSXText | TSESTree$1.JSXTextToken;
/**
 * Represents JSX attribute-like nodes (attributes and spread attributes)
 */
type TSESTreeJSXAttributeLike = TSESTree$1.JSXAttribute | TSESTree$1.JSXSpreadAttribute;
/**
 * Represents destructuring patterns in variable declarations
 */
type TSESTreeDestructuringPattern = TSESTree$1.ArrayPattern | TSESTree$1.AssignmentPattern | TSESTree$1.ObjectPattern | TSESTree$1.RestElement;
/**
 * Represents TypeScript type declaration nodes
 */
type TSESTreeTypeDeclaration = TSESTree$1.TSInterfaceDeclaration | TSESTree$1.TSTypeAliasDeclaration;
/**
 * Represents TypeScript type expression nodes (type assertions, non-null expressions, etc.)
 */
type TSESTreeTypeExpression = TSESTree$1.TSAsExpression | TSESTree$1.TSNonNullExpression | TSESTree$1.TSSatisfiesExpression | TSESTree$1.TSTypeAssertion | TSESTree$1.TSInstantiationExpression;
/**
 * Represents TypeScript type assertion expressions (excluding instantiation expressions)
 */
type TSESTreeTypeAssertionExpression = TSESTree$1.TSAsExpression | TSESTree$1.TSNonNullExpression | TSESTree$1.TSSatisfiesExpression | TSESTree$1.TSTypeAssertion;
/**
 * Represents a directive expression statement in TSESTree (e.g., "use strict";)
 */
type TSESTreeDirective = TSESTree$1.ExpressionStatement & {
  directive: string;
  expression: TSESTree$1.StringLiteral;
};
/**
 * Represents a directive-like expression statement in TSESTree
 */
type TSESTreeDirectiveLike = TSESTree$1.ExpressionStatement & {
  expression: TSESTree$1.StringLiteral;
};
//#endregion
//#region src/class-id.d.ts
/**
 * Get the class identifier of a class node
 * @param node The class node to get the identifier from
 * @returns The class identifier or unit if not found
 */
declare function getClassId(node: TSESTreeClass): TSESTree.BindingName | unit;
//#endregion
//#region src/directive-is.d.ts
/**
 * Check if a node is a directive expression statement
 * @param node The node to check
 * @returns True if the node is a directive, false otherwise
 */
declare function isDirective(node: TSESTree.Node): node is TSESTreeDirective;
/**
 * Check if a node is a directive-like expression statement
 * @param node The node to check
 * @returns True if the node is a directive, false otherwise
 */
declare function isDirectiveLike(node: TSESTree.Node): node is TSESTreeDirectiveLike;
//#endregion
//#region src/directive-kind.d.ts
type DirectiveKind = "use client" | "use server" | "use memo" | "use no memo";
/**
 * Check if a node is a directive kind
 * @param kind The kind to check
 * @returns True if the kind is a directive kind, false otherwise
 */
declare function isDirectiveKind(kind: string): kind is DirectiveKind;
//#endregion
//#region src/directive-name.d.ts
/**
 * Check if a string is a directive name
 * @param name The string to check
 * @returns True if the string is a directive name, false otherwise
 */
declare function isDirectiveName(name: string): boolean;
//#endregion
//#region src/equal.d.ts
/**
 * Check if two nodes are equal
 * @param a node to compare
 * @param b node to compare
 * @returns `true` if node equal
 * @see https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/src/util/isNodeEqual.ts
 */
declare const isNodeEqual: {
  (a: TSESTree.Node): (b: TSESTree.Node) => boolean;
  (a: TSESTree.Node, b: TSESTree.Node): boolean;
};
//#endregion
//#region src/expression-base.d.ts
/**
 * Unwraps any type expressions to get the underlying JavaScript expression node.
 * Recursively processes nodes until a non-type expression is found.
 * @param node The AST node to unwrap
 * @returns The underlying JavaScript expression node
 */
declare function getUnderlyingExpression(node: TSESTree.Node): Exclude<TSESTree.Node, TSESTreeTypeExpression>;
//#endregion
//#region src/expression-is.d.ts
/**
 * Check if the given expression is a 'this' expression
 * Unwraps any type expressions before checking
 *
 * @param node The expression node to check
 * @returns True if the expression is a 'this' expression, false otherwise
 */
declare function isThisExpressionLoose(node: TSESTree.Expression): boolean;
//#endregion
//#region src/expression-nested.d.ts
/**
 * Get all nested identifiers in a expression like node
 * @param node The node to get the nested identifiers from
 * @returns All nested identifiers
 */
declare function getNestedIdentifiers(node: TSESTree.Node): readonly TSESTree.Identifier[];
/**
 * Gets the nested return statements in the node that are within the same function
 * @param node The AST node
 * @returns The nested return statements in the node
 */
declare function getNestedReturnStatements(node: TSESTree.Node): readonly TSESTree.ReturnStatement[];
/**
 * Get all nested expressions of type T in an expression like node
 * @param type The type of the expression to retrieve within the node
 * @returns A partially applied function bound to a predicate of type AST. The returned function can be called passing a
 * node, and it will return an array of all nested expressions of type AST.
 */
declare function getNestedExpressionsOfType<TNodeType extends AST_NODE_TYPES>(type: TNodeType): (node: TSESTree.Node) => Extract<TSESTree.Node, {
  type: TNodeType;
}>[];
/**
 * Get all nested new expressions in an expression like node
 * @param node The node to get the nested new expressions from
 * @returns All nested new expressions
 */
declare const getNestedNewExpressions: (node: TSESTree.Node) => TSESTree.NewExpression[];
/**
 * Get all nested call expressions in a expression like node
 * @param node The node to get the nested call expressions from
 * @returns All nested call expressions
 */
declare const getNestedCallExpressions: (node: TSESTree.Node) => TSESTree.CallExpression[];
//#endregion
//#region src/file-directive.d.ts
/**
 * Get all directive expression statements from the top of a program AST node
 * @param node The program AST node
 * @returns The array of directive string literals (e.g., "use strict")
 */
declare function getFileDirectives(node: TSESTree.Program): TSESTreeDirective[];
//#endregion
//#region src/function-directive.d.ts
/**
 * Get all directive expression statements from the top of a function AST node
 * @param node The function AST node
 * @returns The array of directive string literals (e.g., "use memo", "use no memo")
 */
declare function getFunctionDirectives(node: TSESTreeFunction): TSESTreeDirective[];
//#endregion
//#region src/function-id.d.ts
/**
 * Gets the static name of a function AST node. For function declarations it is
 * easy. For anonymous function expressions it is much harder. If you search for
 * `IsAnonymousFunctionDefinition()` in the ECMAScript spec you'll find places
 * where JS gives anonymous function expressions names. We roughly detect the
 * same AST nodes with some exceptions to better fit our use case.
 */
declare function getFunctionId(node: TSESTree.Expression | TSESTreeFunction): TSESTree.ArrayExpression | TSESTree.ArrayPattern | TSESTree.ArrowFunctionExpression | TSESTree.AssignmentExpression | TSESTree.AwaitExpression | TSESTree.PrivateInExpression | TSESTree.SymmetricBinaryExpression | TSESTree.CallExpression | TSESTree.ChainExpression | TSESTree.ClassExpression | TSESTree.ConditionalExpression | TSESTree.FunctionExpression | TSESTree.Identifier | TSESTree.ImportExpression | TSESTree.JSXElement | TSESTree.JSXFragment | TSESTree.BigIntLiteral | TSESTree.BooleanLiteral | TSESTree.NullLiteral | TSESTree.NumberLiteral | TSESTree.RegExpLiteral | TSESTree.StringLiteral | TSESTree.TemplateLiteral | TSESTree.LogicalExpression | TSESTree.MemberExpressionComputedName | TSESTree.MemberExpressionNonComputedName | TSESTree.MetaProperty | TSESTree.NewExpression | TSESTree.ObjectExpression | TSESTree.ObjectPattern | TSESTree.SequenceExpression | TSESTree.Super | TSESTree.TaggedTemplateExpression | TSESTree.ThisExpression | TSESTree.TSAsExpression | TSESTree.TSInstantiationExpression | TSESTree.TSNonNullExpression | TSESTree.TSSatisfiesExpression | TSESTree.TSTypeAssertion | TSESTree.UnaryExpressionBitwiseNot | TSESTree.UnaryExpressionDelete | TSESTree.UnaryExpressionMinus | TSESTree.UnaryExpressionNot | TSESTree.UnaryExpressionPlus | TSESTree.UnaryExpressionTypeof | TSESTree.UnaryExpressionVoid | TSESTree.UpdateExpression | TSESTree.YieldExpression | TSESTree.PrivateIdentifier | undefined;
/**
 * Type representing the return type of getFunctionId
 */
type FunctionID = ReturnType<typeof getFunctionId>;
//#endregion
//#region src/function-init-path.d.ts
/**
 * Represents various AST paths for React component function declarations
 * Each tuple type represents a specific component definition pattern
 */
type FunctionInitPath = readonly [TSESTree.FunctionDeclaration] | readonly [TSESTree.VariableDeclaration, TSESTree.VariableDeclarator, TSESTreeFunction] | readonly [TSESTree.VariableDeclaration, TSESTree.VariableDeclarator, TSESTree.CallExpression, TSESTreeFunction] | readonly [TSESTree.VariableDeclaration, TSESTree.VariableDeclarator, TSESTree.CallExpression, TSESTree.CallExpression, TSESTreeFunction] | readonly [TSESTree.VariableDeclaration, TSESTree.VariableDeclarator, TSESTree.ObjectExpression, TSESTree.Property, TSESTreeFunction] | readonly [TSESTree.VariableDeclaration, TSESTree.VariableDeclarator, TSESTree.ObjectExpression, TSESTree.Property, TSESTree.CallExpression, TSESTreeFunction] | readonly [TSESTree.VariableDeclaration, TSESTree.VariableDeclarator, TSESTree.ObjectExpression, TSESTree.Property, TSESTree.CallExpression, TSESTree.CallExpression, TSESTreeFunction] | readonly [TSESTree.ClassDeclaration, TSESTree.ClassBody, TSESTree.MethodDefinition, TSESTreeFunction] | readonly [TSESTree.ClassDeclaration, TSESTree.ClassBody, TSESTree.PropertyDefinition, TSESTreeFunction];
/**
 * Identifies the initialization path of a function node in the ast.
 * Determine what kind of component declaration pattern the function belongs to.
 *
 * @param node The function node to analyze
 * @returns The function initialization path or unit if not identifiable
 */
declare function getFunctionInitPath(node: TSESTreeFunction): unit | FunctionInitPath;
/**
 * Check if a specific function call exists in the function initialization path.
 * Useful for detecting HOCs like React.memo, React.forwardRef, etc.
 *
 * @param callName The name of the call to check for (e.g., "memo", "forwardRef")
 * @param initPath The function initialization path to search in
 * @returns True if the call exists in the path, false otherwise
 */
declare function hasCallInFunctionInitPath(callName: string, initPath: FunctionInitPath): boolean;
//#endregion
//#region src/function-is.d.ts
/**
 * Check if a function is empty
 * @param node The function node to check
 * @returns True if the function is empty, false otherwise
 */
declare function isFunctionEmpty(node: TSESTreeFunction): boolean;
/**
 * Check if a function is immediately invoked
 * @param node The function node to check
 * @returns True if the function is immediately invoked, false otherwise
 */
declare function isFunctionImmediatelyInvoked(node: TSESTreeFunction): boolean;
//#endregion
//#region src/identifier-is.d.ts
/**
 * Check if the given node is an identifier
 * @param node The node to check
 * @param name The name to check
 * @returns True if the node is an identifier, false otherwise
 */
declare function isIdentifier(node: TSESTree.Node | null | unit, name?: string): node is TSESTree.Identifier;
//#endregion
//#region src/identifier-name.d.ts
/**
 * Check if a string is a valid JavaScript identifier name
 * @param name The string to check
 * @returns True if the string is a valid identifier name
 */
declare function isIdentifierName(name: string): boolean;
//#endregion
//#region src/is.d.ts
/**
 * Type guard to check if a node is of a specific AST node type
 * @param nodeType The AST node type to check against
 * @returns A type guard function that narrows the node type
 */
declare const is: <NodeType extends TSESTree.AST_NODE_TYPES>(nodeType: NodeType) => (node: TSESTree.Node | null | undefined) => node is Extract<TSESTree.Node, {
  type: NodeType;
}>;
/**
 * Type guard to check if a node is one of multiple AST node types
 * @param nodeTypes Array of AST node types to check against
 * @returns A type guard function that narrows the node type
 */
declare const isOneOf: <NodeTypes extends readonly TSESTree.AST_NODE_TYPES[]>(nodeTypes: NodeTypes) => (node: TSESTree.Node | null | undefined) => node is Extract<TSESTree.Node, {
  type: NodeTypes[number];
}>;
/**
 * Check if a node is a function (arrow, declaration, or expression)
 * @param node The node to check
 * @returns True if the node is a function
 */
declare const isFunction: (node: TSESTree.Node | null | undefined) => node is TSESTree.ArrowFunctionExpression | TSESTree.FunctionExpression | TSESTree.FunctionDeclarationWithName | TSESTree.FunctionDeclarationWithOptionalName;
/**
 * Check if a node is a function type (including TypeScript function types)
 * @param node The node to check
 * @returns True if the node is a function type
 */
declare const isFunctionType: (node: TSESTree.Node | null | undefined) => node is TSESTree.ArrowFunctionExpression | TSESTree.FunctionExpression | TSESTree.FunctionDeclarationWithName | TSESTree.FunctionDeclarationWithOptionalName | TSESTree.TSCallSignatureDeclaration | TSESTree.TSConstructSignatureDeclaration | TSESTree.TSDeclareFunctionNoDeclare | TSESTree.TSDeclareFunctionWithDeclare | TSESTree.TSEmptyBodyFunctionExpression | TSESTree.TSFunctionType | TSESTree.TSMethodSignatureComputedName | TSESTree.TSMethodSignatureNonComputedName;
/**
 * Check if a node is a class declaration or expression
 * @param node The node to check
 * @returns True if the node is a class
 */
declare const isClass: (node: TSESTree.Node | null | undefined) => node is TSESTree.ClassExpression | TSESTree.ClassDeclarationWithName | TSESTree.ClassDeclarationWithOptionalName;
/**
 * Check if a node is a method or property definition
 * @param node The node to check
 * @returns True if the node is a method or property definition
 */
declare const isMethodOrProperty: (node: TSESTree.Node | null | undefined) => node is TSESTree.MethodDefinitionComputedName | TSESTree.MethodDefinitionNonComputedName | TSESTree.PropertyDefinitionComputedName | TSESTree.PropertyDefinitionNonComputedName;
/**
 * Check if a node is a property-like node (including TypeScript property signatures)
 * @param node The node to check
 * @returns True if the node is a property
 */
declare const isProperty: (node: TSESTree.Node | null | undefined) => node is TSESTree.PropertyDefinitionComputedName | TSESTree.PropertyDefinitionNonComputedName | TSESTree.TSIndexSignature | TSESTree.TSParameterProperty | TSESTree.TSPropertySignatureComputedName | TSESTree.TSPropertySignatureNonComputedName;
/**
 * Check if a node is a JSX element
 * @param node The node to check
 * @returns True if the node is a JSX element
 */
declare const isJSXElement: (node: TSESTree.Node | null | undefined) => node is TSESTree.JSXElement;
/**
 * Check if a node is a JSX fragment
 * @param node The node to check
 * @returns True if the node is a JSX fragment
 */
declare const isJSXFragment: (node: TSESTree.Node | null | undefined) => node is TSESTree.JSXFragment;
/**
 * Check if a node is a JSX tag name expression (identifier, member expression, or namespaced name)
 * @param node The node to check
 * @returns True if the node is a JSX tag name expression
 */
declare const isJSXTagNameExpression: (node: TSESTree.Node | null | undefined) => node is TSESTree.JSXIdentifier | TSESTree.JSXMemberExpression | TSESTree.JSXNamespacedName;
/**
 * Check if a node is a JSX-related node
 * @param node The node to check
 * @returns True if the node is a JSX node
 */
declare const isJSX: (node: TSESTree.Node | null | undefined) => node is TSESTree.JSXElement | TSESTree.JSXFragment | TSESTree.JSXAttribute | TSESTree.JSXClosingElement | TSESTree.JSXClosingFragment | TSESTree.JSXEmptyExpression | TSESTree.JSXExpressionContainer | TSESTree.JSXIdentifier | TSESTree.JSXMemberExpression | TSESTree.JSXNamespacedName | TSESTree.JSXOpeningElement | TSESTree.JSXOpeningFragment | TSESTree.JSXSpreadAttribute | TSESTree.JSXSpreadChild | TSESTree.JSXText;
/**
 * Check if a node is a loop statement
 * @param node The node to check
 * @returns True if the node is a loop
 */
declare const isLoop: (node: TSESTree.Node | null | undefined) => node is TSESTree.DoWhileStatement | TSESTree.ForInStatement | TSESTree.ForOfStatement | TSESTree.ForStatement | TSESTree.WhileStatement;
/**
 * Check if a node is a control flow statement (loop, if, or switch)
 * @param node The node to check
 * @returns True if the node is a control flow statement
 */
declare const isControlFlow: (data: TSESTree.Node | null | undefined) => data is TSESTree.DoWhileStatement | TSESTree.ForInStatement | TSESTree.ForOfStatement | TSESTree.ForStatement | TSESTree.IfStatement | TSESTree.SwitchStatement | TSESTree.WhileStatement;
/**
 * Check if a node is a conditional expression or control flow statement
 * @param node The node to check
 * @returns True if the node is conditional
 */
declare const isConditional: (data: TSESTree.Node | null | undefined) => data is TSESTree.ConditionalExpression | TSESTree.LogicalExpression | TSESTree.DoWhileStatement | TSESTree.ForInStatement | TSESTree.ForOfStatement | TSESTree.ForStatement | TSESTree.IfStatement | TSESTree.SwitchStatement | TSESTree.WhileStatement;
/**
 * Check if a node is a TypeScript type expression
 * @param node The node to check
 * @returns True if the node is a type expression
 */
declare const isTypeExpression: (node: TSESTree.Node | null | undefined) => node is TSESTree.TSAsExpression | TSESTree.TSInstantiationExpression | TSESTree.TSNonNullExpression | TSESTree.TSSatisfiesExpression | TSESTree.TSTypeAssertion;
/**
 * Check if a node is a TypeScript type assertion expression
 * @param node The node to check
 * @returns True if the node is a type assertion expression
 */
declare const isTypeAssertionExpression: (node: TSESTree.Node | null | undefined) => node is TSESTree.TSAsExpression | TSESTree.TSNonNullExpression | TSESTree.TSSatisfiesExpression | TSESTree.TSTypeAssertion;
//#endregion
//#region src/kind.d.ts
declare function getHumanReadableKind(node: TSESTree.Node, delimiter?: string): "RegExp literal" | Lowercase<string> | `JSX ${Lowercase<string>}`;
//#endregion
//#region src/line.d.ts
declare function isMultiLine(node: TSESTree.Node): boolean;
declare function isLineBreak(node: TSESTree.Node): boolean;
//#endregion
//#region src/literal.d.ts
/**
 * Check if a node is a literal value
 * @param node The node to check
 * @returns True if the node is a literal
 */
declare function isLiteral(node: TSESTree.Node): node is TSESTree.Literal;
declare function isLiteral(node: TSESTree.Node, type: "boolean"): node is TSESTree.BooleanLiteral;
declare function isLiteral(node: TSESTree.Node, type: "null"): node is TSESTree.NullLiteral;
declare function isLiteral(node: TSESTree.Node, type: "number"): node is TSESTree.NumberLiteral;
declare function isLiteral(node: TSESTree.Node, type: "regexp"): node is TSESTree.RegExpLiteral;
declare function isLiteral(node: TSESTree.Node, type: "string"): node is TSESTree.StringLiteral;
//#endregion
//#region src/name.d.ts
declare function getFullyQualifiedName(node: TSESTree.Node, getText: (node: TSESTree.Node) => string): string;
//#endregion
//#region src/process-env-node-env.d.ts
/**
 * Check if the given node is a member expression that accesses `process.env.NODE_ENV`
 * @param node The AST node
 * @returns True if the node is a member expression that accesses `process.env.NODE_ENV`, false otherwise
 */
declare function isProcessEnvNodeEnv(node: TSESTree.Node | null | unit): node is TSESTree.MemberExpression;
/**
 * Check if the given node is a binary expression that compares `process.env.NODE_ENV` with a string literal.
 * @param node The AST node
 * @param operator The operator used in the comparison
 * @param value The string literal value to compare against
 * @returns True if the node is a binary expression that compares `process.env.NODE_ENV` with the specified value, false otherwise
 */
declare function isProcessEnvNodeEnvCompare(node: TSESTree.Node | null | unit, operator: "===" | "!==", value: "development" | "production"): node is TSESTree.BinaryExpression;
//#endregion
//#region src/property-name.d.ts
/**
 * Get the name of a property from a node
 * Handles identifiers, private identifiers, literals, and template literals
 * @param node The node to get the property name from
 * @returns The property name or unit if not determinable
 */
declare function getPropertyName(node: TSESTree.Node): string | unit;
//#endregion
//#region src/selectors.d.ts
/**
 * Represents an arrow function expression with an implicit return
 */
type ImplicitReturnArrowFunctionExpression = TSESTree$1.ArrowFunctionExpression & {
  body: TSESTree$1.Expression;
};
/**
 * Represents a variable declarator with object destructuring and an identifier initializer
 */
type ObjectDestructuringVariableDeclarator = TSESTree$1.VariableDeclarator & {
  id: TSESTree$1.ObjectPattern;
  init: TSESTree$1.Identifier;
};
/**
 * Represents an assignment expression that assigns to a displayName property
 */
type DisplayNameAssignmentExpression = TSESTree$1.AssignmentExpression & {
  type: "AssignmentExpression";
  left: TSESTree$1.MemberExpression & {
    property: TSESTree$1.Identifier & {
      name: "displayName";
    };
  };
  operator: "=";
  right: TSESTree$1.Literal;
};
/**
 * Selector for arrow function expressions with implicit return
 */
declare const SEL_IMPLICIT_RETURN_ARROW_FUNCTION_EXPRESSION = "ArrowFunctionExpression[body.type!='BlockStatement']";
/**
 * Selector for variable declarators with object destructuring
 */
declare const SEL_OBJECT_DESTRUCTURING_VARIABLE_DECLARATOR: string;
/**
 * Selector for assignment expressions that set displayName
 */
declare const SEL_DISPLAY_NAME_ASSIGNMENT_EXPRESSION: string;
//#endregion
//#region src/traverse.d.ts
/**
 * Find the parent node that satisfies the test function
 * @param node The AST node
 * @param test The test function
 * @returns The parent node that satisfies the test function or `_` if not found
 */
declare function findParentNode<A extends TSESTree.Node>(node: TSESTree.Node | unit, test: (n: TSESTree.Node) => n is A): A | unit;
/**
 * Find the parent node that satisfies the test function or `_` if not found
 * @param node The AST node
 * @param test The test function
 * @returns The parent node that satisfies the test function
 */
declare function findParentNode(node: TSESTree.Node | unit, test: (node: TSESTree.Node) => boolean): TSESTree.Node | unit;
//#endregion
//#region src/vitest-mock.d.ts
/**
 * Check if the given node is a `vi.mock`.
 * @param node The node to check
 * @returns `true` if the node is a `vi.mock`, otherwise `false`.
 * @internal
 */
declare function isViMock(node: TSESTree.Node | null | unit): node is TSESTree.MemberExpression;
/**
 * Check if the given node is a `vi.mock` callback.
 * @param node The node to check
 * @returns `true` if the node is a `vi.mock` callback, otherwise `false`.
 * @internal
 */
declare function isViMockCallback(node: TSESTree.Node | null | unit): boolean;
//#endregion
export { DirectiveKind, DisplayNameAssignmentExpression, FunctionID, FunctionInitPath, ImplicitReturnArrowFunctionExpression, ObjectDestructuringVariableDeclarator, SEL_DISPLAY_NAME_ASSIGNMENT_EXPRESSION, SEL_IMPLICIT_RETURN_ARROW_FUNCTION_EXPRESSION, SEL_OBJECT_DESTRUCTURING_VARIABLE_DECLARATOR, TSESTreeArrayTupleType, TSESTreeClass, TSESTreeDestructuringPattern, TSESTreeDirective, TSESTreeDirectiveLike, TSESTreeFunction, TSESTreeFunctionType, TSESTreeJSX, TSESTreeJSXAttributeLike, TSESTreeLoop, TSESTreeMethodOrProperty, TSESTreeProperty, TSESTreeTypeAssertionExpression, TSESTreeTypeDeclaration, TSESTreeTypeExpression, findParentNode, getClassId, getFileDirectives, getFullyQualifiedName, getFunctionDirectives, getFunctionId, getFunctionInitPath, getHumanReadableKind, getNestedCallExpressions, getNestedExpressionsOfType, getNestedIdentifiers, getNestedNewExpressions, getNestedReturnStatements, getPropertyName, getUnderlyingExpression, hasCallInFunctionInitPath, is, isClass, isConditional, isControlFlow, isDirective, isDirectiveKind, isDirectiveLike, isDirectiveName, isFunction, isFunctionEmpty, isFunctionImmediatelyInvoked, isFunctionType, isIdentifier, isIdentifierName, isJSX, isJSXElement, isJSXFragment, isJSXTagNameExpression, isLineBreak, isLiteral, isLoop, isMethodOrProperty, isMultiLine, isNodeEqual, isOneOf, isProcessEnvNodeEnv, isProcessEnvNodeEnvCompare, isProperty, isThisExpressionLoose, isTypeAssertionExpression, isTypeExpression, isViMock, isViMockCallback };