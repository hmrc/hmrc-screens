var fs = require('fs')
var path = require('path')
var test = require('tape')
var cleanup = require('./utils/cleanup')
var saveImages = require('../lib/save-images')
var renameImages = require('../lib/rename-images')
var copyDir = require('./utils/copy-dir')
var servicesDir = path.join(__dirname, 'services')

test('save new images to existing data file', function (t) {
  t.plan(1)

  var imageDetails = {
    images: [{
      caption: 'about blank Microsoft Lumia 950',
      imgref: 'images/test-scenario/01-about-blank-Microsoft-Lumia-950.png'
    }, {
      caption: 'iPhone 6 about blank',
      imgref: 'images/test-scenario/02-iPhone-6-about-blank.png'
    }, {
      caption: 'Laptop with HiDPI screen',
      imgref: 'images/test-scenario/03-Laptop-with-HiDPI-screen.png'
    }],
    scenarioName: 'test scenario',
    serviceName: 'test-service'
  }

  setUpFiles()

  saveImages(imageDetails, servicesDir).then(function (data) {
    t.equal(data.userjourneys[0].path, imageDetails.images, 'saves the data file with the new images')

    cleanup(servicesDir)
    t.end()
  })
})

function setUpFiles () {
  var filesDir = path.join(__dirname, 'files')
  var sampleDataFile = fs.readFileSync(path.join(__dirname, 'files', 'sample-data.js'))
  var serviceDir = path.join(servicesDir, 'test-service')
  var imagesDir = path.join(serviceDir, 'images')
  var scenarioDir = path.join(imagesDir, 'test-scenario')

  cleanup(servicesDir)
  fs.mkdirSync(servicesDir)
  fs.mkdirSync(serviceDir)
  fs.mkdirSync(imagesDir)
  copyDir(filesDir, scenarioDir)
  cleanup(path.join(scenarioDir, 'sample-data.js'))
  cleanup(path.join(scenarioDir, 'test.txt'))
  fs.writeFileSync(path.join(serviceDir, 'data.js'), sampleDataFile)
  var images = fs.readdirSync(scenarioDir).map(function (image) {
    return path.resolve(scenarioDir, image)
  })

  renameImages(images)
}
