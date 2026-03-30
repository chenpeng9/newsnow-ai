import { DEFAULT_ESLINT_REACT_SETTINGS, WEBSITE_URL, getConfigAdapters } from "@eslint-react/shared";
import * as ast from "@eslint-react/ast";
import * as core from "@eslint-react/core";
import { dual, or, unit } from "@eslint-react/eff";
import { findEnclosingAssignmentTarget, findProperty, findVariable, getVariableDefinitionNode, isAssignmentTargetEqual, isNodeValueEqual } from "@eslint-react/var";
import { AST_NODE_TYPES, ESLintUtils } from "@typescript-eslint/utils";
import { getStaticValue } from "@typescript-eslint/utils/ast-utils";
import { P, isMatching, match } from "ts-pattern";
import birecord from "birecord";

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
	rules: () => rules,
	settings: () => settings
});
const name$1 = "react-web-api/recommended";
const rules = {
	"react-web-api/no-leaked-event-listener": "warn",
	"react-web-api/no-leaked-interval": "warn",
	"react-web-api/no-leaked-resize-observer": "warn",
	"react-web-api/no-leaked-timeout": "warn"
};
const settings = { "react-x": DEFAULT_ESLINT_REACT_SETTINGS };

//#endregion
//#region package.json
var name = "eslint-plugin-react-web-api";
var version = "2.13.0";

//#endregion
//#region src/types/component-phase.ts
const ComponentPhaseRelevance = birecord({
	mount: "unmount",
	setup: "cleanup"
});
const isInversePhase = dual(2, (a, b) => ComponentPhaseRelevance.get(a) === b);
function getPhaseKindOfFunction(node) {
	return match(node).when(core.isUseEffectSetupCallback, () => "setup").when(core.isUseEffectCleanupCallback, () => "cleanup").when(core.isComponentDidMountCallback, () => "mount").when(core.isComponentWillUnmountCallback, () => "unmount").otherwise(() => null);
}

//#endregion
//#region src/utils/create-rule.ts
function getDocsUrl(ruleName) {
	return `${WEBSITE_URL}/docs/rules/web-api-${ruleName}`;
}
const createRule = ESLintUtils.RuleCreator(getDocsUrl);

