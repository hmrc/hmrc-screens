var fs = require('fs')
var path = require('path')
var getImages = require('./get-images')
var leadingZero = require('./utils/leading-zeros')

function getActiveUserJourneyIndex(userJourneys, scenarioName) {
  return userJourneys.findIndex(function (journey) {
    return journey.title === scenarioName
  })
}

function renameImage(serviceDir, imageSet, oldName, newName) {
  getImages(serviceDir, imageSet.serviceName, imageSet.scenarioName).then(function (images) {
    var newPath = path.join(serviceDir, newName)
    var oldPath = path.join(serviceDir, oldName)

    images.forEach(function (image) {
      if (image.includes(oldName)) {
        fs.renameSync(oldPath, newPath)
      }
    })
  })
}

var saveImages = function (imageSet, servicesDir) {
  return new Promise(function (resolve, reject) {
    var serviceDir = path.join(servicesDir, imageSet.serviceName)

    fs.readFile(path.join(serviceDir, 'data.js'), 'utf8', function (err, data) {
      if (err) {
        reject(err)
      }

      data = JSON.parse(data.replace(/^.*(?={)/, ''))

      var activeUserJourneyIndex = getActiveUserJourneyIndex(data.userjourneys, imageSet.scenarioName)

      data.userjourneys[activeUserJourneyIndex].path = imageSet.images

      data.userjourneys[activeUserJourneyIndex].path.forEach(function (pathItem, index) {
        var length = data.userjourneys[activeUserJourneyIndex].path.length
        var oldName = pathItem.imgref
        var newName = pathItem.imgref.replace(/\/\d+-/g, `/${leadingZero(index + 1, length)}-`)

        renameImage(serviceDir, imageSet, oldName, newName)

        data.userjourneys[activeUserJourneyIndex].path[index].imgref = newName
      })

      var dataFile = `var data = ${JSON.stringify(data, null, 2)}`

      fs.writeFile(path.join(serviceDir, 'data.js'), dataFile, function (err) {
        if (err) {
          reject(err)
        }

        resolve(data)
      })

      resolve(data)
    })
  })
}

module.exports = saveImages
