import { groupingDate } from '../api/groupingDate';

export function DateGroupedView({ data }) {
  const grouped = groupingDate(data);

  return (
    <div className="dateView">
      {grouped.map((group, idx) => (
        <div key={idx} className="dateGroup">
          <h3>{group.date}</h3>
          <ul>
            {group.tasks.map((task, i) => (
              <li key={i}>
                <strong>{task.plantName}</strong>: {task.todos.join(', ')}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}