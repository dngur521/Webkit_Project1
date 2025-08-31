// Side.jsx
import { Stack, Button, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Side({ setShowLogin }) {
    return (
        <Stack gap={2} className="mx-auto w-100">
            <Button variant="primary" as={Link} to="/">
                Home
            </Button>
            <hr></hr>
            <ListGroup>
                <ListGroup.Item as={Link} to="/aircon/control">
                    에어컨 제어
                </ListGroup.Item>
                <ListGroup.Item as={Link} to="/temp/check">
                    온도 확인
                </ListGroup.Item>
            </ListGroup>
        </Stack>
    );
}
