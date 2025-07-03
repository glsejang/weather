import Dexie from 'dexie';


const db = new Dexie('PlantToDoDb');

db.version(1).stores({
    plants: '&name',
    todos: "++id,name,tasks",
    region: "",  
})


export default db;