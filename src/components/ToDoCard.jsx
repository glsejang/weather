export function TodoCard({ todoCard }) {
  if (!todoCard) return null; // 안전하게 처리

  return (
    <div className="todoCard">
      <h2 className="plantName">{todoCard.name}</h2>
      {todoCard.tasks.map((task, idx) => (
        <div key={idx} className="taskItem">
          <h4>{task.date}</h4>
          <ul>
            {task.todos.map((todo, i) => (
              <li key={i}>{todo}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
