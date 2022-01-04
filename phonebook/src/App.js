import React, { useState, useEffect } from "react";
import {
  create,
  getAll,
  deletePerson,
  updatePerson,
} from "./services/communication";

import Persons from "./components/Persons";
import PersonForm from "./components/PersonForm";
import Filter from "./components/Filter";

const App = () => {
  const refreshPersonsList = () =>
    getAll().then((response) => setPersons(response));
  // error: setPersons(getAll()); promise not resolved!

  useEffect(refreshPersonsList, []);

  const [persons, setPersons] = useState([]);
  // has to be empty Array, not blank, due to map() below
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchedName, setSearchedName] = useState("");

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchedName(event.target.value);
  };
  const submitNewName = (event) => {
    console.log("submitted");
    console.log(persons);
    event.preventDefault();
    let idToUpdate = null;
    const duplicateIndexFunction = (personObject) => {
      if (personObject.name === newName) {
        idToUpdate = personObject.id;
        return true;
      }
      return false;
    };

    if (persons.findIndex(duplicateIndexFunction) !== -1) {
      const replaceMessage = `
      ${newName} has already been added to the phonebook! 
      Replace the old number with the new one?`;

      if (window.confirm(replaceMessage)) {
        console.log("confirmed, replace id:", idToUpdate);
        const updatedPerson = {
          name: newName,
          number: newNumber,
          id: idToUpdate,
        };
        updatePerson(idToUpdate, updatedPerson).then((response) => {
          console.log(response);
          setPersons(
            persons.map((person) => {
              if (person.id === idToUpdate) {
                return updatedPerson;
              }
              return person;
            })
          );
        });
      }
    } else {
      const newPerson = {
        name: newName,
        number: newNumber,
        // id: persons.length + 1, // this is bug. let server decide id instead.
      };
      // need to retrieve the response from server, to know id server set
      // server returns object with created person
      create(newPerson).then((response) =>
        setPersons(persons.concat(response))
      );
      // console.log(persons);
    }
    setNewName("");
    setNewNumber("");
  };

  const personsToDisplay = () => {
    if (searchedName.length === 0) {
      console.log(persons, typeof persons);
      return persons;
    } else {
      const filteredNames = persons.filter((person) =>
        person.name.includes(searchedName)
      );
      console.log(filteredNames);
      return filteredNames;
    }
  };

  const handleDeletePerson = async (id) => {
    // update database
    console.log(`App ${id}`);
    try {
      let result = await deletePerson(id);
      console.log(result);
    } catch (error) {
      console.log(error);
      alert(error);
      refreshPersonsList();
    }

    //  update local state
    const updatedPersonsList = persons.filter((person) => person.id !== id);
    setPersons(updatedPersonsList);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter {...{ searchedName, handleSearchChange }} />

      <h3>Add a new number</h3>
      {/* Tidiness: Creating an object so we can then spread it as props */}
      <PersonForm
        {...{
          submitNewName,
          newName,
          handleNameChange,
          newNumber,
          handleNumberChange,
        }}
      />

      <h3>Numbers</h3>
      <Persons
        persons={personsToDisplay()}
        handleDeletePerson={handleDeletePerson}
      />
      {/* button simulates trying to delete an already deleted person. */}
      {/* <button onClick={() => handleDeletePerson(100)}>Error test</button> */}
    </div>
  );
};

export default App;
