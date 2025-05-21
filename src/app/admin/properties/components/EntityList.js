import React from "react";
import PropTypes from "prop-types";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Grid,
  TablePagination,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ItemCard from "./ItemCard";

const getItemKey = (item, currentTab) => {
  switch (currentTab) {
    case 0: // Desarrolladora
      return item.realEstateDevelopmentId;
    case 1: // Desarrollo
      return item.developmentId;
    case 2: // Propiedad
      return item.prototypeId;
    default:
      return item.id;
  }
};

const EntityList = ({
  title,
  items,
  loading,
  onAdd,
  onEdit,
  onDelete,
  currentTab,
  allDevelopers,
  pagination,
  onPageChange,
  onPageSizeChange,
}) => {
  const handleChangePage = (event, newPage) => {
    onPageChange(newPage + 1); // MUI usa paginación base-0, nuestro API usa base-1
  };

  const handleChangeRowsPerPage = (event) => {
    onPageSizeChange(parseInt(event.target.value, 10));
  };

  if (loading && items.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5">{title}</Typography>
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

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 200,
          }}
        >
          <CircularProgress />
        </Box>
      ) : items.length === 0 ? (
        <Typography variant="body1" sx={{ textAlign: "center", my: 4 }}>
          No hay elementos para mostrar
        </Typography>
      ) : (
        <>
          <Grid container spacing={3}>
            {items.map((item) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={getItemKey(item, currentTab)}
              >
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

          {pagination && (
            <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
              <TablePagination
                component="div"
                count={pagination.total}
                page={pagination.page - 1}
                onPageChange={handleChangePage}
                rowsPerPage={15}
                rowsPerPageOptions={[15]}
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
                }
              />
            </Box>
          )}
        </>
      )}
    </Box>
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
  allDevelopers: PropTypes.array,
  pagination: PropTypes.object,
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
};

export default EntityList;
