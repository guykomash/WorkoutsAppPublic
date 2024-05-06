import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Input,
  Paper,
  Typography,
} from '@mui/material';
import { useAuth } from '../contexts/AuthProvider';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import axios from 'axios';

const Account = () => {
  const { auth } = useAuth();
  const [file, setFile] = useState(null);
  const axiosPrivate = useAxiosPrivate();
  const [accountImage, setAccountImage] = useState(null);

  const awsBaseURL =
    'https://workouts-accounts-images.s3.eu-central-1.amazonaws.com';

  useEffect(() => {
    if (auth) {
      setAccountImage(`${awsBaseURL}/${auth.userId}/account-image.jpeg`);
      console.log(auth.userId);
      console.log(accountImage);
    }
  }, [() => uploadImageFile]);

  const handleFileChange = (files) => {
    console.log(files[0]);
    setFile(files[0]);
  };

  const getUploadConfig = async () => {
    try {
      //get(`/workouts/${workoutId}`)
      const response = await axiosPrivate.get(`/upload`);
      return response.data;
    } catch (err) {
      console.error(err);
    }
  };
  const uploadImageFile = async () => {
    if (!file) {
      return alert('Please select an image');
    } else {
      const uploadConfig = await getUploadConfig();
      console.log(uploadConfig);

      try {
        const response = await axios.put(uploadConfig.url, file, {
          headers: {
            'Content-Type': file.type,
          },
        });
        console.log(response);
      } catch (err) {
        console.error(err);
      }
    }
  };

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
        <Typography
          key={`image-label`}
          variant="h6"
          align="center"
          gutterBottom
        >
          Account Image
        </Typography>
        <Box
          component="img"
          sx={{
            height: '80%',
            width: '80%',
          }}
          alt="You don't have an account image yet!"
          src={`${accountImage}`}
        />
      </Paper>
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
      <br />
      <br />
      <Grid container direction="row" justifyContent="center">
        <Typography
          key={`imagechange-value`}
          variant="h6"
          sx={{ fontStyle: 'italic', color: 'black', marginLeft: '10px' }}
        >
          Want to change your account image?
          <br />
        </Typography>
        <Button
          sx={{
            width: '320px',
            borderRadius: '15px',
            color: 'black',
            backgroundColor: 'gold',
            ':hover': {
              color: 'gold',
              backgroundColor: '#333333',
            },
          }}
          variant="contained"
          component="label"
        >
          <input
            onChange={(e) => handleFileChange(e.target.files)}
            type="file"
            accept="image/*"
          />
        </Button>
        <Button onClick={() => uploadImageFile()}>send</Button>
      </Grid>
    </Container>
  );
};

export default Account;
