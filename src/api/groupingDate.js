export function groupingDate(todoCard) {
  const dateMap = {};

  todoCard.forEach(plant => {
    plant.tasks.forEach(task => {
      if (!dateMap[task.date]) {
        dateMap[task.date] = [];
      }
      dateMap[task.date].push({
        plantName: plant.name,
        todos: task.todos
      });
    });
  });

  // 정렬된 날짜 기준으로 배열 생성
  return Object.entries(dateMap)
    .sort((a, b) => new Date('2025-' + a[0]) - new Date('2025-' + b[0])) // "7월 3일" 처리
    .map(([date, tasks]) => ({ date, tasks }));
}