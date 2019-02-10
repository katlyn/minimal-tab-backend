import * as express from 'express'
import Unsplash, { toJson } from 'unsplash-js'
import { default as nodeFetch } from 'node-fetch'
import { middleware as cache } from 'apicache'

global.fetch = nodeFetch

const app = express()
const unsplash = new Unsplash({
  applicationId: process.env.API_ACCESS
})

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.get('/api/random', cache('1 minute'), (req, res) => {
  let orientation
  if (req.query && req.query.orientation) {
    if (req.query.orientation === 'landscape') {
      orientation = 'landscape'
    } else if (req.query.orientation === 'portrait') {
      orientation = 'portrait'
    }
  }
  unsplash.photos.getRandomPhoto({ collections: [ 1235504 ], orientation })
    .then(toJson)
    .then(image => res.json({
      url: image.urls.raw,
      credit: {
        name: image.user.name,
        url: image.links.html
      }
    }))
})

app.get('/api/random/landscape', cache('1 minute'), (req, res) => {
  console.log('got a req')
  unsplash.photos.getRandomPhoto({ collections: [ 1235504 ], orientation: 'landscape' })
    .then(toJson)
    .then(image => res.json({
      url: image.urls.raw,
      credit: {
        name: image.user.name,
        url: image.links.html
      }
    }))
})

app.get('/api/random/portrait', cache('1 minute'), (req, res) => {
  console.log('got a req')
  unsplash.photos.getRandomPhoto({ collections: [ 1235504 ], orientation: 'portrait' })
    .then(toJson)
    .then(image => res.json({
      url: image.urls.raw,
      credit: {
        name: image.user.name,
        url: image.links.html
      }
    }))
})

app.get('/api/random/bulk', cache('10 minutes'), (req, res) => {
  let orientation
  if (req.query && req.query.orientation) {
    if (req.query.orientation === 'landscape') {
      orientation = 'landscape'
    } else if (req.query.orientation === 'portrait') {
      orientation = 'portrait'
    }
  }
  unsplash.photos.getRandomPhoto({
    collections: [ 1235504 ],
    count: 30,
    orientation
  })
    .then(toJson)
    .then(images => {
      let returnObject = []
      images.forEach(image => {
        returnObject.push({
          url: image.urls.raw,
          credit: {
            name: image.user.name,
            url: image.links.html
          }
        })
      })
      res.json(returnObject)
    })
})

app.listen(80)
