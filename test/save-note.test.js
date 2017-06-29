var fs = require('fs')
var path = require('path')
var test = require('tape')
var cleanup = require('./utils/cleanup')
var saveNote = require('../lib/save-note')

test('save new note to existing data file', function (t) {
  t.plan(1)

  var sampleDataFile = fs.readFileSync(path.join(__dirname, 'files', 'sample-data.js'))
  var servicesDir = path.join(__dirname, 'services')
  var serviceDir = path.join(servicesDir, 'test-service')

  var noteInfo = {
    path: {
      caption: 'Laptop with HiDPI screen',
      imgref: 'images/test-scenario/01-Laptop-with-HiDPI-screen.png',
      note: 'old-note'
    },
    note: 'new note',
    serviceName: 'test-service',
    userJourney: {
      title: 'test scenario',
      path: [{
        caption: 'Laptop with HiDPI screen',
        imgref: 'images/test-scenario/01-Laptop-with-HiDPI-screen.png',
        note: 'old-note'
      }]
    }
  }

  cleanup(servicesDir)
  fs.mkdirSync(servicesDir)
  fs.mkdirSync(serviceDir)
  fs.writeFileSync(path.join(serviceDir, 'data.js'), sampleDataFile)

  saveNote(noteInfo, servicesDir).then(function (data) {
    t.equal(data.userjourneys[0].path[0].note, 'new note', 'saves the data file with the new note')

    cleanup(servicesDir)
    t.end()
  })
})
