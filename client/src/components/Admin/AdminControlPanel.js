import {
  Button,
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';

import React, { useState } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

import DeleteBtnWithDialog from '../DeleteBtnWithDialog';
import AdminUserDetails from './AdminUserDetails';

const AdminControlPanel = () => {
  const axiosPrivate = useAxiosPrivate();
  const [users, setUsers] = useState([]);
  const [showUsers, setShowUsers] = useState(false);
  const [openUsersDetails, setOpenUsersDetails] = useState([]);

  const getUsers = async () => {
    try {
      const response = await axiosPrivate.get('/admin/users/get-users');
      setUsers(response?.data?.users);
      console.log(response.data?.users);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteUserById = async (userId) => {
    try {
      const response = await axiosPrivate.delete(`/admin/users/${userId}`);

      //Set Users.
      setUsers(response?.data?.users);
    } catch (err) {
      console.error(err?.response?.data?.message);
      // console.error(err);
    }
  };

  const handleManageUsers = async () => {
    await getUsers();
    setShowUsers(true);
  };
  const handleCollapseUsers = () => {
    setOpenUsersDetails([]);
    setShowUsers(false);
    setUsers([]);
  };

  const handleUserViewDetailsClicked = (userId) => {
    setOpenUsersDetails((prev) => [...prev, userId]);
  };
  const handleUserViewDetailsClosed = (userId) => {
    setOpenUsersDetails((prev) => prev.filter((u) => u !== userId));
  };

  const handleUserRoleUpdate = async () => {
    await getUsers();
    console.log(`users role update`);
  };

  return (
    <Container maxWidth="sm">
      <br />
      <Typography variant="h4" align="center" gutterBottom>
        Control Panel
      </Typography>
      {!showUsers ? (
        <List>
          <ListItem key="admin-user" disablePadding>
            <ListItemText primary="Users" />
            <Button variant="outlined" onClick={() => handleManageUsers()}>
              MANAGE
            </Button>
          </ListItem>
        </List>
      ) : (
        <List>
          <Button
            fullWidth
            variant="contained"
            onClick={() => handleCollapseUsers()}
          >
            Collapse Users
          </Button>
          {users.map((user) =>
            openUsersDetails.includes(user._id) ? (
              <List key={`user-open-details-${user._id}`}>
                <ListItem>
                  <AdminUserDetails
                    user={user}
                    onRoleUpdate={() => handleUserRoleUpdate()}
                  />
                </ListItem>
                <ListItem
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <Button
                    variant="contained"
                    style={{
                      textTransform: 'none',
                      width: '50%',
                    }}
                    onClick={() => handleUserViewDetailsClosed(user._id)}
                  >{`CLOSE ${user.username}`}</Button>
                </ListItem>
              </List>
            ) : (
              <ListItem key={user._id} disablePadding>
                <ListItemText
                  primary={user.username}
                  secondary={`${user.name.firstname} ${user.name.lastname}`}
                />
                <Button
                  id={`view-details-btn-${user._id}`}
                  variant="outlined"
                  onClick={() => handleUserViewDetailsClicked(user._id)}
                >
                  View User Details
                </Button>
                {/* { title, content, id, onDelete } */}
                {/* Delete Dialog */}
                <DeleteBtnWithDialog
                  title={`Delete user: ${user.username}?`}
                  content={`This will delete the user permanently.`}
                  id={user._id}
                  onDelete={(id) => deleteUserById(id)}
                />
              </ListItem>
            )
          )}
        </List>
      )}
    </Container>
  );
};

export default AdminControlPanel;
