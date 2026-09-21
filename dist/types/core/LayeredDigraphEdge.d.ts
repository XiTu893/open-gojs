export declare class LayeredDigraphEdge {
    /** The from vertex of this edge. */
    fromVertex: any;
    /** The to vertex of this edge. */
    toVertex: any;
    /** The label of this edge. */
    label: string;
    /** The directed edge index. */
    directedEdge: number;
    /** The relative so far. */
    relativeSoFar: number;
    /** The count of so far. */
    countSoFar: number;
    /** The count of so far relative. */
    countSoFarRelative: number;
    /** The count to child. */
    countToChild: number;
    /** The count to child relative. */
    countToChildRelative: number;
    /** Is this edge already routed. */
    isRouted: boolean;
    /** Is this edge routed from child. */
    isRoutedFromChild: boolean;
    /** Is this edge from left. */
    isFromLeft: boolean;
    /** Is this edge from right. */
    isFromRight: boolean;
    /** Is this edge from top. */
    isFromTop: boolean;
    /** Is this edge from bottom. */
    isFromBottom: boolean;
    /** Is this edge from left child. */
    isFromLeftChild: boolean;
    /** Is this edge from right child. */
    isFromRightChild: boolean;
    /** Is this edge from top child. */
    isFromTopChild: boolean;
    /** Is this edge from bottom child. */
    isFromBottomChild: boolean;
    /** Is this edge from left sibling. */
    isFromLeftSibling: boolean;
    /** Is this edge from right sibling. */
    isFromRightSibling: boolean;
    /** Is this edge from top sibling. */
    isFromTopSibling: boolean;
    /** Is this edge from bottom sibling. */
    isFromBottomSibling: boolean;
}
