import { Link } from "react-router-dom";
import { Row, Col, Button } from 'react-bootstrap';

function NotFoundPage() {
  return (
    <Row className="w-100 justify-content-center">
      <Col md={6} className="text-center p-4">
        <h1 className="display-1 mb-4">404</h1>
        <p className="text-secondary mb-4">Pagina non trovata</p>
        <Link to="/" className="text-decoration-none">
          <Button variant="primary" size="lg" className="px-4 py-2">
            Torna alla Home
          </Button>
        </Link>
      </Col>
    </Row>
  );
};

export default NotFoundPage;