//#endregion
//#region src/rules/no-leaked-event-listener.ts
const RULE_NAME$3 = "no-leaked-event-listener";
const defaultOptions = {
	capture: false,
	signal: unit
};
function getCallKind$3(node) {
	switch (true) {
		case node.callee.type === AST_NODE_TYPES.Identifier && isMatching(P.union("addEventListener", "removeEventListener", "abort"))(node.callee.name): return node.callee.name;
		case node.callee.type === AST_NODE_TYPES.MemberExpression && node.callee.property.type === AST_NODE_TYPES.Identifier && isMatching(P.union("addEventListener", "removeEventListener", "abort"))(node.callee.property.name): return node.callee.property.name;
		default: return "other";
	}
}
function getFunctionKind$1(node) {
	return getPhaseKindOfFunction(node) ?? "other";
}
function getSignalValueExpression(node, initialScope) {
	if (node == null) return unit;
	switch (node.type) {
		case AST_NODE_TYPES.Identifier: return getSignalValueExpression(getVariableDefinitionNode(findVariable(node, initialScope), 0), initialScope);
		case AST_NODE_TYPES.MemberExpression: return node;
		default: return unit;
	}
}
function getOptions(node, initialScope) {
	function findProp(properties, propName) {
		return findProperty(propName, properties, initialScope);
	}
	function getPropValue(prop, filter = (a) => true) {
		if (prop?.type !== AST_NODE_TYPES.Property) return unit;
		const { value } = prop;
		let v = value;
		switch (value.type) {
			case AST_NODE_TYPES.Literal:
				v = value.value;
				break;
			default:
				v = getStaticValue(value, initialScope)?.value;
				break;
		}
		return filter(v) ? v : unit;
	}
	function getOpts(node) {
		switch (node.type) {
			case AST_NODE_TYPES.Identifier: {
				const variableNode = getVariableDefinitionNode(findVariable(node, initialScope), 0);
				if (variableNode?.type === AST_NODE_TYPES.ObjectExpression) return getOpts(variableNode);
				return defaultOptions;
			}
			case AST_NODE_TYPES.Literal: return {
				...defaultOptions,
				capture: Boolean(node.value)
			};
			case AST_NODE_TYPES.ObjectExpression: {
				const vCapture = !!getPropValue(findProp(node.properties, "capture"));
				const pSignal = findProp(node.properties, "signal");
				return {
					capture: vCapture,
					signal: pSignal?.type === AST_NODE_TYPES.Property ? getSignalValueExpression(pSignal.value, initialScope) : unit
				};
			}
			default: return defaultOptions;
		}
	}
	return getOpts(node);
}
var no_leaked_event_listener_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Enforces that every 'addEventListener' in a component or custom hook has a corresponding 'removeEventListener'." },
		messages: {
			expectedRemoveEventListenerInCleanup: "An 'addEventListener' in '{{effectMethodKind}}' should have a corresponding 'removeEventListener' in its cleanup function.",
			expectedRemoveEventListenerInUnmount: "An 'addEventListener' in 'componentDidMount' should have a corresponding 'removeEventListener' in 'componentWillUnmount' method.",
			unexpectedInlineFunction: "A/an '{{eventMethodKind}}' should not have an inline listener function."
		},
		schema: []
	},
	name: RULE_NAME$3,
	create: create$3,
	defaultOptions: []
});
function create$3(context) {
	if (!context.sourceCode.text.includes("addEventListener")) return {};
	if (!/use\w*Effect|componentDidMount|componentWillUnmount/u.test(context.sourceCode.text)) return {};
	const fEntries = [];
	const aEntries = [];
	const rEntries = [];
	const abortedSignals = [];
	function isSameObject(a, b) {
		switch (true) {
			case a.type === AST_NODE_TYPES.MemberExpression && b.type === AST_NODE_TYPES.MemberExpression: return ast.isNodeEqual(a.object, b.object);
			default: return false;
		}
	}
	function isInverseEntry(aEntry, rEntry) {
		const { type: aType, callee: aCallee, capture: aCapture, listener: aListener, phase: aPhase } = aEntry;
		const { type: rType, callee: rCallee, capture: rCapture, listener: rListener, phase: rPhase } = rEntry;
		if (!isInversePhase(aPhase, rPhase)) return false;
		return isSameObject(aCallee, rCallee) && ast.isNodeEqual(aListener, rListener) && isNodeValueEqual(aType, rType, [context.sourceCode.getScope(aType), context.sourceCode.getScope(rType)]) && aCapture === rCapture;
	}
	function checkInlineFunction(node, callKind, options) {
		const listener = node.arguments.at(1);
		if (!ast.isFunction(listener)) return;
		if (options.signal != null) return;
		context.report({
			messageId: "unexpectedInlineFunction",
			node: listener,
			data: { eventMethodKind: callKind }
		});
	}
	return {
		[":function"](node) {
			const kind = getFunctionKind$1(node);
			fEntries.push({
				kind,
				node
			});
		},
		[":function:exit"]() {
			fEntries.pop();
		},
		["CallExpression"](node) {
			const fKind = fEntries.findLast((x) => x.kind !== "other")?.kind;
			if (fKind == null) return;
			if (!ComponentPhaseRelevance.has(fKind)) return;
			match(getCallKind$3(node)).with("addEventListener", (callKind) => {
				if (node.callee.type === AST_NODE_TYPES.MemberExpression && node.callee.object.type === AST_NODE_TYPES.Identifier && core.isInitializedFromReactNative(node.callee.object.name, context.sourceCode.getScope(node))) return;
				const [type, listener, options] = node.arguments;
				if (type == null || listener == null) return;
				const opts = options == null ? defaultOptions : getOptions(options, context.sourceCode.getScope(options));
				const { callee } = node;
				checkInlineFunction(node, callKind, opts);
				aEntries.push({
					...opts,
					type,
					node,
					callee,
					listener,
					method: "addEventListener",
					phase: fKind
				});
			}).with("removeEventListener", (callKind) => {
				const [type, listener, options] = node.arguments;
				if (type == null || listener == null) return;
				const opts = options == null ? defaultOptions : getOptions(options, context.sourceCode.getScope(options));
				const { callee } = node;
				checkInlineFunction(node, callKind, opts);
				rEntries.push({
					...opts,
					type,
					node,
					callee,
					listener,
					method: "removeEventListener",
					phase: fKind
				});
			}).with("abort", () => {
				abortedSignals.push(node.callee);
			}).otherwise(() => null);
		},
		["Program:exit"]() {
			for (const aEntry of aEntries) {
				if (aEntry.signal != null) continue;
				if (rEntries.some((rEntry) => isInverseEntry(aEntry, rEntry))) continue;
				switch (aEntry.phase) {
					case "setup":
					case "cleanup":
						context.report({
							messageId: "expectedRemoveEventListenerInCleanup",
							node: aEntry.node,
							data: { effectMethodKind: "useEffect" }
						});
						continue;
					case "mount":
					case "unmount":
						context.report({
							messageId: "expectedRemoveEventListenerInUnmount",
							node: aEntry.node
						});
						continue;
				}
			}
		}
	};
}

