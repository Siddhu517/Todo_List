import axios from "axios";
const Url = "http://localhost:8000";

export const postData = async ({ todo }) => {
  try {
    return await axios.post(`${Url}/`, { todo });
  } catch (err) {
    console.log(err);
  }
};

export const getData = async () => {
  try {
    return await axios.get(`${Url}/`);
  } catch (err) {
    console.log(err);
  }
};

export const deleteData = async (id) => {
  try {
    return await axios.delete(`${Url}/${id}`);
  } catch (err) {
    console.log(err);
  }
};

export const checkDataPost = async (id, { check }) => {
  try {
    return await axios.put(`${Url}/${id}`, { check });
  } catch (err) {
    console.log(err);
  }
};
