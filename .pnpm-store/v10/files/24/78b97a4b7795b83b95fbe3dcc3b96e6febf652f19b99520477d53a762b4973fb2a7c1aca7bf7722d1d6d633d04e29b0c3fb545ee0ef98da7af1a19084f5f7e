import type { AllDragTypes } from '@atlaskit/pragmatic-drag-and-drop/types';
import { type Edge, type ElementAutoScrollArgs, type Spacing } from '../internal-types';
type VerticalEdges = ['top' | 'bottom'];
type HorizontalEdges = ['left' | 'right'];
type CrossAxisEdges<T extends Edge> = T extends VerticalEdges[number] ? HorizontalEdges : VerticalEdges;
/** Specify outward reach of a scroll container */
export type HitboxSpacing = {
    [TEdge in keyof Spacing]: Spacing;
};
/** The public type for specifying the outward reach of a scroll container */
export type ProvidedHitboxSpacing = {
    [TEdge in keyof Spacing as `for${Capitalize<TEdge>}Edge`]?: {
        [TKey in TEdge]: number;
    } & {
        [TKey in CrossAxisEdges<TEdge>[number]]?: number;
    };
};
export type UnsafeOverflowAutoScrollArgs<DragType extends AllDragTypes> = ElementAutoScrollArgs<DragType> & {
    getOverflow: () => ProvidedHitboxSpacing;
};
export {};
