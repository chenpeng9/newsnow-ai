import { dual, identity, unit } from "@eslint-react/eff";
import { AST_NODE_TYPES } from "@typescript-eslint/types";
import * as ast from "@eslint-react/ast";
import { P, match } from "ts-pattern";
import { DefinitionType, ScopeType } from "@typescript-eslint/scope-manager";
import * as astUtils from "@typescript-eslint/utils/ast-utils";
import { getStaticValue } from "@typescript-eslint/utils/ast-utils";

//#region src/find-enclosing-assignment-target.ts
/** eslint-disable jsdoc/require-param */
/**
* Finds the enclosing assignment target (variable, property, etc.) for a given node
*
* @todo Verify correctness and completeness of this function
* @param node The starting node
* @returns The enclosing assignment target node, or undefined if not found
*/
function findEnclosingAssignmentTarget(node) {
	switch (true) {
		case node.type === AST_NODE_TYPES.VariableDeclarator: return node.id;
		case node.type === AST_NODE_TYPES.AssignmentExpression: return node.left;
		case node.type === AST_NODE_TYPES.PropertyDefinition: return node.key;
		case node.type === AST_NODE_TYPES.BlockStatement || node.type === AST_NODE_TYPES.Program || node.parent === node: return unit;
		default: return findEnclosingAssignmentTarget(node.parent);
	}
}

//#endregion
//#region src/get-variables-from-scope.ts
/**
* Get all variables from the given scope up to the global scope
* @param initialScope The scope to start from
* @returns All variables from the given scope up to the global scope
*/
function getVariables(initialScope) {
	let scope = initialScope;
	const variables = [...scope.variables];
	while (scope.type !== ScopeType.global) {
		scope = scope.upper;
		variables.push(...scope.variables);
	}
	return variables.reverse();
}
/**
* Find a variable by name or identifier node in the scope chain
* @param initialScope The scope to start searching from
* @returns The found variable or unit if not found
* @overload
* @param nameOrNode The variable name or identifier node to find
* @param initialScope The scope to start searching from
* @returns The found variable or unit if not found
*/
const findVariable = dual(2, (nameOrNode, initialScope) => {
	if (nameOrNode == null) return unit;
	return astUtils.findVariable(initialScope, nameOrNode) ?? unit;
});

//#endregion
//#region src/find-import-source.ts
/**
* Get the arguments of a require expression
* @param node The node to match
* @returns The require expression arguments or undefined if the node is not a require expression
*/
function getRequireExpressionArguments(node) {
	return match(node).with({
		type: AST_NODE_TYPES.CallExpression,
		arguments: P.select(),
		callee: {
			type: AST_NODE_TYPES.Identifier,
			name: "require"
		}
	}, identity).with({
		type: AST_NODE_TYPES.MemberExpression,
		object: P.select()
	}, getRequireExpressionArguments).otherwise(() => null);
}
/**
* Find the import source of a variable
* @param name The variable name
* @param initialScope The initial scope to search
* @returns The import source or undefined if not found
*/
function findImportSource(name, initialScope) {
	const latestDef = findVariable(name, initialScope)?.defs.at(-1);
	if (latestDef == null) return unit;
	const { node, parent } = latestDef;
	if (node.type === AST_NODE_TYPES.VariableDeclarator && node.init != null) {
		const { init } = node;
		if (init.type === AST_NODE_TYPES.MemberExpression && init.object.type === AST_NODE_TYPES.Identifier) return findImportSource(init.object.name, initialScope);
		if (init.type === AST_NODE_TYPES.Identifier) return findImportSource(init.name, initialScope);
		const arg0 = getRequireExpressionArguments(init)?.[0];
		if (arg0 == null || !ast.isLiteral(arg0, "string")) return unit;
		return arg0.value;
	}
	if (parent?.type === AST_NODE_TYPES.ImportDeclaration) return parent.source.value;
	return unit;
}

//#endregion
//#region src/get-variable-definition-node.ts
/**
* Get the definition node of a variable at a specific definition index
* @param variable The variable to get the definition node from
* @param at The index of the definition to retrieve (negative index supported)
* @returns The definition node or unit if not found
*/
function getVariableDefinitionNode(variable, at) {
	if (variable == null) return unit;
	const def = variable.defs.at(at);
	if (def == null) return unit;
	switch (true) {
		case def.type === DefinitionType.FunctionName && def.node.type === AST_NODE_TYPES.FunctionDeclaration: return def.node;
		case def.type === DefinitionType.ClassName && def.node.type === AST_NODE_TYPES.ClassDeclaration: return def.node;
		case "init" in def.node && def.node.init != null && !("declarations" in def.node.init): return def.node.init;
		default: return unit;
	}
}
/**
* Get the definition node of a variable at a specific definition index (loose version)
* Also returns the function node if the definition is a parameter
* @param variable The variable to get the definition node from
* @param at The index of the definition to retrieve
* @returns The definition node or unit if not found
*/
function getVariableDefinitionNodeLoose(variable, at) {
	if (variable == null) return unit;
	const node = getVariableDefinitionNode(variable, at);
	if (node != null) return node;
	const def = variable.defs.at(at);
	if (def?.type === DefinitionType.Parameter && ast.isFunction(def.node)) return def.node;
	return unit;
}

