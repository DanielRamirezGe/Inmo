import house from "../../../data/houseData";

export default function handler(req, res) {
  const { houseId } = req.query;
  //   const house = houses.find((h) => h.id === parseInt(houseId));
  house.forEach((inmobiliaria) => {
    inmobiliaria.development.forEach((development) => {
      development.prototype.forEach((prototype) => {
        if (prototype.id == houseId) {
          let houseResponse;
          houseResponse = prototype;
          houseResponse.estado = development.estado;
          houseResponse.municipio = development.municipio;
          houseResponse.developmentName = development.developmentName;
          houseResponse.calle = development.calle;
          houseResponse.codigoPostal = development.codigoPostal;
          houseResponse.nombreInmobiliaria = inmobiliaria.nombreInmobiliaria;
          res.status(200).json(houseResponse);
          return;
        }
      });
    });
  });

  res.status(404).json({ message: "House not found" });
  //   }
}
