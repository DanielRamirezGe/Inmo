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
import VisibilityIcon from "@mui/icons-material/Visibility";
import Link from "next/link";
import ItemCard from "./ItemCard";
import { FORM_TYPES, TAB_INDICES, TAB_FORM_TYPE_MAP } from "../constants";
import { ENTITY_PAGINATION_CONFIG } from "../../../../constants/pagination";

const EntityList = ({
  title,
  items,
  loading,
  onAdd,
  onEdit,
  onDelete,
  onPublish,
  onUnpublish,
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

  const currentFormType = TAB_FORM_TYPE_MAP[currentTab];
  const isPublishedTab =
    currentFormType === FORM_TYPES.PROPERTY_PUBLISHED ||
    currentFormType === FORM_TYPES.PROPERTY_MINKAASA_PUBLISHED;

  const getItemKey = (item) => {
    switch (currentTab) {
      case TAB_INDICES.DEVELOPER:
        return item.realEstateDevelopmentId;
      case TAB_INDICES.DEVELOPMENT:
        return item.developmentId;
      case TAB_INDICES.PROPERTY_NOT_PUBLISHED:
      case TAB_INDICES.PROPERTY_PUBLISHED:
      case TAB_INDICES.PROPERTY_MINKAASA_UNPUBLISHED:
      case TAB_INDICES.PROPERTY_MINKAASA_PUBLISHED:
        return item.prototypeId;
      default:
        return Math.random();
    }
  };

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
        <Box sx={{ display: "flex", gap: 2 }}>
          {!isPublishedTab && (
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
          )}
        </Box>
      </Box>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
          }}
        >
          <CircularProgress />
        </Box>
      ) : items.length === 0 ? (
        <Alert severity="info">
          No hay{" "}
          {currentFormType === FORM_TYPES.DEVELOPER
            ? "desarrolladoras"
            : currentFormType === FORM_TYPES.DEVELOPMENT
            ? "desarrollos"
            : "propiedades"}{" "}
          disponibles.
        </Alert>
      ) : (
        <>
          <Grid container spacing={3}>
            {items.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={getItemKey(item)}>
                <ItemCard
                  item={item}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onPublish={onPublish}
                  onUnpublish={onUnpublish}
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
                rowsPerPage={pagination.pageSize}
                rowsPerPageOptions={
                  ENTITY_PAGINATION_CONFIG.PROPERTIES.PAGE_SIZE_OPTIONS
                }
                onRowsPerPageChange={handleChangeRowsPerPage}
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
  onPublish: PropTypes.func,
  onUnpublish: PropTypes.func,
  currentTab: PropTypes.number.isRequired,
  allDevelopers: PropTypes.array,
  pagination: PropTypes.object,
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
};

export default EntityList;
