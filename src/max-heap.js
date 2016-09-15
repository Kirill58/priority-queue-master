const Node = require('./node');

class MaxHeap {
    constructor() {
        this.root = null;
        this.parentNodes = [];
        this.count = 0;
    }

    push(data, priority) {
        var node = new Node(data, priority);
        this.insertNode(node);
        this.shiftNodeUp(node);
        this.count = this.count + 1;
    }

    pop() {
        var detached = this.detachRoot();
        if (detached == null) {
            return null;
        }
        var root = this.restoreRootFromLastInsertedNode(detached);
        if (root != null) {
            this.shiftNodeDown(root);
        }
        this.count = this.count - 1;
        return detached.data;
    }

    detachRoot() {
        var root = this.root;
        this.root = null;
        if (this.parentNodes[0] == root) {
            this.parentNodes.shift();
        }
        return root;
    }

    restoreRootFromLastInsertedNode(detached) {
        if (this.parentNodes.length == 0) {
            return null;
        }
        var last = this.parentNodes.pop();
        var parent = last.parent;
        var prev = (parent != null && MaxHeap.isParentNode(parent)) || parent == detached;
        last.remove();
        this.root = last;
        if (detached.left != last) {
            last.appendChild(detached.left);
        }
        if (detached.right != last) {
            last.appendChild(detached.right);
        }
        if (!prev && parent != null && MaxHeap.isParentNode(parent)) {
            this.parentNodes.unshift(parent);
        }
        if (MaxHeap.isParentNode(last)) {
            this.parentNodes.unshift(last);
        }
        return last;
    }

    size() {
        return this.count;
    }

    isEmpty() {
        return this.count == 0;
    }

    clear() {
        this.root = null;
        this.parentNodes = [];
        this.count = 0;
    }

    insertNode(node) {
        if (this.root == null) {
            this.root = node;
        } else {
            this.parentNodes[0].appendChild(node);
            if (!MaxHeap.isParentNode(this.parentNodes[0])) {
                this.parentNodes.shift();
            }
        }
        this.parentNodes.push(node);
    }

    shiftNodeUp(node) {
        var first_node = -1;
        var second_node = -1;
        var parent = node.parent;
        if (parent != null) {
            if (parent.priority < node.priority) {
                if (MaxHeap.isParentNode(node)) {
                    first_node = this.parentNodes.indexOf(node);
                    if (MaxHeap.isParentNode(parent)) {
                        second_node = this.parentNodes.indexOf(parent);
                    }
                }
                if (first_node != -1) {
                    this.parentNodes[first_node] = parent;
                    if (second_node != -1) {
                        this.parentNodes[second_node] = node;
                    }
                }
                if (parent == this.root) {
                    this.root = node;
                }
                node.swapWithParent();
                this.shiftNodeUp(node);
            }
        }
    }

    shiftNodeDown(node) {
        var first_node = -1;
        var second_node = -1;
        var child = node.left;
        if (node.right != null && child.priority < node.right.priority) {
            child = node.right;
        }
        if (child != null && child.priority > node.priority) {
            if (MaxHeap.isParentNode(child)) {
                first_node = this.parentNodes.indexOf(child);
                if (MaxHeap.isParentNode(node)) {
                    second_node = this.parentNodes.indexOf(node);
                }
            }
            if (first_node != -1) {
                this.parentNodes[first_node] = node;
                if (second_node != -1) {
                    this.parentNodes[second_node] = child;
                }
            }
            if (node == this.root) {
                this.root = child;
            }
            child.swapWithParent();
            this.shiftNodeDown(node);
        }
    }

    static isParentNode(node) {
        return node.left == null || node.right == null;
    }
}

module.exports = MaxHeap;