import PouchDB from 'pouchdb'
PouchDB.plugin(require('pouchdb-authentication'));
import _ from 'lodash'

// create local PouchDB
var db = new PouchDB('localDB', {adapter: 'websql', size: 51})

//remote db
//https://b083a090-3ee2-439a-9737-1e2d9fb05185-bluemix.cloudant.com/moments/_all_docs
var couchDBServerUrl = 'https://b083a090-3ee2-439a-9737-1e2d9fb05185-bluemix.cloudant.com'
var databaseName = 'moments'
var user = 'pectseentingettedgedsude'
var password = '896d74f5e601d6cb9916ee19b34e786b80c0f24a'

var remotedb = new PouchDB(couchDBServerUrl + '/' + databaseName, { skipSetup: true})

// login to the remote CouchDB database
remotedb.login(user, password, function (err, response) {
        if (err) {
            if (err.name === 'unauthorized') {
                console.log('name or password are incorrect');
            }
        }
        else {
            console.log('login successful for user: ' + response.name);
            initializeRealtimeReplication(db, remotedb);
        }
    }
);

window.PouchDB = PouchDB

PouchDB.debug.disable()

/**
 * Establishes a real-time bi-directional replication between a localDB and remoteDB as changes are made
 * @param localDB - a local PouchDB on the browser
 * @param remoteDB - a remote CouchDB on the server
 */
function initializeRealtimeReplication(db, remotedb) {
    db.sync(remotedb, {
        live: true,
        retry: true
    }).on('change', function (change) {
        console.log('yo, something changed! ' + change);
    }).on('paused', function (info) {
        console.log('replication was paused, usually because of a lost connection ' + info);
    }).on('active', function (info) {
        console.log('replication was resumed ' + info);
    }).on('error', function (err) {
        console.log('totally unhandled error (shouldn\'t happen) ' + err);
    });
}

/*

API methods

*/

var store = {}

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

store.deletePostById = (id) => {
  // return db.get(id)
  return db.get(id).then(function(doc) {
    db.remove(doc);
  })
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