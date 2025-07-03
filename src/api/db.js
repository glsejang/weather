import Dexie from 'dexie';


const db = new Dexie('PlantToDoDb');

db.version(1).stores({
    todos: "++id,name,tasks",
    plants: "name",
    region: "",  
})


export default db;