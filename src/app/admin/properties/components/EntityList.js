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
import { FORM_TYPES, TAB_INDICES, TAB_FORM_TYPE_MAP } from "../constants";

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

  if (loading && items.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

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
        return null;
    }
  };

  const getItemTitle = (item) => {
    switch (currentTab) {
      case TAB_INDICES.DEVELOPER:
        return item.realEstateDevelopmentName;
      case TAB_INDICES.DEVELOPMENT:
        return item.developmentName;
      case TAB_INDICES.PROPERTY_NOT_PUBLISHED:
      case TAB_INDICES.PROPERTY_PUBLISHED:
      case TAB_INDICES.PROPERTY_MINKAASA_UNPUBLISHED:
      case TAB_INDICES.PROPERTY_MINKAASA_PUBLISHED:
        return item.propertyName;
      default:
        return "";
    }
  };

  const getItemSubtitle = (item) => {
    switch (currentTab) {
      case TAB_INDICES.DEVELOPER:
        return item.url || "Sin URL";
      case TAB_INDICES.DEVELOPMENT:
        const developer = allDevelopers.find(
          (dev) => dev.realEstateDevelopmentId === item.realEstateDevelopmentId
        );
        return developer
          ? developer.realEstateDevelopmentName
          : "Sin desarrolladora";
      case TAB_INDICES.PROPERTY_NOT_PUBLISHED:
      case TAB_INDICES.PROPERTY_PUBLISHED:
      case TAB_INDICES.PROPERTY_MINKAASA_UNPUBLISHED:
      case TAB_INDICES.PROPERTY_MINKAASA_PUBLISHED:
        return `${item.propertyType} - ${item.state}, ${item.city}`;
      default:
        return "";
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
              <Grid item xs={12} sm={6} md={4} key={getItemKey(item)}>
                <ItemCard
                  item={item}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onPublish={onPublish}
                  onUnpublish={onUnpublish}
                  currentTab={currentTab}
                  allDevelopers={allDevelopers}
                  onRefresh={onPageChange}
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
  onPublish: PropTypes.func,
  onUnpublish: PropTypes.func,
  currentTab: PropTypes.number.isRequired,
  allDevelopers: PropTypes.array,
  pagination: PropTypes.object,
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
};

export default EntityList;