//#endregion
//#region src/find-property.ts
/**
* Find a property by name in an array of properties
* Handles spread elements by recursively resolving the referenced object
* @param name The property name to find
* @param properties The array of properties to search
* @param initialScope The scope to use for variable resolution
* @param seen Set of already seen variable names to prevent circular references
* @returns The found property or unit if not found
*/
function findProperty(name, properties, initialScope, seen = /* @__PURE__ */ new Set()) {
	return properties.findLast((prop) => {
		if (prop.type === AST_NODE_TYPES.Property) return "name" in prop.key && prop.key.name === name;
		if (prop.type === AST_NODE_TYPES.SpreadElement) switch (prop.argument.type) {
			case AST_NODE_TYPES.Identifier: {
				if (seen.has(prop.argument.name)) return false;
				const variableNode = getVariableDefinitionNode(findVariable(prop.argument.name, initialScope), 0);
				if (variableNode?.type === AST_NODE_TYPES.ObjectExpression) {
					seen.add(prop.argument.name);
					return findProperty(name, variableNode.properties, initialScope, seen) != null;
				}
				return false;
			}
			case AST_NODE_TYPES.ObjectExpression: return findProperty(name, prop.argument.properties, initialScope, seen) != null;
			default: return false;
		}
		return false;
	});
}

//#endregion
//#region src/get-child-scopes.ts
/**
* Get all child scopes recursively from a given scope
* @param scope The scope to get child scopes from
* @returns Array of all child scopes including the input scope
*/
function getChildScopes(scope) {
	const scopes = [scope];
	for (const childScope of scope.childScopes) scopes.push(...getChildScopes(childScope));
	return scopes;
}

//#endregion
//#region src/get-object-type.ts
/**
* Detect the ObjectType of a given node
* @param node The node to check
* @param initialScope  The initial scope to check for variable declarations
* @returns The ObjectType of the node, or undefined if not detected
*/
function getObjectType(node, initialScope) {
	if (node == null) return unit;
	switch (node.type) {
		case AST_NODE_TYPES.JSXElement:
		case AST_NODE_TYPES.JSXFragment: return {
			kind: "jsx",
			node
		};
		case AST_NODE_TYPES.ArrayExpression: return {
			kind: "array",
			node
		};
		case AST_NODE_TYPES.ObjectExpression: return {
			kind: "plain",
			node
		};
		case AST_NODE_TYPES.ClassExpression: return {
			kind: "class",
			node
		};
		case AST_NODE_TYPES.NewExpression:
		case AST_NODE_TYPES.ThisExpression: return {
			kind: "instance",
			node
		};
		case AST_NODE_TYPES.FunctionDeclaration:
		case AST_NODE_TYPES.FunctionExpression:
		case AST_NODE_TYPES.ArrowFunctionExpression: return {
			kind: "function",
			node
		};
		case AST_NODE_TYPES.Literal:
			if ("regex" in node) return {
				kind: "regexp",
				node
			};
			return unit;
		case AST_NODE_TYPES.Identifier:
			if (!("name" in node) || typeof node.name !== "string") return unit;
			return getObjectType(getVariableDefinitionNode(initialScope.set.get(node.name), -1), initialScope);
		case AST_NODE_TYPES.MemberExpression:
			if (!("object" in node)) return unit;
			return getObjectType(node.object, initialScope);
		case AST_NODE_TYPES.AssignmentExpression:
		case AST_NODE_TYPES.AssignmentPattern:
			if (!("right" in node)) return unit;
			return getObjectType(node.right, initialScope);
		case AST_NODE_TYPES.LogicalExpression: return getObjectType(node.right, initialScope);
		case AST_NODE_TYPES.ConditionalExpression: return getObjectType(node.consequent, initialScope) ?? getObjectType(node.alternate, initialScope);
		case AST_NODE_TYPES.SequenceExpression:
			if (node.expressions.length === 0) return unit;
			return getObjectType(node.expressions[node.expressions.length - 1], initialScope);
		case AST_NODE_TYPES.CallExpression: return {
			kind: "unknown",
			node,
			reason: "call-expression"
		};
		default:
			if (!("expression" in node) || typeof node.expression !== "object") return unit;
			return getObjectType(node.expression, initialScope);
	}
}

