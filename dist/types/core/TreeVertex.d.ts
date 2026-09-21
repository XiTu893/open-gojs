export declare class TreeVertex {
    /** The key of this vertex. */
    key: any;
    /** The position of this vertex. */
    position: any;
    /** The comments for this vertex. */
    comments: any[];
    /** The links connected to this vertex. */
    linkConnected: any[];
    /** The network this vertex belongs to. */
    network: any;
    /** The parent vertex. */
    parent: any;
    /** The children vertices. */
    children: any[];
    /** The level of this vertex. */
    level: number;
    /** The constructor tree edge sort ID. */
    treeEdgeSortId: number;
    /** The constructor tree edge sort ID relative. */
    treeEdgeSortIdRelative: number;
    /** The count so far. */
    countSoFar: number;
    /** The count so far relative. */
    countSoFarRelative: number;
    /** The count to child. */
    countToChild: number;
    /** The count to child relative. */
    countToChildRelative: number;
}
