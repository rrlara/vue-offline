import PouchDB from 'pouchdb'
import _ from 'lodash'

// const db = new PouchDB('vuedb')
var remotedb

// create local PouchDB
var db = new PouchDB('localDB')
var databaseName = 'moments'
window.PouchDB = PouchDB

var store = {}

PouchDB.debug.disable()

store.create = data => {
  return db.post(data)
}

store.find = () => {
  return db.allDocs({include_docs: true})
}

store.findPosts = () => {
  function map (doc, emit) {
    if (doc.type === 'post') {
      emit(doc.createdAt)
    }
  }
  return db.query(map, {include_docs: true, attachments: true}).then(posts =>
    _.map(posts.rows, (post) => post.doc)
  )
}

store.findPostById = (id) => {
  return db.get(id)
}

store.findCommentsByPostId = (postId) => {
  function map (doc, emit) {
    if (doc.postId === postId) {
      emit(doc.createdAt)
    }
  }
  return db.query(map, {include_docs: true}).then(comments =>
    _.map(comments.rows, (comment) => comment.doc)
  )
}

store.reloadPosts = (obj, prop) => {
  store.findPosts().then(posts => {
    obj[prop] = _.map(posts, (post) => post)
  })
  if (remotedb) {
    db.sync(remotedb)
  }
}

store.reloadComments = (obj, prop, postId) => {
  store.findCommentsByPostId(postId).then(comments => {
    obj[prop] = _.map(comments, (comment) => comment)
  })
  if (remotedb) {
    db.sync(remotedb)
  }
}

export default store