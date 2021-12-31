import axios from "axios";
import { NOTEURL } from "../constants/constant";

const getNotes = async () => {
  try {
    const notes = await axios.get(NOTEURL);
    return notes;
  } catch (error) {
    console.log(error);
  }
};

export default getNotes;
