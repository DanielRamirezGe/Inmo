import houseDetails from "../../data/houseData";
export default function handler(req, res) {
  res.status(200).json(houseDetails);
}
