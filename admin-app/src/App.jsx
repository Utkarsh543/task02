import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Container,
  Grid,
  CircularProgress
} from "@mui/material";

function AdminUserPanel() {
  const [filters, setFilters] = useState({
    username: "",
    bankName: "",
    ifscCode: ""
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch users from the API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.username) params.username = filters.username;
      if (filters.bankName) params.bankName = filters.bankName;
      if (filters.ifscCode) params.ifscCode = filters.ifscCode;

      const response = await axios.get("https://task02-slur.onrender.com/admin/users", { params });

      console.log("API response:", response.data);

      const fetchedUsers = Array.isArray(response.data.users) ? response.data.users : [];
      setUsers(fetchedUsers);
    } catch (err) {
      console.error("Error fetching users", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Panel: Users and Bank Accounts
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Username"
              name="username"
              value={filters.username}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Bank Name"
              name="bankName"
              value={filters.bankName}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="IFSC Code"
              name="ifscCode"
              value={filters.ifscCode}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Apply Filters
            </Button>
          </Grid>
        </Grid>
      </form>

      {loading ? (
        <CircularProgress />
      ) : users.length > 0 ? (
        users.map((user) => (
          <Card key={user._id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">
                {user.name} ({user.email})
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Role: {user.role}
              </Typography>
              <Typography variant="subtitle1" sx={{ mt: 1 }}>
                Bank Accounts:
              </Typography>
              {user.bankAccounts && user.bankAccounts.length > 0 ? (
                <div>
                  {user.bankAccounts.map((acc) => (
                    <Card key={acc._id} sx={{ mb: 2, p: 1, boxShadow: 3 }}>
                      <CardContent>
                        <Typography variant="body1">
                          <strong>Bank:</strong> {acc.bankName}
                        </Typography>
                        <Typography variant="body1">
                          <strong>A/C:</strong> {acc.accountNumber}
                        </Typography>
                        <Typography variant="body1">
                          <strong>IFSC:</strong> {acc.ifscCode}
                        </Typography>
                        <Typography variant="body1">
                          <strong>Branch:</strong> {acc.branchName}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No bank accounts
                </Typography>
              )}
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography>No users found.</Typography>
      )}
    </Container>
  );
}

export default AdminUserPanel;
