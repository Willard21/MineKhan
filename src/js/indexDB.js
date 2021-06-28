async function createDatabase() {
	return await new Promise((resolve, reject) => {
		let request = window.indexedDB.open("MineKhan", 1)

		request.onupgradeneeded = function(event) {
			let DB = event.target.result
			// Worlds will contain and ID containing the timestamp at which the world was created, a "saved" timestamp,
			// and a "data" string that's identical to the copy/paste save string
			let store = DB.createObjectStore("worlds", { keyPath: "id" })
			store.createIndex("id", "id", { unique: true })
			store.createIndex("data", "data", { unique: false })
		}

		request.onsuccess = function() {
			resolve(request.result)
		}

		request.onerror = function(e) {
			console.error(e)
			reject(e)
		}
	})
}
async function loadFromDB(id) {
	let db = await createDatabase()
	let trans = db.transaction("worlds", "readwrite")
	let store = trans.objectStore("worlds")
	let req = id ? store.get(id) : store.getAll()
	return await new Promise(resolve => {
		req.onsuccess = function() {
			resolve(req.result)
			db.close()
		}
		req.onerror = function() {
			resolve(null)
			db.close()
		}
	})
}
async function saveToDB(id, data) {
	let db = await createDatabase()
	let trans = db.transaction("worlds", "readwrite")
	let store = trans.objectStore("worlds")
	let req = store.put({ id: id, data: data })
	return new Promise((resolve, reject) => {
		req.onsuccess = function() {
			resolve(req.result)
		}
		req.onerror = function(e) {
			reject(e)
		}
	})
}
async function deleteFromDB(id) {
	let db = await createDatabase()
	let trans = db.transaction("worlds", "readwrite")
	let store = trans.objectStore("worlds")
	let req = store.delete(id)
	return new Promise((resolve, reject) => {
		req.onsuccess = function() {
			resolve(req.result)
		}
		req.onerror = function(e) {
			reject(e)
		}
	})
}

export { createDatabase, loadFromDB, saveToDB, deleteFromDB };