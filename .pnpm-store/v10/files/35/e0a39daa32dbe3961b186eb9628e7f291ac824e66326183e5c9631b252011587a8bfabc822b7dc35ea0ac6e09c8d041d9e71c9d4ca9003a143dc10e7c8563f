import { unit } from "@eslint-react/eff";
import { TSESTree } from "@typescript-eslint/types";
import { Scope, Variable } from "@typescript-eslint/scope-manager";
import { RuleContext } from "@eslint-react/shared";

//#region src/find-enclosing-assignment-target.d.ts
/**
 * Finds the enclosing assignment target (variable, property, etc.) for a given node
 *
 * @todo Verify correctness and completeness of this function
 * @param node The starting node
 * @returns The enclosing assignment target node, or undefined if not found
 */
declare function findEnclosingAssignmentTarget(node: TSESTree.Node): TSESTree.ArrayExpression | TSESTree.ArrayPattern | TSESTree.ArrowFunctionExpression | TSESTree.AssignmentExpression | TSESTree.AwaitExpression | TSESTree.PrivateInExpression | TSESTree.SymmetricBinaryExpression | TSESTree.CallExpression | TSESTree.ChainExpression | TSESTree.ClassExpression | TSESTree.ConditionalExpression | TSESTree.FunctionExpression | TSESTree.Identifier | TSESTree.ImportExpression | TSESTree.JSXElement | TSESTree.JSXFragment | TSESTree.BigIntLiteral | TSESTree.BooleanLiteral | TSESTree.NullLiteral | TSESTree.NumberLiteral | TSESTree.RegExpLiteral | TSESTree.StringLiteral | TSESTree.LogicalExpression | TSESTree.MemberExpressionComputedName | TSESTree.MemberExpressionNonComputedName | TSESTree.MetaProperty | TSESTree.NewExpression | TSESTree.ObjectExpression | TSESTree.ObjectPattern | TSESTree.PrivateIdentifier | TSESTree.SequenceExpression | TSESTree.Super | TSESTree.TaggedTemplateExpression | TSESTree.TemplateLiteral | TSESTree.ThisExpression | TSESTree.TSAsExpression | TSESTree.TSInstantiationExpression | TSESTree.TSNonNullExpression | TSESTree.TSSatisfiesExpression | TSESTree.TSTypeAssertion | TSESTree.UnaryExpressionBitwiseNot | TSESTree.UnaryExpressionDelete | TSESTree.UnaryExpressionMinus | TSESTree.UnaryExpressionNot | TSESTree.UnaryExpressionPlus | TSESTree.UnaryExpressionTypeof | TSESTree.UnaryExpressionVoid | TSESTree.UpdateExpression | TSESTree.YieldExpression | undefined;
/**
 * Type representing the possible assignment targets returned by `findEnclosingAssignmentTarget`
 */
type AssignmentTarget = ReturnType<typeof findEnclosingAssignmentTarget>;
//#endregion
//#region src/find-import-source.d.ts
/**
 * Find the import source of a variable
 * @param name The variable name
 * @param initialScope The initial scope to search
 * @returns The import source or undefined if not found
 */
declare function findImportSource(name: string, initialScope: Scope): string | undefined;
//#endregion
//#region src/find-property.d.ts
/**
 * Find a property by name in an array of properties
 * Handles spread elements by recursively resolving the referenced object
 * @param name The property name to find
 * @param properties The array of properties to search
 * @param initialScope The scope to use for variable resolution
 * @param seen Set of already seen variable names to prevent circular references
 * @returns The found property or unit if not found
 */
declare function findProperty(name: string, properties: (TSESTree.Property | TSESTree.RestElement | TSESTree.SpreadElement)[], initialScope: Scope, seen?: Set<string>): (typeof properties)[number] | unit;
//#endregion
//#region src/get-child-scopes.d.ts
/**
 * Get all child scopes recursively from a given scope
 * @param scope The scope to get child scopes from
 * @returns Array of all child scopes including the input scope
 */
declare function getChildScopes(scope: Scope): readonly Scope[];
//#endregion
//#region src/get-object-type.d.ts
/**
 * Represents the type classification of an object node
 */
