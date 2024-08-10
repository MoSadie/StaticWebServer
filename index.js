const http = require('http');
const fs = require('fs');
const path = require('path');
const cte = require('content-type-to-ext');

const server = http.createServer((req, res) => {
    // Get the file path based on the requested URL
    const filePath = path.join(__dirname, 'www', req.url);

    // Check if the file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // File not found
            res.statusCode = 404;
            res.end('File not found');
        } else {
            // Check to make sure the file is under the 'www' directory
            if (!filePath.startsWith(path.join(__dirname, 'www'))) {
                res.statusCode = 403;
                res.end('Forbidden');
                return;
            }
            // Read the file and send it as the response
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    // Error reading the file
                    res.statusCode = 500;
                    res.end('Internal server error');
                } else {
                    // Set the content type based on the file extension
                    let extension = path.extname(filePath);
                    let contentType = cte.getContentType(extension);
                    if (!contentType) {
                        contentType = 'plain/text';
                    }
                    res.setHeader('Content-Type', contentType);
                    // Send the file contents as the response
                    res.statusCode = 200;
                    res.end(data);
                }
            });
        }
    });
});

server.listen(7777, () => {
    console.log('Server is running on port 7777');
});