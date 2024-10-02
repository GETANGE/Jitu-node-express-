import fs from 'fs';
import http from 'http';
import path from 'node:path';
const port = 3004;

/**
 * PATH MODULE
 * basename=>returns the last portion of the path
 * extName=> returns the extension of the path, from the last occurrence of the .(period)
 * join => joins multiple parts a given segments 
 * resolve=> resolves a sequence of paths into an absolute path.
 * parse = returns an object with root, dir,ext and named properties
 */
let file=path.basename('/home/emmanuel/Desktop/Projects/Jitu-Pure-Node/index.txt');
console.log(file); // "index.txt"

let file2=path.extname('/home/emmanuel/Desktop/Projects/Jitu-Pure-Node/index.txt');
console.log(file2); // .txt"

let joinPath = path.join("/student", ":id", "?search=marks");
console.log(joinPath); // "/student/:id?search=marks"

let resolve = path.resolve("/foo/bar", "./baz")
console.log(resolve); // "/foo/bar

let parse=path.parse('/home/emmanuel/Desktop/Projects/Jitu-Pure-Node/index.txt');
console.log(parse); 

// Create an HTTP server.
const server = http.createServer(function (req, res){
    fs.readFile('index.txt', 'utf8', function(err, data){
        if(err) {
            console.log(err);
            res.writeHead(500);
            return res.end('Error loading index.txt');
        }
        res.writeHead(200);
        res.end(data);
    });
})
server.listen(port, function(){
    console.log('listening on port', port);
});