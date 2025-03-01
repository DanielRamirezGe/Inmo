import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import styles from "./../page.module.css";

export default function Footer() {
  return (
    <>
      <footer className={styles.footer}>
        <Box sx={{ width: { xs: "100%", sm: "80%" }, margin: "auto" }}>
          <Typography
            sx={{
              marginTop: { xs: "10px" },
              marginBottom: "10px",
              fontSize: "0.8rem",
            }}
          >
            Usar este sitio implica que aceptas nuestras Políticas y Términos,
            Aviso de privacidad y Política de datos. Prohibida su reproducción
            total o parcial, así como su traducción a cualquier idioma sin
            autorización escrita de su titular.
          </Typography>
        </Box>
      </footer>
    </>
  );
}
