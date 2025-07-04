import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';


export function TodoCard({ todoCard }) {
  if (!todoCard) return null; // 안전하게 처리

  return (
    <Card className="bg-dark text-white">
      <Card.Img src="./img/2.gif" alt="Card image" />

      <Card.ImgOverlay>
          <Card.Title >{todoCard.name}</Card.Title>
          {todoCard.tasks.map((task, idx) => (
            <div key={idx} className="taskItem">
              <span>{task.date}</span>

              <Card.Text>
                {task.todos.map((todo, i) => (
                  <ListGroup>
                    
                  
                  <ListGroup.Item key={i} >{todo}</ListGroup.Item>
                  </ListGroup>
                ))}
              </Card.Text>
            </div>
          ))}
      </Card.ImgOverlay>
    </Card>
  );
}
