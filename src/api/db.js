import Dexie from 'dexie';


const db = new Dexie('PlantToDoDb');

db.version(1).stores({
    todos: "++id,name,tasks",
    plants: "++id,name",
    region: "",  
})


export default db;