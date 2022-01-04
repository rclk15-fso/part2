import axios from "axios";
const baseUrl = "http://localhost:3001/persons";

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = (newPerson) => {
  const request = axios.post(baseUrl, newPerson);
  const responseData = request.then((response) => {
    console.log(response.data);
    return response.data;
  });
  return responseData;
  // remember to return!
  // otherwise create() doesn't return anything.
};

// const update = (id, newObject) => {
//   return axios.put(`${baseUrl}/${id}`, newObject);
// };

const deletePerson = async (id) => {
  console.log(id);
  await axios
    .delete(`${baseUrl}/${id}`)
    .then((response) => {
      console.log(response.data);
      return id;
    })
    .catch((error) => {
      console.log(error);
      // error alert is propagated back to App.js
      //   alert("Error! This person has already been deleted.");
      console.log(error);
      //   return Promise.reject(new Error('failed'))
      throw new Error("This person has already been deleted.");
      // both Promise.reject and throw works.
    });
};

const updatePerson = (id, updatedPerson) => {
  const request = axios.put(`${baseUrl}/${id}`, updatedPerson);
  const responseData = request.then((response) => {
    console.log(response.data);
    return response.data;
  });
  return responseData;
  // remember to return!
  // otherwise updatePerson() doesn't return anything.
};

export { create, getAll, deletePerson, updatePerson };
