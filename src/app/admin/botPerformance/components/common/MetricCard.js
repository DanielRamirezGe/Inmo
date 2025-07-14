import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  useTheme,
} from "@mui/material";
import { TrendingUp, TrendingDown, Remove } from "@mui/icons-material";

const MetricCard = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  color = "primary",
  size = "medium",
}) => {
  const theme = useTheme();

  const getTrendIcon = () => {
    if (trend === "up") return <TrendingUp color="success" />;
    if (trend === "down") return <TrendingDown color="error" />;
    return <Remove color="disabled" />;
  };

  const getTrendColor = () => {
    if (trend === "up") return theme.palette.success.main;
    if (trend === "down") return theme.palette.error.main;
    return theme.palette.text.secondary;
  };

  const cardSizes = {
    small: {
      padding: 2,
      titleVariant: "body2",
      valueVariant: "h6",
      subtitleVariant: "caption",
    },
    medium: {
      padding: 3,
      titleVariant: "body1",
      valueVariant: "h5",
      subtitleVariant: "body2",
    },
    large: {
      padding: 4,
      titleVariant: "h6",
      valueVariant: "h4",
      subtitleVariant: "body1",
    },
  };

  const sizeConfig = cardSizes[size];

  return (
    <Card
      elevation={2}
      sx={{
        height: "100%",
        borderLeft: `4px solid ${theme.palette[color].main}`,
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: theme.shadows[8],
        },
      }}
    >
      <CardContent sx={{ p: sizeConfig.padding }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1,
          }}
        >
          <Typography
            variant={sizeConfig.titleVariant}
            color="text.secondary"
            gutterBottom
          >
            {title}
          </Typography>
          {icon && (
            <Box
              sx={{
                color: theme.palette[color].main,
                display: "flex",
                alignItems: "center",
              }}
            >
              {icon}
            </Box>
          )}
        </Box>

        <Typography
          variant={sizeConfig.valueVariant}
          component="div"
          sx={{
            fontWeight: "bold",
            color: theme.palette[color].main,
            mb: 1,
          }}
        >
          {value}
        </Typography>

        {subtitle && (
          <Typography
            variant={sizeConfig.subtitleVariant}
            color="text.secondary"
            sx={{ mb: 1 }}
          >
            {subtitle}
          </Typography>
        )}

        {trend && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {getTrendIcon()}
            <Chip
              label={`${trendValue}%`}
              size="small"
              sx={{
                backgroundColor: getTrendColor(),
                color: "white",
                fontSize: "0.75rem",
              }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
