// Copyright 2023 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as Common from '../../core/common/common.js';
import * as SDK from '../../core/sdk/sdk.js';
import * as CodeMirror from '../../third_party/codemirror.next/codemirror.next.js';
import * as InlineEditor from '../../ui/legacy/components/inline_editor/inline_editor.js';
import * as UI from '../../ui/legacy/legacy.js';
const cssParser = CodeMirror.css.cssLanguage.parser;
function nodeText(node, text) {
    return nodeTextRange(node, node, text);
}
function nodeTextRange(from, to, text) {
    return text.substring(from.from, to.to);
}
export class SyntaxTree {
    propertyValue;
    rule;
    tree;
    trailingNodes;
    propertyName;
    constructor(propertyValue, rule, tree, propertyName, trailingNodes = []) {
        this.propertyName = propertyName;
        this.propertyValue = propertyValue;
        this.rule = rule;
        this.tree = tree;
        this.trailingNodes = trailingNodes;
    }
    text(node) {
        if (node === null) {
            return '';
        }
        return nodeText(node ?? this.tree, this.rule);
    }
    textRange(from, to) {
        return nodeTextRange(from, to, this.rule);
    }
    subtree(node) {
        return new SyntaxTree(this.propertyValue, this.rule, node);
    }
}
export class TreeWalker {
    ast;
    constructor(ast) {
        this.ast = ast;
    }
    static walkExcludingSuccessors(propertyValue, ...args) {
        const instance = new this(propertyValue, ...args);
        if (propertyValue.tree.name === 'Declaration') {
            instance.iterateDeclaration(propertyValue.tree);
        }
        else {
            instance.iterateExcludingSuccessors(propertyValue.tree);
        }
        return instance;
    }
    static walk(propertyValue, ...args) {
        const instance = new this(propertyValue, ...args);
        if (propertyValue.tree.name === 'Declaration') {
            instance.iterateDeclaration(propertyValue.tree);
        }
        else {
            instance.iterate(propertyValue.tree);
        }
        return instance;
    }
    iterateDeclaration(tree) {
        if (tree.name !== 'Declaration') {
            return;
        }
        if (this.enter(tree)) {
            ASTUtils.declValue(tree)?.cursor().iterate(this.enter.bind(this), this.leave.bind(this));
        }
        this.leave(tree);
    }
    iterate(tree) {
        tree.cursor().iterate(this.enter.bind(this), this.leave.bind(this));
    }
    iterateExcludingSuccessors(tree) {
        // Customize the first step to avoid visiting siblings of `tree`
        if (this.enter(tree)) {
            tree.firstChild?.cursor().iterate(this.enter.bind(this), this.leave.bind(this));
        }
        this.leave(tree);
    }
    enter(_node) {
        return true;
    }
    leave(_node) {
    }
}
export class RenderingContext {
    ast;
    matchedResult;
    cssControls;
    options;
    constructor(ast, matchedResult, cssControls, options = { readonly: false }) {
        this.ast = ast;
        this.matchedResult = matchedResult;
        this.cssControls = cssControls;
        this.options = options;
    }
    addControl(cssType, control) {
        if (this.cssControls) {
            const controls = this.cssControls.get(cssType);
            if (!controls) {
                this.cssControls.set(cssType, [control]);
            }
            else {
                controls.push(control);
            }
        }
    }
}
export class MatcherBase {
    createMatch;
    constructor(createMatch) {
        this.createMatch = createMatch;
    }
    accepts(_propertyName) {
        return true;
    }
}
export class BottomUpTreeMatching extends TreeWalker {
    #matchers = [];
    #matchedNodes = new Map();
    computedText;
    #key(node) {
        return `${node.from}:${node.to}`;
    }
    constructor(ast, matchers) {
        super(ast);
        this.computedText = new ComputedText(ast.rule.substring(ast.tree.from));
        this.#matchers.push(...matchers.filter(m => !ast.propertyName || m.accepts(ast.propertyName)));
        this.#matchers.push(new TextMatcher());
    }
    leave({ node }) {
        for (const matcher of this.#matchers) {
            const match = matcher.matches(node, this);
            if (match) {
                this.computedText.push(match, node.from - this.ast.tree.from);
                this.#matchedNodes.set(this.#key(node), match);
                break;
            }
        }
    }
    matchText(node) {
        const matchers = this.#matchers.splice(0);
        this.#matchers.push(new TextMatcher());
        this.iterateExcludingSuccessors(node);
        this.#matchers.push(...matchers);
    }
    getMatch(node) {
        return this.#matchedNodes.get(this.#key(node));
    }
    hasUnresolvedVars(node) {
        return this.hasUnresolvedVarsRange(node, node);
    }
    hasUnresolvedVarsRange(from, to) {
        return this.computedText.hasUnresolvedVars(from.from - this.ast.tree.from, to.to - this.ast.tree.from);
    }
    getComputedText(node) {
        return this.getComputedTextRange(node, node);
    }
    getComputedTextRange(from, to) {
        return this.computedText.get(from.from - this.ast.tree.from, to.to - this.ast.tree.from);
    }
}
class ComputedTextChunk {
    match;
    offset;
    #cachedComputedText = null;
    constructor(match, offset) {
        this.match = match;
        this.offset = offset;
    }
    get end() {
        return this.offset + this.length;
    }
    get length() {
        return this.match.text.length;
    }
    get computedText() {
        if (this.#cachedComputedText === null) {
            this.#cachedComputedText = this.match.computedText();
        }
        return this.#cachedComputedText;
    }
}
// This class constructs the "computed" text from the input property text, i.e., it will strip comments and substitute
// var() functions if possible. It's intended for use during the bottom-up tree matching process. The original text is
// not modified. Instead, computed text slices are produced on the fly. During bottom-up matching, the sequence of
// top-level comments and var() matches will be recorded. This produces an ordered sequence of text pieces that need to
// be substituted into the original text. When a computed text slice is requested, it is generated by piecing together
// original and computed slices as required.
export class ComputedText {
    #chunks = [];
    text;
    #sorted = true;
    constructor(text) {
        this.text = text;
    }
    clear() {
        this.#chunks.splice(0);
    }
    get chunkCount() {
        return this.#chunks.length;
    }
    #sortIfNecessary() {
        if (this.#sorted) {
            return;
        }
        // Sort intervals by offset, with longer intervals first if the offset is identical.
        this.#chunks.sort((a, b) => {
            if (a.offset < b.offset) {
                return -1;
            }
            if (b.offset < a.offset) {
                return 1;
            }
            if (a.end > b.end) {
                return -1;
            }
            if (a.end < b.end) {
                return 1;
            }
            return 0;
        });
        this.#sorted = true;
    }
    // Add another substitutable match. The match will either be appended to the list of existing matches or it will
    // be substituted for the last match(es) if it encompasses them.
    push(match, offset) {
        function hasComputedText(match) {
            return Boolean(match.computedText);
        }
        if (!hasComputedText(match) || offset < 0 || offset >= this.text.length) {
            return;
        }
        const chunk = new ComputedTextChunk(match, offset);
        if (chunk.end > this.text.length) {
            return;
        }
        this.#sorted = false;
        this.#chunks.push(chunk);
    }
    *#range(begin, end) {
        this.#sortIfNecessary();
        let i = this.#chunks.findIndex(c => c.offset >= begin);
        while (i >= 0 && i < this.#chunks.length && this.#chunks[i].end > begin && begin < end) {
            if (this.#chunks[i].end > end) {
                i++;
                continue;
            }
            yield this.#chunks[i];
            begin = this.#chunks[i].end;
            while (begin < end && i < this.#chunks.length && this.#chunks[i].offset < begin) {
                i++;
            }
        }
    }
    hasUnresolvedVars(begin, end) {
        for (const chunk of this.#range(begin, end)) {
            if (chunk.computedText === null) {
                return true;
            }
        }
        return false;
    }
    // Get a slice of the computed text corresponding to the property text in the range [begin, end). The slice may not
    // start within a substitution chunk, e.g., it's invalid to request the computed text for the property value text
    // slice "1px var(--".
    get(begin, end) {
        const pieces = [];
        const push = (text) => {
            if (text.length === 0) {
                return;
            }
            if (pieces.length > 0 && requiresSpace(pieces[pieces.length - 1], text)) {
                pieces.push(' ');
            }
            pieces.push(text);
        };
        for (const chunk of this.#range(begin, end)) {
            const piece = this.text.substring(begin, Math.min(chunk.offset, end));
            push(piece);
            if (end >= chunk.end) {
                push(chunk.computedText ?? chunk.match.text);
            }
            begin = chunk.end;
        }
        if (begin < end) {
            const piece = this.text.substring(begin, end);
            push(piece);
        }
        return pieces.join('');
    }
}
export function requiresSpace(a, b) {
    const tail = Array.isArray(a) ? a.findLast(node => node.textContent)?.textContent : a;
    const head = Array.isArray(b) ? b.find(node => node.textContent)?.textContent : b;
    const trailingChar = tail ? tail[tail.length - 1] : '';
    const leadingChar = head ? head[0] : '';
    const noSpaceAfter = ['', '(', '{', '}', ';', '['];
    const noSpaceBefore = ['', '(', ')', ',', ':', '*', '{', ';', ']'];
    return !/\s/.test(trailingChar) && !/\s/.test(leadingChar) && !noSpaceAfter.includes(trailingChar) &&
        !noSpaceBefore.includes(leadingChar);
}
export const CSSControlMap = (Map);
function mergeWithSpacing(nodes, merge) {
    const result = [...nodes];
    if (requiresSpace(nodes, merge)) {
        result.push(document.createTextNode(' '));
    }
    result.push(...merge);
    return result;
}
export class Renderer extends TreeWalker {
    #matchedResult;
    #output = [];
    #context;
    constructor(ast, matchedResult, cssControls, options) {
        super(ast);
        this.#matchedResult = matchedResult;
        this.#context = new RenderingContext(this.ast, this.#matchedResult, cssControls, options);
    }
    static render(nodeOrNodes, context) {
        if (!Array.isArray(nodeOrNodes)) {
            return this.render([nodeOrNodes], context);
        }
        const cssControls = new CSSControlMap();
        const renderers = nodeOrNodes.map(node => this.walkExcludingSuccessors(context.ast.subtree(node), context.matchedResult, cssControls, context.options));
        const nodes = renderers.map(node => node.#output).reduce(mergeWithSpacing);
        return { nodes, cssControls };
    }
    static renderInto(nodeOrNodes, context, parent) {
        const { nodes, cssControls } = this.render(nodeOrNodes, context);
        if (parent.lastChild && requiresSpace([parent.lastChild], nodes)) {
            parent.appendChild(document.createTextNode(' '));
        }
        nodes.map(n => parent.appendChild(n));
        return { nodes, cssControls };
    }
    renderedMatchForTest(_nodes, _match) {
    }
    enter({ node }) {
        const match = this.#matchedResult.getMatch(node);
        if (match) {
            const output = match.render(node, this.#context);
            this.renderedMatchForTest(output, match);
            this.#output = mergeWithSpacing(this.#output, output);
            return false;
        }
        return true;
    }
}
export var ASTUtils;
(function (ASTUtils) {
    function siblings(node) {
        const result = [];
        while (node) {
            result.push(node);
            node = node.nextSibling;
        }
        return result;
    }
    ASTUtils.siblings = siblings;
    function children(node) {
        return siblings(node?.firstChild ?? null);
    }
    ASTUtils.children = children;
    function declValue(node) {
        if (node.name !== 'Declaration') {
            return null;
        }
        return children(node).find(node => node.name === ':')?.nextSibling ?? null;
    }
    ASTUtils.declValue = declValue;
    function* stripComments(nodes) {
        for (const node of nodes) {
            if (node.type.name !== 'Comment') {
                yield node;
            }
        }
    }
    ASTUtils.stripComments = stripComments;
    function split(nodes) {
        const result = [];
        let current = [];
        for (const node of nodes) {
            if (node.name === ',') {
                result.push(current);
                current = [];
            }
            else {
                current.push(node);
            }
        }
        result.push(current);
        return result;
    }
    ASTUtils.split = split;
    function callArgs(node) {
        const args = children(node.getChild('ArgList'));
        const openParen = args.splice(0, 1)[0];
        const closingParen = args.pop();
        if (openParen?.name !== '(' || closingParen?.name !== ')') {
            return [];
        }
        return split(args);
    }
    ASTUtils.callArgs = callArgs;
})(ASTUtils || (ASTUtils = {}));
export class AngleMatch {
    text;
    type = 'angle';
    constructor(text) {
        this.text = text;
    }
}
export class AngleMatcher extends MatcherBase {
    accepts(propertyName) {
        return SDK.CSSMetadata.cssMetadata().isAngleAwareProperty(propertyName);
    }
    matches(node, matching) {
        if (node.name !== 'NumberLiteral') {
            return null;
        }
        const unit = node.getChild('Unit');
        // TODO(crbug/1138628) handle unitless 0
        if (!unit || !['deg', 'grad', 'rad', 'turn'].includes(matching.ast.text(unit))) {
            return null;
        }
        return this.createMatch(matching.ast.text(node));
    }
}
function literalToNumber(node, ast) {
    if (node.type.name !== 'NumberLiteral') {
        return null;
    }
    const text = ast.text(node);
    return Number(text.substring(0, text.length - ast.text(node.getChild('Unit')).length));
}
export class ColorMixMatch {
    text;
    space;
    color1;
    color2;
    type = 'color-mix';
    constructor(text, space, color1, color2) {
        this.text = text;
        this.space = space;
        this.color1 = color1;
        this.color2 = color2;
    }
}
export class ColorMixMatcher extends MatcherBase {
    accepts(propertyName) {
        return SDK.CSSMetadata.cssMetadata().isColorAwareProperty(propertyName);
    }
    matches(node, matching) {
        if (node.name !== 'CallExpression' || matching.ast.text(node.getChild('Callee')) !== 'color-mix') {
            return null;
        }
        const computedValueTree = tokenizeDeclaration('--property', matching.getComputedText(node));
        if (!computedValueTree) {
            return null;
        }
        const value = ASTUtils.declValue(computedValueTree.tree);
        if (!value) {
            return null;
        }
        const computedValueArgs = ASTUtils.callArgs(value);
        if (computedValueArgs.length !== 3) {
            return null;
        }
        const [space, color1, color2] = computedValueArgs;
        // Verify that all arguments are there, and that the space starts with a literal `in`.
        if (space.length < 2 || computedValueTree.text(ASTUtils.stripComments(space).next().value) !== 'in' ||
            color1.length < 1 || color2.length < 1) {
            return null;
        }
        // Verify there's at most one percentage value for each color.
        const p1 = color1.filter(n => n.type.name === 'NumberLiteral' && computedValueTree.text(n.getChild('Unit')) === '%');
        const p2 = color2.filter(n => n.type.name === 'NumberLiteral' && computedValueTree.text(n.getChild('Unit')) === '%');
        if (p1.length > 1 || p2.length > 1) {
            return null;
        }
        // Verify that if both colors carry percentages, they aren't both zero (which is an invalid property value).
        if (p1[0] && p2[0] && (literalToNumber(p1[0], computedValueTree) ?? 0) === 0 &&
            (literalToNumber(p2[0], computedValueTree) ?? 0) === 0) {
            return null;
        }
        const args = ASTUtils.callArgs(node);
        if (args.length !== 3) {
            return null;
        }
        return this.createMatch(matching.ast.text(node), args[0], args[1], args[2]);
    }
}
export class VariableMatch {
    text;
    name;
    fallback;
    matching;
    type = 'var';
    constructor(text, name, fallback, matching) {
        this.text = text;
        this.name = name;
        this.fallback = fallback;
        this.matching = matching;
    }
}
export class VariableMatcher extends MatcherBase {
    matches(node, matching) {
        const callee = node.getChild('Callee');
        const args = node.getChild('ArgList');
        if (node.name !== 'CallExpression' || !callee || (matching.ast.text(callee) !== 'var') || !args) {
            return null;
        }
        const [lparenNode, nameNode, ...fallbackOrRParenNodes] = ASTUtils.children(args);
        if (lparenNode?.name !== '(' || nameNode?.name !== 'VariableName') {
            return null;
        }
        if (fallbackOrRParenNodes.length <= 1 && fallbackOrRParenNodes[0]?.name !== ')') {
            return null;
        }
        let fallback = [];
        if (fallbackOrRParenNodes.length > 1) {
            if (fallbackOrRParenNodes.shift()?.name !== ',') {
                return null;
            }
            if (fallbackOrRParenNodes.pop()?.name !== ')') {
                return null;
            }
            fallback = fallbackOrRParenNodes;
            if (fallback.length === 0) {
                return null;
            }
            if (fallback.some(n => n.name === ',')) {
                return null;
            }
        }
        const varName = matching.ast.text(nameNode);
        if (!varName.startsWith('--')) {
            return null;
        }
        return this.createMatch(matching.ast.text(node), varName, fallback, matching);
    }
}
export class URLMatch {
    url;
    text;
    type = 'url';
    constructor(url, text) {
        this.url = url;
        this.text = text;
    }
}
export class URLMatcher extends MatcherBase {
    matches(node, matching) {
        if (node.name !== 'CallLiteral') {
            return null;
        }
        const callee = node.getChild('CallTag');
        if (!callee || matching.ast.text(callee) !== 'url') {
            return null;
        }
        const [, lparenNode, urlNode, rparenNode] = ASTUtils.siblings(callee);
        if (matching.ast.text(lparenNode) !== '(' ||
            (urlNode.name !== 'ParenthesizedContent' && urlNode.name !== 'StringLiteral') ||
            matching.ast.text(rparenNode) !== ')') {
            return null;
        }
        const text = matching.ast.text(urlNode);
        const url = (urlNode.name === 'StringLiteral' ? text.substr(1, text.length - 2) : text.trim());
        return this.createMatch(url, matching.ast.text(node));
    }
}
export class ColorMatch {
    text;
    type = 'color';
    constructor(text) {
        this.text = text;
    }
}
export class ColorMatcher extends MatcherBase {
    accepts(propertyName) {
        return SDK.CSSMetadata.cssMetadata().isColorAwareProperty(propertyName);
    }
    matches(node, matching) {
        const text = matching.ast.text(node);
        if (node.name === 'ColorLiteral') {
            return this.createMatch(text);
        }
        if (node.name === 'ValueName' && Common.Color.Nicknames.has(text)) {
            return this.createMatch(text);
        }
        if (node.name === 'CallExpression') {
            const callee = node.getChild('Callee');
            if (callee && matching.ast.text(callee).match(/^(rgba?|hsla?|hwba?|lab|lch|oklab|oklch|color)$/)) {
                return this.createMatch(text);
            }
        }
        return null;
    }
}
export class LinkableNameMatch {
    text;
    properyName;
    type = 'linkable-name';
    constructor(text, properyName) {
        this.text = text;
        this.properyName = properyName;
    }
}
export class LinkableNameMatcher extends MatcherBase {
    static isLinkableNameProperty(propertyName) {
        const names = [
            "animation" /* LinkableNameProperties.Animation */,
            "animation-name" /* LinkableNameProperties.AnimationName */,
            "font-palette" /* LinkableNameProperties.FontPalette */,
            "position-fallback" /* LinkableNameProperties.PositionFallback */,
        ];
        return names.includes(propertyName);
    }
    static identifierAnimationLonghandMap = new Map(Object.entries({
        'normal': "direction" /* AnimationLonghandPart.Direction */,
        'alternate': "direction" /* AnimationLonghandPart.Direction */,
        'reverse': "direction" /* AnimationLonghandPart.Direction */,
        'alternate-reverse': "direction" /* AnimationLonghandPart.Direction */,
        'none': "fill-mode" /* AnimationLonghandPart.FillMode */,
        'forwards': "fill-mode" /* AnimationLonghandPart.FillMode */,
        'backwards': "fill-mode" /* AnimationLonghandPart.FillMode */,
        'both': "fill-mode" /* AnimationLonghandPart.FillMode */,
        'running': "play-state" /* AnimationLonghandPart.PlayState */,
        'paused': "play-state" /* AnimationLonghandPart.PlayState */,
        'infinite': "iteration-count" /* AnimationLonghandPart.IterationCount */,
        'linear': "easing-function" /* AnimationLonghandPart.EasingFunction */,
        'ease': "easing-function" /* AnimationLonghandPart.EasingFunction */,
        'ease-in': "easing-function" /* AnimationLonghandPart.EasingFunction */,
        'ease-out': "easing-function" /* AnimationLonghandPart.EasingFunction */,
        'ease-in-out': "easing-function" /* AnimationLonghandPart.EasingFunction */,
    }));
    matchAnimationNameInShorthand(node, matching) {
        // Order is important within each animation definition for distinguishing <keyframes-name> values from other keywords.
        // When parsing, keywords that are valid for properties other than animation-name
        // whose values were not found earlier in the shorthand must be accepted for those properties rather than for animation-name.
        // See the details in: https://w3c.github.io/csswg-drafts/css-animations/#animation.
        const text = matching.ast.text(node);
        // This is not a known identifier, so return it as `animation-name`.
        if (!LinkableNameMatcher.identifierAnimationLonghandMap.has(text)) {
            return this.createMatch(text, "animation" /* LinkableNameProperties.Animation */);
        }
        // There can be multiple `animation` declarations splitted by a comma.
        // So, we find the declaration nodes that are related to the node argument.
        const declarations = ASTUtils.split(ASTUtils.siblings(ASTUtils.declValue(matching.ast.tree)));
        const currentDeclarationNodes = declarations.find(declaration => declaration[0].from <= node.from && declaration[declaration.length - 1].to >= node.to);
        if (!currentDeclarationNodes) {
            return null;
        }
        // We reparse here until the node argument since a variable might be
        // providing a meaningful value such as a timing keyword,
        // that might change the meaning of the node.
        const computedText = matching.getComputedTextRange(currentDeclarationNodes[0], node);
        const tokenized = tokenizeDeclaration('--p', computedText);
        if (!tokenized) {
            return null;
        }
        const identifierCategory = LinkableNameMatcher.identifierAnimationLonghandMap.get(text); // The category of the node argument
        for (let itNode = ASTUtils.declValue(tokenized.tree); itNode?.nextSibling; itNode = itNode.nextSibling) {
            // Run through all the nodes that come before node argument
            // and check whether a value in the same category is found.
            // if so, it means our identifier is an `animation-name` keyword.
            if (itNode.name === 'ValueName') {
                const categoryValue = LinkableNameMatcher.identifierAnimationLonghandMap.get(tokenized.text(itNode));
                if (categoryValue && categoryValue === identifierCategory) {
                    return this.createMatch(text, "animation" /* LinkableNameProperties.Animation */);
                }
            }
        }
        return null;
    }
    accepts(propertyName) {
        return LinkableNameMatcher.isLinkableNameProperty(propertyName);
    }
    matches(node, matching) {
        const { propertyName } = matching.ast;
        const text = matching.ast.text(node);
        const parentNode = node.parent;
        if (!parentNode) {
            return null;
        }
        const isParentADeclaration = parentNode.name === 'Declaration';
        const isInsideVarCall = parentNode.name === 'ArgList' && parentNode.prevSibling?.name === 'Callee' &&
            matching.ast.text(parentNode.prevSibling) === 'var';
        const isAParentDeclarationOrVarCall = isParentADeclaration || isInsideVarCall;
        // We only mark top level nodes or nodes that are inside `var()` expressions as linkable names.
        if (!propertyName || (node.name !== 'ValueName' && node.name !== 'VariableName') ||
            !isAParentDeclarationOrVarCall) {
            return null;
        }
        if (propertyName === 'animation') {
            return this.matchAnimationNameInShorthand(node, matching);
        }
        // The assertion here is safe since this matcher only runs for
        // properties with names inside `LinkableNameProperties` (See the `accepts` function.)
        return this.createMatch(text, propertyName);
    }
}
export class BezierMatch {
    text;
    type = 'bezier';
    constructor(text) {
        this.text = text;
    }
}
export class BezierMatcher extends MatcherBase {
    accepts(propertyName) {
        return SDK.CSSMetadata.cssMetadata().isBezierAwareProperty(propertyName);
    }
    matches(node, matching) {
        const text = matching.ast.text(node);
        const isCubicBezierKeyword = node.name === 'ValueName' && UI.Geometry.CubicBezier.KeywordValues.has(text);
        const isCubicBezierOrLinearFunction = node.name === 'CallExpression' &&
            ['cubic-bezier', 'linear'].includes(matching.ast.text(node.getChild('Callee')));
        if (!isCubicBezierKeyword && !isCubicBezierOrLinearFunction) {
            return null;
        }
        if (!InlineEditor.AnimationTimingModel.AnimationTimingModel.parse(text)) {
            return null;
        }
        return this.createMatch(text);
    }
}
export class StringMatch {
    text;
    type = 'string';
    constructor(text) {
        this.text = text;
    }
}
export class StringMatcher extends MatcherBase {
    matches(node, matching) {
        return node.name === 'StringLiteral' ? this.createMatch(matching.ast.text(node)) : null;
    }
}
export class ShadowMatch {
    text;
    shadowType;
    type = 'shadow';
    constructor(text, shadowType) {
        this.text = text;
        this.shadowType = shadowType;
    }
}
export class ShadowMatcher extends MatcherBase {
    accepts(propertyName) {
        return SDK.CSSMetadata.cssMetadata().isShadowProperty(propertyName);
    }
    matches(node, matching) {
        if (node.name !== 'Declaration') {
            return null;
        }
        const valueNodes = ASTUtils.siblings(ASTUtils.declValue(node));
        const valueText = matching.ast.textRange(valueNodes[0], valueNodes[valueNodes.length - 1]);
        return this.createMatch(valueText, matching.ast.propertyName === 'text-shadow' ? "textShadow" /* ShadowType.TextShadow */ : "boxShadow" /* ShadowType.BoxShadow */);
    }
}
export class FontMatch {
    text;
    type = 'font';
    constructor(text) {
        this.text = text;
    }
}
export class FontMatcher extends MatcherBase {
    accepts(propertyName) {
        return SDK.CSSMetadata.cssMetadata().isFontAwareProperty(propertyName);
    }
    matches(node, matching) {
        if (node.name === 'Declaration') {
            return null;
        }
        const regex = matching.ast.propertyName === 'font-family' ? InlineEditor.FontEditorUtils.FontFamilyRegex :
            InlineEditor.FontEditorUtils.FontPropertiesRegex;
        const text = matching.ast.text(node);
        return regex.test(text) ? this.createMatch(text) : null;
    }
}
class LegacyRegexMatch {
    processor;
    #matchedText;
    #suffix;
    get text() {
        return this.#matchedText + this.#suffix;
    }
    get type() {
        return `${this.processor}`;
    }
    constructor(matchedText, suffix, processor) {
        this.#matchedText = matchedText;
        this.#suffix = suffix;
        this.processor = processor;
    }
    render(_node, context) {
        const rendered = this.processor(this.#matchedText, context.options.readonly);
        return rendered ? [rendered, document.createTextNode(this.#suffix)] : [];
    }
}
export class LegacyRegexMatcher {
    regexp;
    processor;
    constructor(regexp, processor) {
        this.regexp = new RegExp(regexp);
        this.processor = processor;
    }
    accepts() {
        return true;
    }
    matches(node, matching) {
        const text = matching.ast.text(node);
        this.regexp.lastIndex = 0;
        const match = this.regexp.exec(text);
        if (!match || match.index !== 0) {
            return null;
        }
        // Some of the legacy regex matching relies on matching prefixes of the text, e.g., for var()s. That particular
        // matcher can't be extended for a full-text match, because that runs into problems matching the correct closing
        // parenthesis (with fallbacks, specifically). At the same time we can't rely on prefix matching here because it
        // has false positives for some subexpressions, such as 'var() + var()'. We compromise by accepting prefix matches
        // where the remaining suffix is exclusively closing parentheses and whitespace, specifically to handle the existing
        // prefix matchers like that for var().
        const suffix = text.substring(match[0].length);
        if (!suffix.match(/^[\s)]*$/)) {
            return null;
        }
        return new LegacyRegexMatch(match[0], suffix, this.processor);
    }
}
export class TextMatch {
    text;
    isComment;
    type = 'text';
    computedText;
    constructor(text, isComment) {
        this.text = text;
        this.isComment = isComment;
        if (isComment) {
            this.computedText = () => '';
        }
    }
    render() {
        return [document.createTextNode(this.text)];
    }
}
class TextMatcher {
    accepts() {
        return true;
    }
    matches(node, matching) {
        if (!node.firstChild || node.name === 'NumberLiteral' /* may have a Unit child */) {
            // Leaf node, just emit text
            const text = matching.ast.text(node);
            if (text.length) {
                return new TextMatch(text, node.name === 'Comment');
            }
        }
        return null;
    }
}
export class GridTemplateMatch {
    text;
    lines;
    type = 'grid-template';
    constructor(text, lines) {
        this.text = text;
        this.lines = lines;
    }
}
export class GridTemplateMatcher extends MatcherBase {
    accepts(propertyName) {
        return SDK.CSSMetadata.cssMetadata().isGridAreaDefiningProperty(propertyName);
    }
    matches(node, matching) {
        if (node.name !== 'Declaration' || matching.hasUnresolvedVars(node)) {
            return null;
        }
        const lines = [];
        let curLine = [];
        // The following two states are designed to consume different cases of LineNames:
        // 1. no LineNames in between StringLiterals;
        // 2. one LineNames in between, which means the LineNames belongs to the current line;
        // 3. two LineNames in between, which means the second LineNames starts a new line.
        // `hasLeadingLineNames` tracks if the current row already starts with a LineNames and
        // with no following StringLiteral yet, which means that the next StringLiteral should
        // be appended to the same `curLine`, instead of creating a new line.
        let hasLeadingLineNames = false;
        // `needClosingLineNames` tracks if the current row can still consume an optional LineNames,
        // which will decide if we should start a new line or not when a LineNames is encountered.
        let needClosingLineNames = false;
        // Gather row definitions of [<line-names>? <string> <track-size>? <line-names>?], which
        // be rendered into separate lines.
        function parseNodes(nodes, varParsingMode = false) {
            for (const curNode of nodes) {
                if (matching.getMatch(curNode)?.type === 'var') {
                    const computedValueTree = tokenizeDeclaration('--property', matching.getComputedText(curNode));
                    if (!computedValueTree) {
                        continue;
                    }
                    const varNodes = ASTUtils.siblings(ASTUtils.declValue(computedValueTree.tree));
                    if (varNodes.length === 0) {
                        continue;
                    }
                    if ((varNodes[0].name === 'StringLiteral' && !hasLeadingLineNames) ||
                        (varNodes[0].name === 'LineNames' && !needClosingLineNames)) {
                        // The variable value either starts with a string, or with a line name that belongs to a new row;
                        // therefore we start a new line with the variable.
                        lines.push(curLine);
                        curLine = [curNode];
                    }
                    else {
                        curLine.push(curNode);
                    }
                    // We parse computed nodes of this variable to correctly advance local states, but
                    // these computed nodes won't be added to the lines.
                    parseNodes(varNodes, true);
                }
                else if (curNode.name === 'BinaryExpression') {
                    parseNodes(ASTUtils.siblings(curNode.firstChild));
                }
                else if (curNode.name === 'StringLiteral') {
                    if (!varParsingMode) {
                        if (hasLeadingLineNames) {
                            curLine.push(curNode);
                        }
                        else {
                            lines.push(curLine);
                            curLine = [curNode];
                        }
                    }
                    needClosingLineNames = true;
                    hasLeadingLineNames = false;
                }
                else if (curNode.name === 'LineNames') {
                    if (!varParsingMode) {
                        if (needClosingLineNames) {
                            curLine.push(curNode);
                        }
                        else {
                            lines.push(curLine);
                            curLine = [curNode];
                        }
                    }
                    hasLeadingLineNames = !needClosingLineNames;
                    needClosingLineNames = !needClosingLineNames;
                }
                else if (!varParsingMode) {
                    curLine.push(curNode);
                }
            }
        }
        const valueNodes = ASTUtils.siblings(ASTUtils.declValue(node));
        parseNodes(valueNodes);
        lines.push(curLine);
        const valueText = matching.ast.textRange(valueNodes[0], valueNodes[valueNodes.length - 1]);
        return this.createMatch(valueText, lines.filter(line => line.length > 0));
    }
}
function declaration(rule) {
    return cssParser.parse(rule).topNode.getChild('RuleSet')?.getChild('Block')?.getChild('Declaration') ?? null;
}
export function tokenizeDeclaration(propertyName, propertyValue) {
    const name = tokenizePropertyName(propertyName);
    if (!name) {
        return null;
    }
    const rule = `*{${name}: ${propertyValue};}`;
    const decl = declaration(rule);
    if (!decl || decl.type.isError) {
        return null;
    }
    const childNodes = ASTUtils.children(decl);
    if (childNodes.length < 3) {
        return null;
    }
    const [varName, colon, tree] = childNodes;
    if (!varName || varName.type.isError || !colon || colon.type.isError || !tree || tree.type.isError) {
        return null;
    }
    // It's possible that there are nodes following the declaration when there are comments or syntax errors. We want to
    // render any comments, so pick up any trailing nodes following the declaration excluding the final semicolon and
    // brace.
    const trailingNodes = ASTUtils.siblings(decl).slice(1);
    const [semicolon, brace] = trailingNodes.splice(trailingNodes.length - 2, 2);
    if (semicolon?.name !== ';' && brace?.name !== '}') {
        return null;
    }
    const ast = new SyntaxTree(propertyValue, rule, decl, name, trailingNodes);
    if (ast.text(varName) !== name || colon.name !== ':') {
        return null;
    }
    return ast;
}
export function tokenizePropertyName(name) {
    const rule = `*{${name}: inherit;}`;
    const decl = declaration(rule);
    if (!decl || decl.type.isError) {
        return null;
    }
    const propertyName = decl.getChild('PropertyName') ?? decl.getChild('VariableName');
    if (!propertyName) {
        return null;
    }
    return nodeText(propertyName, rule);
}
// This function renders a property value as HTML, customizing the presentation with a set of given AST matchers. This
// comprises the following steps:
// 1. Build an AST of the property.
// 2. Apply tree matchers during bottom up traversal.
// 3. Render the value from left to right into HTML, deferring rendering of matched subtrees to the matchers
//
// More general, longer matches take precedence over shorter, more specific matches. Whitespaces are normalized, for
// unmatched text and around rendered matching results.
export function renderPropertyValue(propertyName, propertyValue, matchers) {
    const ast = tokenizeDeclaration(propertyName, propertyValue);
    if (!ast) {
        return [document.createTextNode(propertyValue)];
    }
    const matchedResult = BottomUpTreeMatching.walk(ast, matchers);
    ast.trailingNodes.forEach(n => matchedResult.matchText(n));
    const context = new RenderingContext(ast, matchedResult);
    return Renderer.render([ast.tree, ...ast.trailingNodes], context).nodes;
}
//# sourceMappingURL=PropertyParser.js.map