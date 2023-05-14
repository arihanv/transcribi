import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';

function TopBar() {
  return (
    <>
      <Navbar fixed="top" bg="dark" className='bg-transparent backdrop-blur-lg' variant="dark">
        <Container className='flex justify-between font-semibold'>
          <Navbar.Brand href="#/">Transcribi</Navbar.Brand>
          <Nav className="mr-0">
          </Nav>
          <Nav>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default TopBar;