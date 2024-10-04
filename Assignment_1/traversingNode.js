import fs from 'fs';
import path from 'path';

/**
 * Recursively builds a directory tree structure
 * 
 * @param {string} rootDir - Root directory to start from
 * @param {number} depth - The depth to which directories and files should be processed
 * @returns {Object} - The hierarchical structure of directories and files
 */
export const directoryToTree = function (rootDir, depth) {
    // Helper function to process a directory or file and return its object representation
    function getDirectoryTree(currentPath, currentDepth) {
        const stats = fs.statSync(currentPath); // Get file/directory stats
        const type = stats.isDirectory() ? 'dir' : 'file';
        const size = stats.size;
        const name = path.basename(currentPath); // Get file/directory name
        const relativePath = path.relative(process.cwd(), currentPath); // Get relative path

        const node = { path: relativePath, name, type, size };

        if (type === 'dir' && currentDepth > 0) {
            node.children = [];
            const entries = fs.readdirSync(currentPath);

            // Recursively process each file or directory
            for (const entry of entries) {
                const fullPath = path.join(currentPath, entry);
                node.children.push(getDirectoryTree(fullPath, currentDepth - 1));
            }
        }
        
        return node;
    }

    // Start building the tree from the root directory
    return getDirectoryTree(rootDir, depth);
}

// Example usage
const tree = directoryToTree('dummy_dir/b_dir', 5);
console.log(JSON.stringify(tree, null, 2)); 