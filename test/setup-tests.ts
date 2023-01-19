import {JSDOM} from 'jsdom'
import dotenv from 'dotenv'

dotenv.config({path: './.env.test', override: true})

// use code below to add dom env for testEnvironment: node
const jsdom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost/',
})
const {window} = jsdom
function copyProps(src, target) {
  Object.defineProperties(target, {
    ...Object.getOwnPropertyDescriptors(src),
    ...Object.getOwnPropertyDescriptors(target),
  })
}

global.window = window
global.document = window.document
global.navigator = {
  userAgent: 'node.js',
} as any
global.requestAnimationFrame = function (callback) {
  return setTimeout(callback, 0)
}
global.cancelAnimationFrame = function (id) {
  clearTimeout(id)
}
copyProps(window, global)
