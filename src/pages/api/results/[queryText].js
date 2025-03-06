import house from "../../../data/houseData";

export default function handler(req, res) {
  const { queryText } = req.query;
  const lowerCaseQuery = queryText.toLowerCase();
  let results = [];
  house.forEach((inmobiliaria) => {
    let isResultImo = false;
    if (inmobiliaria.nombreInmobiliaria.toLowerCase().includes(lowerCaseQuery))
      isResultImo = true;
    inmobiliaria.development.forEach((development) => {
      let isResult = false;
      if (
        development.developmentName.toLowerCase().includes(lowerCaseQuery) ||
        development.municipio.toLowerCase().includes(lowerCaseQuery) ||
        development.estado.toLowerCase().includes(lowerCaseQuery) ||
        development.calle.toLowerCase().includes(lowerCaseQuery) ||
        development.codigoPostal.toLowerCase().includes(lowerCaseQuery)
      )
        isResult = true;

      development.prototype.forEach((prototype) => {
        if (
          isResultImo ||
          isResult ||
          prototype.nombrePrototipo.toLowerCase().includes(lowerCaseQuery)
        )
          results = [...results, prototype];
      });
    });
  });

  res.status(200).json(results);
}
