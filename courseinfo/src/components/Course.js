import React from "react";

const Header = ({ name }) => {
  return <h2>{name}</h2>;
};

const Total = ({ parts }) => {
  const totalExcercises = parts.reduce(
    (previous, current) => previous + current.exercises,
    0
  );
  return <p>Number of exercises {totalExcercises}</p>;
};

const Part = ({ part }) => {
  return (
    <li>
      {part.name} {part.exercises}
    </li>
  );
};

const Content = ({ parts }) => {
  return (
    <ul>
      {parts.map((part) => (
        <Part key={part.id} part={part} />
      ))}
    </ul>
  );
};

const Course = ({ course }) => {
  return (
    <>
      <Header name={course.name} />
      <Content key={course.id} parts={course.parts} />
      <Total parts={course.parts} />
    </>
  );
};

export default Course;
