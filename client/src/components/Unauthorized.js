import { Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  const goBack = () => navigate(-1);

  return (
    <Container maxWidth="sm">
      <br />
      <Typography variant="h4" align="center" gutterBottom>
        Unauthorized
      </Typography>
    </Container>
  );
};

export default Unauthorized;
