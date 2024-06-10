import React from "react";

import {
  render,
  cleanup,
  fireEvent,
  getByText,
  prettyDOM,
  getByAltText,
  getAllByTestId,
  findByText,
  getByPlaceholderText,
  waitForElementToBeRemoved,
  queryByText
} from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {

  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { queryByText, findByText } = render(<Application />);

    return findByText("Monday").then(() => {
      fireEvent.click(queryByText("Tuesday"));
      expect(queryByText("Leopold Silvers")).toBeInTheDocument();
    })
  });


  it('loads data, books an interview and reduces the spots remaining for the first day by 1', async () => {
    const { container } = render(<Application />);

    // Find the container that holds the appointment with the name "Archie Cohen"
    await findByText(container, "Archie Cohen");


    const appointments = getAllByTestId(container, "appointment");// Create an array of appointments
    const appointment = appointments[0]; // Get the first appointment

    // Click on the 'Add' button in the appointment
    fireEvent.click(getByAltText(appointment, "Add"));

    // Type a new value in the input field by selecting it through the placeholder text and changing the value
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" },
    });

    // Click on an interviewer within the appointment container
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    // Save the appointment
    fireEvent.click(getByText(appointment, "Save"));

    // Expect the "Saving" text to be in the document after clicking on 'Save'
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    // Wait for the "Lydia Miller-Jones" element to in the appointment before continuing the test
    await findByText(appointment, "Lydia Miller-Jones");

    
    const day = getAllByTestId(container, "day").find((day) => queryByText(day, "Monday"));

    expect(getByText(day, "no spots remaining")).toBeInTheDocument();


    console.log(prettyDOM(day));

  });


});

