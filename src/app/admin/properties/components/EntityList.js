import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Grid
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ItemCard from './ItemCard';

const EntityList = ({
  title,
  items,
  loading,
  onAdd,
  onEdit,
  onDelete,
  currentTab,
  allDevelopers
}) => {
  if (loading && items.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h6">{title}</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAdd}
          sx={{
            bgcolor: "#25D366",
            "&:hover": { bgcolor: "#128C7E" },
          }}
        >
          Agregar
        </Button>
      </Box>

      {items.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          No hay elementos para mostrar. Agrega uno nuevo con el botón
          superior.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {items.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <ItemCard
                item={item}
                onEdit={() => onEdit(item)}
                onDelete={() => onDelete(item)}
                currentTab={currentTab}
                allDevelopers={allDevelopers}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
};

EntityList.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  onAdd: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  currentTab: PropTypes.number.isRequired,
  allDevelopers: PropTypes.array
};

export default EntityList; 