
const path = require('path')
const fs = require('fs')

const mime = require('mimisbrunnr').mime

/**
 * @author Alexander Hållenius
 * 
 * Handles the delivering of files available on the local system to clients.
 */
module.exports = class Deliver
{
	/**
	 * @param {string} documentRoot - The absolute path to the document root 
	 *        where the files applicable for sending reside.
	 */
	constructor (documentRoot)
	{
		/**
		 * @type {string}
		 */
		this._documentRoot = documentRoot
	}
	
	/**
	 * Deliver delivers a file to the client if available in your directory 
	 * structure.
	 */
	deliver (req, res)
	{
		return new Promise((resolve, reject) => {
			let url = req.url
			let [uri, ] = url.split('?') // Strip of query string
			
			this.sendFile(uri, res).then(resolve).catch(err => {
				reject(err)
			})
		})
	}
	
	/**
	 * Sends a specific file to the client.
	 */
	sendFile (fileName, res)
	{
		return new Promise((resolve, reject) => {
			let filePath = path.join(this._documentRoot, fileName)
			
			fs.readFile(filePath, (err, data) => {
				if (err)
					// No such file
					
					reject(err)
				else
				{
					res.setHeader('Content-Type', mime(fileName))
					res.statusCode = 200
					res.end(data)
					
					resolve()
				}
			})
		})
	}
}
