import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';

export function TodoCard({ todoCard }) {
  if (!todoCard) return null; // 안전하게 처리

  return (
       <Accordion defaultActiveKey="0" className="mb-3">
      <Accordion.Item eventKey="0">
        <Accordion.Header>{todoCard.name}</Accordion.Header>
        <Accordion.Body>
          {todoCard.tasks.map((task, idx) => (
            <div key={idx} className="mb-3 taskItem">
              <h6>{task.date}</h6>
              <ListGroup>
                {task.todos.map((todo, i) => (
                  <ListGroup.Item key={i}>{todo}</ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          ))}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}
