import React, { useState } from 'react';
import logolight from '../../assets/images/logo-light.png';
import logodark from '../../assets/images/logo-dark.png';
import avatar1 from '../../assets/images/users/avatar-1.jpg'
import { Container, Row, Col, Card, CardBody } from 'reactstrap';

import { Link, useNavigate  } from 'react-router-dom';

const LockScreen = () => {
    document.title = "Lock Screen | Home QR";

    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const authUser = JSON.parse(localStorage.getItem('authUser'));
    const handleSubmit = (e) => {
        e.preventDefault();
        if (authUser && password === authUser.user.lockScreenPassword) {
            navigate('/dashboard');
        } else {
            setError('Incorrect password. Please try again.');
        }
    };





    return (
        <React.Fragment>

            <div className="bg-pattern" style={{height:"100vh"}}>
                <div className="bg-overlay"></div>
                <div className="account-pages pt-5">
                    <Container>
                        <Row className="justify-content-center">
                            <Col lg={6} md={8} xl={4}>
                                <Card className='mt-5'>
                                    <CardBody className="p-4">
                                        <div className="">
                                            <div className="text-center">
                                                <h2 className='font-size-18 text-muted'>Home QR</h2>
                                            </div>
                                            <h4 className="font-size-18 text-muted mt-2 text-center">Locked Screen</h4>
                                            <p className="mb-5 text-center">Enter your password to unlock the screen!</p>
                                            <form className="form-horizontal" onSubmit={handleSubmit}>
                                                <Row>
                                                    <Col md={12}>
                                                        <div className="user-thumb text-center m-b-30">
                                                            <img src={avatar1} className="rounded-circle avatar-lg img-thumbnail mx-auto d-block" alt="thumbnail" />
                                                        </div>

                                                        <div className="mt-4">
                                                            <label className="form-label" htmlFor="userpassword">Password</label>
                                                            <input
                                                                type="password"
                                                                className="form-control"
                                                                id="userpassword"
                                                                placeholder="Enter password"
                                                                value={password}
                                                                onChange={(e) => setPassword(e.target.value)}
                                                            />
                                                        </div>
                                                        {error && <p className="text-danger mt-2">{error}</p>}
                                                        <div className="d-grid mt-4">
                                                            <button type="submit" className="btn btn-primary waves-effect waves-light">Unlock</button>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </form>
                                        </div>
                                    </CardBody>
                                </Card>
                                {/* <div className="mt-5 text-center">
                                    <p className="text-white-50">Not you ? return<Link to="/auth-login" className="fw-medium text-primary"> Sign In </Link> </p>
                                 
                                </div> */}
                            </Col>
                        </Row>
                    </Container>
                </div>


            </div>

        </React.Fragment>
    );
}

export default LockScreen;