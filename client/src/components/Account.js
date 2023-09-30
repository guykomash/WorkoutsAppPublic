import { Container, Grid, Paper, Typography } from '@mui/material';
import { useAuth } from '../contexts/AuthProvider';
const Account = () => {
  const { auth } = useAuth();

  return !auth ? (
    <Typography variant="h5" align="center" gutterBottom>
      Loading account data...
    </Typography>
  ) : (
    <Container maxWidth="sm">
      <br />
      <Typography variant="h4" align="center" gutterBottom>
        My Account
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Grid item xs={12}>
          <Grid container direction="row" justifyContent="left">
            <Typography
              key={`lastname-label`}
              variant="h6"
              align="center"
              gutterBottom
            >
              User name:
            </Typography>
            <Typography
              key={`lastname-value`}
              variant="h6"
              sx={{ fontStyle: 'italic', color: '#3f50b5', marginLeft: '10px' }}
            >
              {`${auth.userName}`}
            </Typography>
          </Grid>
          <Grid container direction="row" justifyContent="left">
            <Typography key={`firstname-label`} variant="h6" gutterBottom>
              First name:
            </Typography>
            <Typography
              key={`firstname-value`}
              variant="h6"
              sx={{
                fontStyle: 'italic',
                color: '#3f50b5',
                marginLeft: '10px',
              }}
            >
              {`${auth.firstName}`}
            </Typography>
          </Grid>
          <Grid container direction="row" justifyContent="left" alignItems="">
            <Typography
              key={`lastname-label`}
              variant="h6"
              align="center"
              gutterBottom
            >
              Last name:
            </Typography>
            <Typography
              key={`lastname-value`}
              variant="h6"
              sx={{ fontStyle: 'italic', color: '#3f50b5', marginLeft: '10px' }}
            >
              {`${auth.lastName}`}
            </Typography>
          </Grid>
          <Grid container direction="row" justifyContent="left" alignItems="">
            <Typography
              key={`lastname-label`}
              variant="h6"
              align="center"
              gutterBottom
            >
              Created:
            </Typography>
            <Typography
              key={`lastname-value`}
              variant="h6"
              sx={{ fontStyle: 'italic', color: '#3f50b5', marginLeft: '10px' }}
            >
              {`${auth.created}`}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Account;