//#endregion
//#region src/rules/no-leaked-interval.ts
const RULE_NAME$2 = "no-leaked-interval";
function getCallKind$2(node) {
	switch (true) {
		case node.callee.type === AST_NODE_TYPES.Identifier && isMatching(P.union("setInterval", "clearInterval"))(node.callee.name): return node.callee.name;
		case node.callee.type === AST_NODE_TYPES.MemberExpression && node.callee.property.type === AST_NODE_TYPES.Identifier && isMatching(P.union("setInterval", "clearInterval"))(node.callee.property.name): return node.callee.property.name;
		default: return "other";
	}
}
var no_leaked_interval_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Enforces that every 'setInterval' in a component or custom hook has a corresponding 'clearInterval'." },
		messages: {
			expectedClearIntervalInCleanup: "A 'setInterval' created in '{{ kind }}' must be cleared with 'clearInterval' in the cleanup function.",
			expectedClearIntervalInUnmount: "A 'setInterval' created in '{{ kind }}' must be cleared with 'clearInterval' in the 'componentWillUnmount' method.",
			expectedIntervalId: "A 'setInterval' must be assigned to a variable for proper cleanup."
		},
		schema: []
	},
	name: RULE_NAME$2,
	create: create$2,
	defaultOptions: []
});
function create$2(context) {
	if (!context.sourceCode.text.includes("setInterval")) return {};
	const fEntries = [];
	const sEntries = [];
	const cEntries = [];
	function isInverseEntry(a, b) {
		return isAssignmentTargetEqual(context, a.timerId, b.timerId);
	}
	return {
		[":function"](node) {
			const kind = getPhaseKindOfFunction(node) ?? "other";
			fEntries.push({
				kind,
				node
			});
		},
		[":function:exit"]() {
			fEntries.pop();
		},
		["CallExpression"](node) {
			switch (getCallKind$2(node)) {
				case "setInterval": {
					const fEntry = fEntries.findLast((x) => x.kind !== "other");
					if (fEntry == null) break;
					if (!ComponentPhaseRelevance.has(fEntry.kind)) break;
					const intervalIdNode = findEnclosingAssignmentTarget(node);
					if (intervalIdNode == null) {
						context.report({
							messageId: "expectedIntervalId",
							node
						});
						break;
					}
					sEntries.push({
						kind: "interval",
						node,
						callee: node.callee,
						phase: fEntry.kind,
						timerId: intervalIdNode
					});
					break;
				}
				case "clearInterval": {
					const fEntry = fEntries.findLast((x) => x.kind !== "other");
					if (fEntry == null) break;
					if (!ComponentPhaseRelevance.has(fEntry.kind)) break;
					const [intervalIdNode] = node.arguments;
					if (intervalIdNode == null) break;
					cEntries.push({
						kind: "interval",
						node,
						callee: node.callee,
						phase: fEntry.kind,
						timerId: intervalIdNode
					});
					break;
				}
			}
		},
		["Program:exit"]() {
			for (const sEntry of sEntries) {
				if (cEntries.some((cEntry) => isInverseEntry(sEntry, cEntry))) continue;
				switch (sEntry.phase) {
					case "setup":
					case "cleanup":
						context.report({
							messageId: "expectedClearIntervalInCleanup",
							node: sEntry.node,
							data: { kind: "useEffect" }
						});
						continue;
					case "mount":
					case "unmount":
						context.report({
							messageId: "expectedClearIntervalInUnmount",
							node: sEntry.node,
							data: { kind: "componentDidMount" }
						});
						continue;
				}
			}
		}
	};
}