//#endregion
//#region src/is-node-value-equal.ts
const thisBlockTypes = [
	AST_NODE_TYPES.FunctionDeclaration,
	AST_NODE_TYPES.FunctionExpression,
	AST_NODE_TYPES.ClassBody,
	AST_NODE_TYPES.Program
];
/**
* Determine whether node value equals to another node value
* @param a node to compare
* @param b node to compare
* @param initialScopes initial scopes of the two nodes
* @returns `true` if node value equal
*/
function isNodeValueEqual(a, b, initialScopes) {
	a = ast.isTypeExpression(a) ? ast.getUnderlyingExpression(a) : a;
	b = ast.isTypeExpression(b) ? ast.getUnderlyingExpression(b) : b;
	const [aScope, bScope] = initialScopes;
	switch (true) {
		case a === b: return true;
		case a.type === AST_NODE_TYPES.Literal && b.type === AST_NODE_TYPES.Literal: return a.value === b.value;
		case a.type === AST_NODE_TYPES.TemplateElement && b.type === AST_NODE_TYPES.TemplateElement: return a.value.cooked === b.value.cooked;
		case a.type === AST_NODE_TYPES.Identifier && b.type === AST_NODE_TYPES.Identifier: {
			const aVar = findVariable(a, aScope);
			const bVar = findVariable(b, bScope);
			const aVarNode = getVariableDefinitionNodeLoose(aVar, 0);
			const bVarNode = getVariableDefinitionNodeLoose(bVar, 0);
			const aVarNodeParent = aVarNode?.parent;
			const bVarNodeParent = bVarNode?.parent;
			const aDef = aVar?.defs.at(0);
			const bDef = bVar?.defs.at(0);
			const aDefParentParent = aDef?.parent?.parent;
			const bDefParentParent = bDef?.parent?.parent;
			switch (true) {
				case aVarNodeParent?.type === AST_NODE_TYPES.CallExpression && bVarNodeParent?.type === AST_NODE_TYPES.CallExpression && ast.isFunction(aVarNode) && ast.isFunction(bVarNode): {
					if (!ast.isNodeEqual(aVarNodeParent.callee, bVarNodeParent.callee)) return false;
					const aParams = aVarNode.params;
					const bParams = bVarNode.params;
					const aPos = aParams.findIndex((x) => ast.isNodeEqual(x, a));
					const bPos = bParams.findIndex((x) => ast.isNodeEqual(x, b));
					return aPos !== -1 && bPos !== -1 && aPos === bPos;
				}
				case aDefParentParent?.type === AST_NODE_TYPES.ForOfStatement && bDefParentParent?.type === AST_NODE_TYPES.ForOfStatement: {
					const aLeft = aDefParentParent.left;
					const bLeft = bDefParentParent.left;
					if (aLeft.type !== bLeft.type) return false;
					const aRight = aDefParentParent.right;
					const bRight = bDefParentParent.right;
					return ast.isNodeEqual(aRight, bRight);
				}
				default: return aVar != null && bVar != null && aVar === bVar;
			}
		}
		case a.type === AST_NODE_TYPES.MemberExpression && b.type === AST_NODE_TYPES.MemberExpression: return ast.isNodeEqual(a.property, b.property) && isNodeValueEqual(a.object, b.object, initialScopes);
		case a.type === AST_NODE_TYPES.ThisExpression && b.type === AST_NODE_TYPES.ThisExpression:
			if (aScope.block === bScope.block) return true;
			return ast.findParentNode(a, ast.isOneOf(thisBlockTypes)) === ast.findParentNode(b, ast.isOneOf(thisBlockTypes));
		default: {
			const aStatic = getStaticValue(a, aScope);
			const bStatic = getStaticValue(b, bScope);
			return aStatic != null && bStatic != null && aStatic.value === bStatic.value;
		}
	}
}

//#endregion
//#region src/is-assignment-target-equal.ts
/**
* Check if two assignment targets are equal
* Compares nodes directly or by their values
* @param context The rule context
* @param a The first node to compare
* @param b The second node to compare
* @returns True if the assignment targets are equal
* @internal
*/
function isAssignmentTargetEqual(context, a, b) {
	return ast.isNodeEqual(a, b) || isNodeValueEqual(a, b, [context.sourceCode.getScope(a), context.sourceCode.getScope(b)]);
}

//#endregion
export { findEnclosingAssignmentTarget, findImportSource, findProperty, findVariable, getChildScopes, getObjectType, getVariableDefinitionNode, getVariableDefinitionNodeLoose, getVariables, isAssignmentTargetEqual, isNodeValueEqual };