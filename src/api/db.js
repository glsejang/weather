import Dexie from 'dexie';


const db = new Dexie('PlantToDoDb');

db.version(1).stores({
    todos: '++id, name, task'
})


export default db;