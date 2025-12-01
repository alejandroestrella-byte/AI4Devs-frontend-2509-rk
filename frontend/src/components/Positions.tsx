import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import positionService, { PositionListItem } from '../services/positionService';

const Positions: React.FC = () => {
    const navigate = useNavigate();
    const [positions, setPositions] = useState<PositionListItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch positions from API
    useEffect(() => {
        const fetchPositions = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await positionService.getAllPositions();
                setPositions(data);
            } catch (err) {
                console.error('Error loading positions:', err);
                setError('Failed to load positions. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchPositions();
    }, []);

    const formatDate = (date: Date | null): string => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusBadgeClass = (status: string): string => {
        const statusLower = status.toLowerCase();
        if (statusLower.includes('open') || statusLower.includes('abierto')) return 'bg-success';
        if (statusLower.includes('filled') || statusLower.includes('contratado')) return 'bg-primary';
        if (statusLower.includes('closed') || statusLower.includes('cerrado')) return 'bg-danger';
        return 'bg-secondary'; // Draft/Borrador
    };

    if (loading) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" role="status" variant="primary">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p className="mt-3">Loading positions...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">
                    <Alert.Heading>Error</Alert.Heading>
                    <p>{error}</p>
                    <Button variant="outline-danger" onClick={() => window.location.reload()}>
                        Retry
                    </Button>
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-5">
            <h2 className="text-center mb-4">Posiciones</h2>
            <Row className="mb-4">
                <Col md={3}>
                    <Form.Control type="text" placeholder="Buscar por título" />
                </Col>
                <Col md={3}>
                    <Form.Control type="date" placeholder="Buscar por fecha" />
                </Col>
                <Col md={3}>
                    <Form.Control as="select">
                        <option value="">Estado</option>
                        <option value="open">Abierto</option>
                        <option value="filled">Contratado</option>
                        <option value="closed">Cerrado</option>
                        <option value="draft">Borrador</option>
                    </Form.Control>
                </Col>
                <Col md={3}>
                    <Form.Control as="select">
                        <option value="">Compañía</option>
                        {Array.from(new Set(positions.map(p => p.company))).map(company => (
                            <option key={company} value={company}>{company}</option>
                        ))}
                    </Form.Control>
                </Col>
            </Row>

            {positions.length === 0 ? (
                <Alert variant="info" className="text-center">
                    No positions available at the moment.
                </Alert>
            ) : (
                <Row>
                    {positions.map((position) => (
                        <Col md={4} key={position.id} className="mb-4">
                            <Card className="shadow-sm h-100">
                                <Card.Body className="d-flex flex-column">
                                    <Card.Title>{position.title}</Card.Title>
                                    <Card.Text className="flex-grow-1">
                                        <strong>Company:</strong> {position.company}<br />
                                        <strong>Location:</strong> {position.location}<br />
                                        <strong>Deadline:</strong> {formatDate(position.applicationDeadline)}<br />
                                        <strong>Applicants:</strong> {position.applicationsCount}
                                    </Card.Text>
                                    <div className="mb-3">
                                        <span className={`badge ${getStatusBadgeClass(position.status)} text-white`}>
                                            {position.status}
                                        </span>
                                    </div>
                                    <div className="d-flex justify-content-between mt-auto">
                                        <Button 
                                            variant="primary"
                                            onClick={() => navigate(`/position/${position.id}`)}
                                        >
                                            Ver proceso
                                        </Button>
                                        <Button variant="secondary">Editar</Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default Positions;