type ObjectType = {
  kind: "jsx";
  node: TSESTree.JSXElement | TSESTree.JSXFragment;
} | {
  kind: "array";
  node: TSESTree.ArrayExpression;
} | {
  kind: "plain";
  node: TSESTree.ObjectExpression;
} | {
  kind: "class";
  node: TSESTree.ClassExpression;
} | {
  kind: "instance";
  node: TSESTree.NewExpression | TSESTree.ThisExpression;
} | {
  kind: "function";
  node: TSESTree.FunctionDeclaration | TSESTree.FunctionExpression | TSESTree.ArrowFunctionExpression;
} | {
  kind: "regexp";
  node: TSESTree.RegExpLiteral;
} | {
  kind: "unknown";
  node: TSESTree.Node;
  reason: "call-expression" | "unsupported-node";
};
/**
 * Detect the ObjectType of a given node
 * @param node The node to check
 * @param initialScope  The initial scope to check for variable declarations
 * @returns The ObjectType of the node, or undefined if not detected
 */
declare function getObjectType(node: TSESTree.Node | unit, initialScope: Scope): ObjectType | unit;
//#endregion
//#region src/get-variable-definition-node.d.ts
/**
 * Get the definition node of a variable at a specific definition index
 * @param variable The variable to get the definition node from
 * @param at The index of the definition to retrieve (negative index supported)
 * @returns The definition node or unit if not found
 */
declare function getVariableDefinitionNode(variable: Variable | unit, at: number): unit | TSESTree.ClassDeclaration | TSESTree.ClassDeclarationWithName | TSESTree.ClassDeclarationWithOptionalName | TSESTree.Expression | TSESTree.FunctionDeclaration | TSESTree.FunctionDeclarationWithName | TSESTree.FunctionDeclarationWithOptionalName;
/**
 * Get the definition node of a variable at a specific definition index (loose version)
 * Also returns the function node if the definition is a parameter
 * @param variable The variable to get the definition node from
 * @param at The index of the definition to retrieve
 * @returns The definition node or unit if not found
 */
declare function getVariableDefinitionNodeLoose(variable: Variable | unit, at: number): unit | TSESTree.ClassDeclaration | TSESTree.ClassDeclarationWithName | TSESTree.ClassDeclarationWithOptionalName | TSESTree.Expression | TSESTree.FunctionDeclaration | TSESTree.FunctionDeclarationWithName | TSESTree.FunctionDeclarationWithOptionalName;
//#endregion
//#region src/get-variables-from-scope.d.ts
/**
 * Get all variables from the given scope up to the global scope
 * @param initialScope The scope to start from
 * @returns All variables from the given scope up to the global scope
 */
declare function getVariables(initialScope: Scope): Variable[];
/**
 * Find a variable by name or identifier node in the scope chain
 * @param initialScope The scope to start searching from
 * @returns The found variable or unit if not found
 * @overload
 * @param nameOrNode The variable name or identifier node to find
 * @param initialScope The scope to start searching from
 * @returns The found variable or unit if not found
 */
declare const findVariable: {
  (initialScope: Scope): (nameOrNode: string | TSESTree.Identifier | unit) => Variable | unit;
  (nameOrNode: string | TSESTree.Identifier | unit, initialScope: Scope): Variable | unit;
};
//#endregion
//#region src/is-assignment-target-equal.d.ts
/**
 * Check if two assignment targets are equal
 * Compares nodes directly or by their values
 * @param context The rule context
 * @param a The first node to compare
 * @param b The second node to compare
 * @returns True if the assignment targets are equal
 * @internal
 */
declare function isAssignmentTargetEqual(context: RuleContext, a: TSESTree.Node, b: TSESTree.Node): boolean;
//#endregion
//#region src/is-node-value-equal.d.ts
/**
 * Determine whether node value equals to another node value
 * @param a node to compare
 * @param b node to compare
 * @param initialScopes initial scopes of the two nodes
 * @returns `true` if node value equal
 */
declare function isNodeValueEqual(a: TSESTree.Node, b: TSESTree.Node, initialScopes: [aScope: Scope, bScope: Scope]): boolean;
//#endregion
export { AssignmentTarget, ObjectType, findEnclosingAssignmentTarget, findImportSource, findProperty, findVariable, getChildScopes, getObjectType, getVariableDefinitionNode, getVariableDefinitionNodeLoose, getVariables, isAssignmentTargetEqual, isNodeValueEqual };