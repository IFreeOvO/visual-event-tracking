// Copyright 2023 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as Platform from '../../core/platform/platform.js';
import * as Helpers from './helpers/helpers.js';
import * as Types from './types/types.js';
let singleton;
/**
 * This class can take in a thread that has been generated by the
 * RendererHandler and apply certain actions to it in order to modify what is
 * shown to the user. These actions can be automatically applied by DevTools or
 * applied by the user.
 *
 * Once actions are applied, the invisibleEntries() method will return the
 * entries that are invisible, and this is the list of entries that should be
 * removed before rendering the resulting thread on the timeline.
 **/
export class EntriesFilter {
    // Maps from an individual TraceEvent entry to its representation as a
    // RendererEntryNode. We need this so we can then parse the tree structure
    // generated by the RendererHandler.
    #entryToNode;
    // Track the set of invisible entries.
    #invisibleEntries = [];
    // List of entries whose children are modified. This list is used to
    // keep track of entries that should be identified in the UI as modified.
    #modifiedVisibleEntries = [];
    // Cache for descendants of entry that have already been gathered. The descendants
    // will never change so we can avoid running the potentially expensive search again.
    #entryToDescendantsMap = new Map();
    // If a new EntryToNodeMap is provided, make a new EntriesFilter instance
    static maybeInstance(opts = { entryToNodeMap: null }) {
        if (opts.entryToNodeMap) {
            singleton = new EntriesFilter(opts.entryToNodeMap);
        }
        return singleton;
    }
    static removeInstance() {
        singleton = null;
    }
    constructor(entryToNodeMap) {
        this.#entryToNode = entryToNodeMap;
    }
    /**
     * Checks which actions can be applied on an entry. This allows us to only show possible actions in the Context Menu.
     * For example, if an entry has no children, COLLAPSE_FUNCTION will not change the FlameChart, therefore there is no need to show this action as an option.
     **/
    findPossibleActions(entry) {
        const entryNode = this.#entryToNode.get(entry);
        if (!entryNode) {
            // Invalid node was given, return no possible actions.
            return {
                ["MERGE_FUNCTION" /* FilterAction.MERGE_FUNCTION */]: false,
                ["COLLAPSE_FUNCTION" /* FilterAction.COLLAPSE_FUNCTION */]: false,
                ["COLLAPSE_REPEATING_DESCENDANTS" /* FilterAction.COLLAPSE_REPEATING_DESCENDANTS */]: false,
                ["RESET_CHILDREN" /* FilterAction.RESET_CHILDREN */]: false,
                ["UNDO_ALL_ACTIONS" /* FilterAction.UNDO_ALL_ACTIONS */]: false,
            };
        }
        const entryParent = entryNode.parent;
        const allVisibleDescendants = this.#findAllDescendantsOfNode(entryNode).filter(descendant => !this.#invisibleEntries.includes(descendant));
        const allVisibleRepeatingDescendants = this.#findAllRepeatingDescendantsOfNext(entryNode).filter(descendant => !this.#invisibleEntries.includes(descendant));
        const allInVisibleDescendants = this.#findAllDescendantsOfNode(entryNode).filter(descendant => this.#invisibleEntries.includes(descendant));
        // If there are children to hide, indicate action as possible
        const possibleActions = {
            ["MERGE_FUNCTION" /* FilterAction.MERGE_FUNCTION */]: entryParent !== null,
            ["COLLAPSE_FUNCTION" /* FilterAction.COLLAPSE_FUNCTION */]: allVisibleDescendants.length > 0,
            ["COLLAPSE_REPEATING_DESCENDANTS" /* FilterAction.COLLAPSE_REPEATING_DESCENDANTS */]: allVisibleRepeatingDescendants.length > 0,
            ["RESET_CHILDREN" /* FilterAction.RESET_CHILDREN */]: allInVisibleDescendants.length > 0,
            ["UNDO_ALL_ACTIONS" /* FilterAction.UNDO_ALL_ACTIONS */]: this.#invisibleEntries.length > 0,
        };
        return possibleActions;
    }
    /**
     * Returns the amount of entry descendants that belong to the hidden entries array.
     * **/
    findHiddenDescendantsAmount(entry) {
        const entryNode = this.#entryToNode.get(entry);
        if (!entryNode) {
            return 0;
        }
        const allDescendants = this.#findAllDescendantsOfNode(entryNode);
        return allDescendants.filter(descendant => this.invisibleEntries().includes(descendant)).length;
    }
    /**
     * Returns the set of entries that are invisible given the set of applied actions.
     **/
    invisibleEntries() {
        return this.#invisibleEntries;
    }
    inEntryInvisible(entry) {
        return this.#invisibleEntries.includes(entry);
    }
    /**
     * Returns the array of entries that have a sign indicating that entries below are hidden.
     **/
    modifiedEntries() {
        return this.#modifiedVisibleEntries;
    }
    /**
     * Applies an action to hide entries or removes entries
     * from hidden entries array depending on the action.
     **/
    applyFilterAction(action) {
        // We apply new user action to the set of all entries, and mark
        // any that should be hidden by adding them to this set.
        // Another approach would be to use splice() to remove items from the
        // array, but doing this would be a mutation of the arry for every hidden
        // event. Instead, we add entries to this set and return it as an array at the end.
        const entriesToHide = new Set();
        switch (action.type) {
            case "MERGE_FUNCTION" /* FilterAction.MERGE_FUNCTION */: {
                // The entry that was clicked on is merged into its parent. All its
                // children remain visible, so we just have to hide the entry that was
                // selected.
                entriesToHide.add(action.entry);
                // If parent node exists, add it to modifiedVisibleEntries, so it would be possible to uncollapse its' children.
                const actionNode = this.#entryToNode.get(action.entry) || null;
                const parentNode = actionNode && this.#findNextVisibleParent(actionNode);
                if (parentNode) {
                    this.#addModifiedEntry(parentNode.entry);
                }
                break;
            }
            case "COLLAPSE_FUNCTION" /* FilterAction.COLLAPSE_FUNCTION */: {
                // The entry itself remains visible, but all of its descendants are hidden.
                const entryNode = this.#entryToNode.get(action.entry);
                if (!entryNode) {
                    // Invalid node was given, just ignore and move on.
                    break;
                }
                const allDescendants = this.#findAllDescendantsOfNode(entryNode);
                allDescendants.forEach(descendant => entriesToHide.add(descendant));
                this.#addModifiedEntry(action.entry);
                break;
            }
            case "COLLAPSE_REPEATING_DESCENDANTS" /* FilterAction.COLLAPSE_REPEATING_DESCENDANTS */: {
                const entryNode = this.#entryToNode.get(action.entry);
                if (!entryNode) {
                    // Invalid node was given, just ignore and move on.
                    break;
                }
                const allRepeatingDescendants = this.#findAllRepeatingDescendantsOfNext(entryNode);
                allRepeatingDescendants.forEach(descendant => entriesToHide.add(descendant));
                if (entriesToHide.size > 0) {
                    this.#addModifiedEntry(action.entry);
                }
                break;
            }
            case "UNDO_ALL_ACTIONS" /* FilterAction.UNDO_ALL_ACTIONS */: {
                this.#invisibleEntries = [];
                this.#modifiedVisibleEntries = [];
                break;
            }
            case "RESET_CHILDREN" /* FilterAction.RESET_CHILDREN */: {
                this.#makeEntryChildrenVisible(action.entry);
                break;
            }
            default:
                Platform.assertNever(action.type, `Unknown EntriesFilter action: ${action.type}`);
        }
        this.#invisibleEntries.push(...entriesToHide);
        return this.#invisibleEntries;
    }
    /**
     * Add an entry to the array of entries that have a sign indicating that entries below are hidden.
     * Also, remove all of the child entries of the new modified entry from the modified array. Do that because
     * to draw the initiator from the closest visible entry, we need to get the closest entry that is
     * marked as modified and we do not want to get some that are hidden.
     */
    #addModifiedEntry(entry) {
        this.#modifiedVisibleEntries.push(entry);
        const entryNode = this.#entryToNode.get(entry);
        if (!entryNode) {
            // Invalid node was given, just ignore and move on.
            return;
        }
        const allDescendants = this.#findAllDescendantsOfNode(entryNode);
        if (allDescendants.length > 0) {
            this.#modifiedVisibleEntries = this.#modifiedVisibleEntries.filter(entry => {
                return !allDescendants.includes(entry);
            });
        }
    }
    // The direct parent might be hidden by other actions, therefore we look for the next visible parent.
    #findNextVisibleParent(node) {
        let parent = node.parent;
        while (parent && this.#invisibleEntries.includes(parent.entry)) {
            parent = parent.parent;
        }
        return parent;
    }
    #findAllDescendantsOfNode(root) {
        const cachedDescendants = this.#entryToDescendantsMap.get(root);
        if (cachedDescendants) {
            return cachedDescendants;
        }
        const descendants = [];
        // Walk through all the descendants, starting at the root node.
        const children = [...root.children];
        while (children.length > 0) {
            const childNode = children.shift();
            if (childNode) {
                descendants.push(childNode.entry);
                const childNodeCachedDescendants = this.#entryToDescendantsMap.get(childNode);
                // If the descendants of a child are cached, get them from the cache instead of iterating through them again
                if (childNodeCachedDescendants) {
                    descendants.push(...childNodeCachedDescendants);
                }
                else {
                    children.push(...childNode.children);
                }
            }
        }
        this.#entryToDescendantsMap.set(root, descendants);
        return descendants;
    }
    #findAllRepeatingDescendantsOfNext(root) {
        // Walk through all the ancestors, starting at the root node.
        const children = [...root.children];
        const repeatingNodes = [];
        const rootIsProfileCall = Types.TraceEvents.isProfileCall(root.entry);
        while (children.length > 0) {
            const childNode = children.shift();
            if (childNode) {
                const childIsProfileCall = Types.TraceEvents.isProfileCall(childNode.entry);
                if ( /* Handle SyntheticProfileCalls */rootIsProfileCall && childIsProfileCall) {
                    const rootNodeEntry = root.entry;
                    const childNodeEntry = childNode.entry;
                    if (Helpers.SamplesIntegrator.SamplesIntegrator.framesAreEqual(rootNodeEntry.callFrame, childNodeEntry.callFrame)) {
                        repeatingNodes.push(childNode.entry);
                    }
                } /* Handle SyntheticRendererEvents */
                else if (!rootIsProfileCall && !childIsProfileCall) {
                    if (root.entry.name === childNode.entry.name) {
                        repeatingNodes.push(childNode.entry);
                    }
                }
                children.push(...childNode.children);
            }
        }
        return repeatingNodes;
    }
    /**
     * If an entry was selected from a link instead of clicking on it,
     * it might be in the invisible entries array.
     * If it is, reveal it by resetting clidren the closest modified entry,
     */
    revealEntry(entry) {
        const entryNode = this.#entryToNode.get(entry);
        if (!entryNode) {
            // Invalid node was given, just ignore and move on.
            return;
        }
        let closestModifiedParent = entryNode;
        while (closestModifiedParent.parent && !this.#modifiedVisibleEntries.includes(closestModifiedParent.entry)) {
            closestModifiedParent = closestModifiedParent.parent;
        }
        this.#makeEntryChildrenVisible(closestModifiedParent.entry);
    }
    /**
     * Removes all of the entry children from the
     * invisible entries array to make them visible.
     **/
    #makeEntryChildrenVisible(entry) {
        const entryNode = this.#entryToNode.get(entry);
        if (!entryNode) {
            // Invalid node was given, just ignore and move on.
            return;
        }
        const descendants = this.#findAllDescendantsOfNode(entryNode);
        /**
         * Filter out all descendant of the node
         * from the invisible entries list.
         **/
        this.#invisibleEntries = this.#invisibleEntries.filter(entry => {
            if (descendants.includes(entry)) {
                return false;
            }
            return true;
        });
        /**
         * Filter out all descentants and entry from modified entries
         * list to not show that some entries below those are hidden.
         **/
        this.#modifiedVisibleEntries = this.#modifiedVisibleEntries.filter(iterEntry => {
            if (descendants.includes(iterEntry) || iterEntry === entry) {
                return false;
            }
            return true;
        });
    }
    isEntryModified(event) {
        return this.#modifiedVisibleEntries.includes(event);
    }
}
//# sourceMappingURL=EntriesFilter.js.map