//#endregion
//#region src/rules/no-leaked-resize-observer.ts
const RULE_NAME$1 = "no-leaked-resize-observer";
function isNewResizeObserver(node) {
	return node?.type === AST_NODE_TYPES.NewExpression && node.callee.type === AST_NODE_TYPES.Identifier && node.callee.name === "ResizeObserver";
}
function isFromObserver(context, node) {
	switch (true) {
		case node.type === AST_NODE_TYPES.Identifier: return isNewResizeObserver(getVariableDefinitionNode(findVariable(node, context.sourceCode.getScope(node)), 0));
		case node.type === AST_NODE_TYPES.MemberExpression: return isFromObserver(context, node.object);
		default: return false;
	}
}
function getCallKind$1(context, node) {
	switch (true) {
		case node.callee.type === AST_NODE_TYPES.Identifier && isMatching(P.union("observe", "unobserve", "disconnect"))(node.callee.name) && isFromObserver(context, node.callee): return node.callee.name;
		case node.callee.type === AST_NODE_TYPES.MemberExpression && node.callee.property.type === AST_NODE_TYPES.Identifier && isMatching(P.union("observe", "unobserve", "disconnect"))(node.callee.property.name) && isFromObserver(context, node.callee): return node.callee.property.name;
		default: return "other";
	}
}
function getFunctionKind(node) {
	return getPhaseKindOfFunction(node) ?? "other";
}
var no_leaked_resize_observer_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Enforces that every 'ResizeObserver' created in a component or custom hook has a corresponding 'ResizeObserver.disconnect()'." },
		messages: {
			expectedDisconnectInControlFlow: "Dynamically added 'ResizeObserver.observe' should be cleared all at once using 'ResizeObserver.disconnect' in the cleanup function.",
			expectedDisconnectOrUnobserveInCleanup: "A 'ResizeObserver' instance created in 'useEffect' must be disconnected in the cleanup function.",
			unexpectedFloatingInstance: "A 'ResizeObserver' instance created in component or custom hook must be assigned to a variable for proper cleanup."
		},
		schema: []
	},
	name: RULE_NAME$1,
	create: create$1,
	defaultOptions: []
});
function create$1(context) {
	if (!context.sourceCode.text.includes("ResizeObserver")) return {};
	const fEntries = [];
	const observers = [];
	const oEntries = [];
	const uEntries = [];
	const dEntries = [];
	return {
		[":function"](node) {
			const kind = getFunctionKind(node);
			fEntries.push({
				kind,
				node
			});
		},
		[":function:exit"]() {
			fEntries.pop();
		},
		["CallExpression"](node) {
			if (node.callee.type !== AST_NODE_TYPES.MemberExpression) return;
			const fKind = fEntries.findLast((x) => x.kind !== "other")?.kind;
			if (fKind == null || !ComponentPhaseRelevance.has(fKind)) return;
			const { object } = node.callee;
			match(getCallKind$1(context, node)).with("disconnect", () => {
				dEntries.push({
					kind: "ResizeObserver",
					node,
					callee: node.callee,
					method: "disconnect",
					observer: object,
					phase: fKind
				});
			}).with("observe", () => {
				const [element] = node.arguments;
				if (element == null) return;
				oEntries.push({
					kind: "ResizeObserver",
					node,
					callee: node.callee,
					element,
					method: "observe",
					observer: object,
					phase: fKind
				});
			}).with("unobserve", () => {
				const [element] = node.arguments;
				if (element == null) return;
				uEntries.push({
					kind: "ResizeObserver",
					node,
					callee: node.callee,
					element,
					method: "unobserve",
					observer: object,
					phase: fKind
				});
			}).otherwise(() => null);
		},
		["NewExpression"](node) {
			const fEntry = fEntries.findLast((x) => x.kind !== "other");
			if (fEntry == null) return;
			if (!ComponentPhaseRelevance.has(fEntry.kind)) return;
			if (!isNewResizeObserver(node)) return;
			const id = findEnclosingAssignmentTarget(node);
			if (id == null) {
				context.report({
					messageId: "unexpectedFloatingInstance",
					node
				});
				return;
			}
			observers.push({
				id,
				node,
				phase: fEntry.kind,
				phaseNode: fEntry.node
			});
		},
		["Program:exit"]() {
			for (const { id, node, phaseNode } of observers) {
				if (dEntries.some((e) => isAssignmentTargetEqual(context, e.observer, id))) continue;
				const oentries = oEntries.filter((e) => isAssignmentTargetEqual(context, e.observer, id));
				const uentries = uEntries.filter((e) => isAssignmentTargetEqual(context, e.observer, id));
				const isDynamic = (node) => node?.type === AST_NODE_TYPES.CallExpression || ast.isConditional(node);
				const isPhaseNode = (node) => node === phaseNode;
				if (oentries.some((e) => !isPhaseNode(ast.findParentNode(e.node, or(isDynamic, isPhaseNode))))) {
					context.report({
						messageId: "expectedDisconnectInControlFlow",
						node
					});
					continue;
				}
				for (const oEntry of oentries) {
					if (uentries.some((uEntry) => isAssignmentTargetEqual(context, uEntry.element, oEntry.element))) continue;
					context.report({
						messageId: "expectedDisconnectOrUnobserveInCleanup",
						node: oEntry.node
					});
				}
			}
		}
	};
}

