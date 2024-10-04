import directoryToTree  from './../traversingNode.js';

describe('directoryToTree', () => {
    it('should serialize dummy_dir/a_dir with depth of 5', () => {
        const result = directoryToTree('dummy_dir/a_dir', 5);
        const expected = {
            "path": "dummy_dir/a_dir",
            "name": "a_dir",
            "type": "dir",
            "size": 4096,
            "children": [
                {
                    "path": "dummy_dir/a_dir/test_file1.md",
                    "name": "test_file1.md",
                    "type": "file",
                    "size": 0
                }
            ]
        };
        expect(result).toEqual(expected);
    });

    it('should serialize dummy_dir with depth of 5', () => {
        const result = directoryToTree('dummy_dir', 5);
        const expected = {
            "path": "dummy_dir",
            "name": "dummy_dir",
            "type": "dir",
            "size": 4096,
            "children": [
                {
                    "path": "dummy_dir/a_dir",
                    "name": "a_dir",
                    "type": "dir",
                    "size": 4096,
                    "children": [
                        {
                            "path": "dummy_dir/a_dir/test_file1.md",
                            "name": "test_file1.md",
                            "type": "file",
                            "size": 0
                        }
                    ]
                },
                {
                    "path": "dummy_dir/b_dir",
                    "name": "b_dir",
                    "type": "dir",
                    "size": 4096,
                    "children": [
                        {
                            "path": "dummy_dir/b_dir/test_file2.md",
                            "name": "test_file2.md",
                            "type": "file",
                            "size": 4
                        }
                    ]
                },
                {
                    "path": "dummy_dir/test_file0.md",
                    "name": "test_file0.md",
                    "type": "file",
                    "size": 13
                }
            ]
        };
        expect(result).toEqual(expected);
    });

    it('should serialize dummy_dir with depth of 1', () => {
        const result = directoryToTree('dummy_dir', 1);
        const expected = {
            "path": "dummy_dir",
            "name": "dummy_dir",
            "type": "dir",
            "size": 4096,
            "children": [
                {
                    "path": "dummy_dir/a_dir",
                    "name": "a_dir",
                    "type": "dir",
                    "size": 4096,
                    "children": []
                },
                {
                    "path": "dummy_dir/b_dir",
                    "name": "b_dir",
                    "type": "dir",
                    "size": 4096,
                    "children": []
                },
                {
                    "path": "dummy_dir/test_file0.md",
                    "name": "test_file0.md",
                    "type": "file",
                    "size": 13
                }
            ]
        };
        expect(result).toEqual(expected);
    });
});