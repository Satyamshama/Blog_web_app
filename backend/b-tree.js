class BTreeNode {
    constructor(isLeaf = true) {
        this.isLeaf = isLeaf;
        this.keys = [];
        this.children = []; 
    }
}

class BTree {
    constructor(degree) {
        this.root = new BTreeNode();
        this.degree = degree;
    }

    search(node, email) {
        let i = 0;
        while (i < node.keys.length && email > node.keys[i]) {
            i++;
        }
        if (i < node.keys.length && node.keys[i] === email) {
            return node.children[i];
        }
        if (node.isLeaf) return null;

        return this.search(node.children[i], email);
    }

    insert(email, userId) {
        const root = this.root;
        if (root.keys.length === 2 * this.degree - 1) { 
            const newNode = new BTreeNode(false); 
            newNode.children.push(root);
            this.splitChild(newNode, 0);
            this.root = newNode;
        }
        this.insertNonFull(this.root, email, userId);
    }

    insertNonFull(node, email, userId) {
        let i = node.keys.length - 1;
        if (node.isLeaf) {
            node.keys.push("");
            node.children.push(null); 

            while (i >= 0 && email < node.keys[i]) {
                node.keys[i + 1] = node.keys[i];
                node.children[i + 1] = node.children[i];
                i--;
            }

            node.keys[i + 1] = email;
            node.children[i + 1] = userId;
        } else {
            while (i >= 0 && email < node.keys[i]) {
                i--;
            }
            i++;
            if (node.children[i].keys.length === 2 * this.degree - 1) { 
                this.splitChild(node, i);
                if (email > node.keys[i]) {
                    i++;
                }
            }
            this.insertNonFull(node.children[i], email, userId);
        }
    }

    splitChild(parentNode, i) {
        const degree = this.degree;
        const fullNode = parentNode.children[i];
        const newNode = new BTreeNode(fullNode.isLeaf);

        parentNode.keys.splice(i, 0, fullNode.keys[degree - 1]);
        parentNode.children.splice(i + 1, 0, newNode);

        newNode.keys = fullNode.keys.splice(degree);
        if (!fullNode.isLeaf) {
            newNode.children = fullNode.children.splice(degree);
        }
    }

    findUserIdByEmail(email) {
        return this.search(this.root, email);
    }
}

module.exports = BTree;


