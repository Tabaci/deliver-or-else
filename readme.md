<p align="left">
<a href="https://travis-ci.org/Tabaci/mimisbrunnr"><img src="https://travis-ci.org/Tabaci/mimisbrunnr.svg?branch=master"></a>
<a href="https://codecov.io/gh/Tabaci/mimisbrunnr"><img src="https://codecov.io/gh/Tabaci/mimisbrunnr/branch/master/graph/badge.svg" /></a>
</p>

# deliver-or-else

This *npm* module is used to deliver local files automatically to the client 
depending on the URL. If no file can be located in the local file system, it is 
possible (through the use of a `Promise`) to provide some other logic.

## Installation

```javascript
$ npm install deliver-or-else
```

## Usage

When requiring *deliver-or-else*, you are given a constructor function:

```javascript
const Deliver = require('deliver-or-else')
```

The `Deliver` constructor function takes in one parameter (which is required), 
denoting the path to the local file system. Only the files in the path you give 
in will be available to the end users (the browser clients).

Given that, we can dedicate a single directory (such as the conventional 
`public/`) to be the one browsers can access:

```javascript
const path = require('path')

// It is up to you to resolve the document root directory
let deliver = new Deliver(path.join(__dirname, 'public'))
```

### Serving Files

Now that we have a `Deliver` instance, we can use it to automatically deliver 
files. The directory structure for our files, currently looks like this:

```
public/
	index.html
	test.css
	test.jpeg
```

Now to the server:

```javascript
const http = require('http')

let server = http.createServer((req, res) => {
	/**
	 * The `deliver` method returns a `Promise`, which in turn can be used to 
	 * catch any errors (such as a 404). We could also provide a `then` clause 
	 * for when it works successfully and a file has been delivered.
	 */
	deliver.deliver(req, res).catch((err) => {
		// The err contains information regarding how the `fs.readFile` failed
		
		res.statusCode = 404
		res.setHeader('Content-Type', 'text/plain')
		res.end('404, no such file.')
	})
})

server.listen(80, '127.0.0.1', function () {
	console.log('Starting server...')
})
```

With the above structure, if the URL from the browser client is `/index.html`, 
`test.css` or `test.jpeg`, it will deliver one of these files, otherwise the 
client is presented with a `404, no such file` error page.

Since errors are caught, we could provide some other routing mechanism in the 
`catch` method's callback. If the `css` and `jpeg` files were to be in the 
`html` document, they would be automatically requested from the server.

## License

This module, and the code therein, is licensed under MIT.
