export default async function handler(req, res) {
  if (req.method === "POST") {
    const { nombre, email, mensaje } = req.body;

    // // Configura tu conexión a la base de datos
    // const connection = await mysql.createConnection({
    //   host: "localhost",
    //   user: "tu_usuario",
    //   password: "tu_contraseña",
    //   database: "tu_base_de_datos",
    // });

    try {
      // Inserta los datos en la base de datos
      //   const [result] = await connection.execute(
      //     "INSERT INTO contactos (nombre, email, mensaje) VALUES (?, ?, ?)",
      //     [nombre, email, mensaje]
      //   );
      console.log("nombre", nombre);
      console.log("email", email);
      console.log("mensaje", mensaje);

      res.status(200).json({ message: "Contacto guardado exitosamente" });
    } catch (error) {
      res.status(500).json({ message: "Error al guardar el contacto", error });
    }
    // finally {
    //   // await connection.end();
    // }
  } else {
    res.status(405).json({ message: "Método no permitido" });
  }
}