//#endregion
//#region src/rules/no-leaked-timeout.ts
const RULE_NAME = "no-leaked-timeout";
function getCallKind(node) {
	switch (true) {
		case node.callee.type === AST_NODE_TYPES.Identifier && isMatching(P.union("setTimeout", "clearTimeout"))(node.callee.name): return node.callee.name;
		case node.callee.type === AST_NODE_TYPES.MemberExpression && node.callee.property.type === AST_NODE_TYPES.Identifier && isMatching(P.union("setTimeout", "clearTimeout"))(node.callee.property.name): return node.callee.property.name;
		default: return "other";
	}
}
var no_leaked_timeout_default = createRule({
	meta: {
		type: "problem",
		docs: { description: "Enforces that every 'setTimeout' in a component or custom hook has a corresponding 'clearTimeout'." },
		messages: {
			expectedClearTimeoutInCleanup: "A 'setTimeout' created in '{{ kind }}' must be cleared with 'clearTimeout' in the cleanup function.",
			expectedClearTimeoutInUnmount: "A 'setTimeout' created in '{{ kind }}' must be cleared with 'clearTimeout' in the 'componentWillUnmount' method.",
			expectedTimeoutId: "A 'setTimeout' must be assigned to a variable for proper cleanup."
		},
		schema: []
	},
	name: RULE_NAME,
	create,
	defaultOptions: []
});
function create(context) {
	if (!context.sourceCode.text.includes("setTimeout")) return {};
	const fEntries = [];
	const sEntries = [];
	const rEntries = [];
	function isInverseEntry(a, b) {
		return isAssignmentTargetEqual(context, a.timerId, b.timerId);
	}
	return {
		[":function"](node) {
			const kind = getPhaseKindOfFunction(node) ?? "other";
			fEntries.push({
				kind,
				node
			});
		},
		[":function:exit"]() {
			fEntries.pop();
		},
		["CallExpression"](node) {
			const fEntry = fEntries.findLast((f) => f.kind !== "other");
			if (!ComponentPhaseRelevance.has(fEntry?.kind)) return;
			switch (getCallKind(node)) {
				case "setTimeout": {
					const timeoutIdNode = findEnclosingAssignmentTarget(node);
					if (timeoutIdNode == null) {
						context.report({
							messageId: "expectedTimeoutId",
							node
						});
						break;
					}
					sEntries.push({
						kind: "timeout",
						node,
						callee: node.callee,
						phase: fEntry.kind,
						timerId: timeoutIdNode
					});
					break;
				}
				case "clearTimeout": {
					const [timeoutIdNode] = node.arguments;
					if (timeoutIdNode == null) break;
					rEntries.push({
						kind: "timeout",
						node,
						callee: node.callee,
						phase: fEntry.kind,
						timerId: timeoutIdNode
					});
					break;
				}
			}
		},
		["Program:exit"]() {
			for (const sEntry of sEntries) {
				if (rEntries.some((rEntry) => isInverseEntry(sEntry, rEntry))) continue;
				switch (sEntry.phase) {
					case "setup":
					case "cleanup":
						context.report({
							messageId: "expectedClearTimeoutInCleanup",
							node: sEntry.node,
							data: { kind: "useEffect" }
						});
						continue;
					case "mount":
					case "unmount":
						context.report({
							messageId: "expectedClearTimeoutInUnmount",
							node: sEntry.node,
							data: { kind: "componentDidMount" }
						});
						continue;
				}
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
	rules: {
		"no-leaked-event-listener": no_leaked_event_listener_default,
		"no-leaked-interval": no_leaked_interval_default,
		"no-leaked-resize-observer": no_leaked_resize_observer_default,
		"no-leaked-timeout": no_leaked_timeout_default
	}
};

//#endregion
//#region src/index.ts
const { toFlatConfig } = getConfigAdapters("react-web-api", plugin);
var src_default = {
	...plugin,
	configs: { ["recommended"]: toFlatConfig(recommended_exports) }
};

//#endregion
export { src_default as default };