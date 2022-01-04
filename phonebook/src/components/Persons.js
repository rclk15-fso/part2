import Person from "./Person";

const Persons = ({ persons, handleDeletePerson }) => {
  console.log(persons, typeof persons);
  return persons.map((person) => (
    <Person
      key={person.id}
      person={person}
      handleDeletePerson={handleDeletePerson}
    />
  ));
};

export default Persons;
