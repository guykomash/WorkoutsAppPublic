import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  FormGroup,
  Grid,
  List,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import React, { useEffect, useState } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

const AdminUserDetails = ({ user, onRoleUpdate }) => {
  const axiosPrivate = useAxiosPrivate();
  const [userWorkouts, setUserWorkouts] = useState(null);
  const [editRolesOpen, setEditRolesOpen] = useState(false);
  const [admin, setAdmin] = useState(user.roles.Admin !== undefined);
  const [editor, setEditor] = useState(user.roles.Editor !== undefined);

  const fetchUser = async (userId) => {
    try {
      const response = await axiosPrivate.get(`/admin/users/${userId}`);
      console.log(response.data.user);
    } catch (err) {
      console.error(err);
    }
  };
  const updateUserRoles = async (roles) => {
    try {
      const response = await axiosPrivate.put(
        `/admin/users/update-roles-${user._id}`,
        {
          roles,
        }
      );
      console.log(response.data);
      await fetchUser();
    } catch (err) {
      console.error(err);
    }
  };

  const getUserWorkouts = async () => {
    try {
      const response = await axiosPrivate.get(`/workouts/user/${user._id}`);
      setUserWorkouts(response.data.Workouts);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getUserWorkouts();
  }, []);

  const handleEditRolesClicked = () => {
    setEditRolesOpen(true);
    console.log(user);
  };

  const handleEditRolesSave = async () => {
    const roles = { User: true };
    if (admin) {
      roles.Admin = true;
    } else roles.Admin = false;
    if (editor) {
      roles.Editor = true;
    } else roles.Editor = false;
    await updateUserRoles(roles);
    await onRoleUpdate();
    setEditRolesOpen(false);
  };

  const RolesToString = (roles) => {
    let rolesStr = '';
    let admin = roles.Admin ? 'Admin' : null;
    let editor = roles.Editor ? 'Editor' : null;
    let user = roles.User ? 'User' : null;
    if (admin) rolesStr = admin + ', ';
    if (editor) rolesStr = rolesStr + editor + ', ';
    if (user) rolesStr = rolesStr + user + ', ';
    rolesStr = rolesStr.trim();
    if (rolesStr.slice(-1) === ',') rolesStr = rolesStr.slice(0, -1);
    return rolesStr;
  };
  return (
    <Container>
      <Paper
        elevation={4}
        style={{
          width: '100%',
        }}
      >
        <Box
          sx={{
            flexDirection: 'row',
            textAlign: 'center',
          }}
        >
          <List>
            <ListItemText
              primary={user.username}
              secondary={`${user.name.firstname} ${user.name.lastname}`}
            />
            <Typography>{`created: ${user.created}`}</Typography>
            {editRolesOpen === true ? (
              <FormGroup
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignContent: 'center',
                  justifyContent: 'center',
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      label="Admin"
                      checked={admin}
                      onChange={(e) => setAdmin(e.target.checked)}
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                  }
                  label="Admin"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={editor}
                      onChange={(e) => setEditor(e.target.checked)}
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                  }
                  label="Editor"
                />
                <FormControlLabel
                  disabled
                  control={<Checkbox checked={true} />}
                  label="User"
                />
                <Button variant="contained" onClick={handleEditRolesSave}>
                  SAVE
                </Button>
              </FormGroup>
            ) : (
              <Grid
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Typography>{`ROLES: ${RolesToString(user.roles)}`}</Typography>
                <Button onClick={() => handleEditRolesClicked()}>
                  <EditIcon></EditIcon>
                </Button>
              </Grid>
            )}
          </List>
        </Box>
        <List>
          <Box
            sx={{
              width: '100%',
              height: '150px',
              textAlign: 'center',
              overflow: 'auto',
            }}
          >
            {!userWorkouts ? (
              <Typography style={{ fontWeight: '400' }}>
                loading user workouts...
              </Typography>
            ) : userWorkouts.length === 0 ? (
              <Typography style={{ fontWeight: '600', color: '#3f50b5' }}>
                User has no workouts...
              </Typography>
            ) : (
              <>
                <Typography style={{ fontWeight: '600', color: '#3f50b5' }}>
                  Workouts:
                </Typography>
                {userWorkouts.map((workout) => (
                  <ListItemText
                    key={`admin-workout-text-${workout._id}`}
                    primary={workout.title}
                    secondary={workout.lastUpdated}
                  />
                ))}
              </>
            )}
          </Box>
        </List>
      </Paper>
    </Container>
  );
};

export default AdminUserDetails;

/**      <Stack
        
        direction="row"
      ></Stack> */
