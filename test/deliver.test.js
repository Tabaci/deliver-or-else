
const expect = require('chai').expect
const http = require('http')
const request = require('supertest')
const path = require('path')
const fs = require('fs')

const Deliver = require('./../lib/Deliver')

let deliver = new Deliver(path.resolve(__dirname, 'fixtures/public'))

describe('Deliver', function () {
	describe('#deliver (req, res)', function () {
		let server = http.createServer((req, res) => {
			deliver.deliver(req, res).catch(() => {
				res.statusCode = 404
				res.setHeader('Content-Type', 'text/plain')
				res.end(req.url)
			})
		})

		server.listen(80, '127.0.0.1')
		
		after(function () {
			server.close()
		})
		
		it('should send the file from the uri requested to the client', function (done) {
			request(server)
					.get('/test.html')
					.expect('Content-Type', /html/)
					.expect(200)
					.end((err, res) => {
						if (err) throw err
						
						expect(res.text).to.equal(
								fs.readFileSync(path.join(__dirname, 
										'fixtures/public/test.html')).toString())
						
						done()
					})
		})
		
		it('should work with different file types', function (done) {
			request(server)
					.get('/test.css')
					.expect('Content-Type', /css/)
					.expect(200)
					.end((err, res) => {
						if (err) throw err
						
						expect(res.text).to.equal(
								fs.readFileSync(path.join(__dirname, 
										'fixtures/public/test.css')).toString())
						
						done()
					})
		})
		
		it('should work with a query string', function () {
			request(server)
					.get('/test.html?hello=world&test=2')
					.expect('Content-Type', /html/)
					.expect(200)
					.end((err, res) => {
						if (err) throw err
						
						expect(res.text).to.equal(
								fs.readFileSync(path.join(__dirname, 
										'fixtures/public/test.html')).toString())
					})
		})
		
		it('should give you and option to do something if file was not found', function (done) {
			request(server)
					.get('/test.lol')
					.expect('Content-Type', /plain/)
					.expect(404)
					.end((err, res) => {
						if (err) throw err
						
						expect(res.text).to.equal('/test.lol')
						
						done()
					})
		})
	})
})
