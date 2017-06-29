var bodyParser = require('body-parser')
var express = require('express')
var path = require('path')
var app = express()
var saveImages = require('./lib/save-images')
var saveNote = require('./lib/save-note')

app.set('port', 3000)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/assets', express.static(path.join(__dirname, 'assets')))
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')))
app.use('/service', express.static(path.join(__dirname, 'service')))

app.get(['/', '/index.html'], function (req, res) {
  res.sendFile(path.join(__dirname, '/index.html'))
})

app.post('/save-note', function (req, res) {
  var servicesDir = path.join(__dirname, 'service')

  saveNote(req.body, servicesDir).then(function (data) {
    res.json(data)
  })
})

app.post('/save-images', function (req, res) {
  var servicesDir = path.join(__dirname, 'service')

  saveImages(req.body, servicesDir).then(function (data) {
    res.json(data)
  })
})

var server = app.listen(app.get('port'), function () {
  var port = server.address().port
  console.log(`Listening on port ${port}`)
})

module.exports = server
