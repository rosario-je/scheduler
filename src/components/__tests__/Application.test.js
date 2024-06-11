import React from "react";
import axios from "axios";

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
    //console.log(prettyDOM(day));

  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {

    // 1 - Render the app
    const { container, debug } = render(<Application />);

    // 2 - Wait until 'Archie Cohen' is displayed
    await findByText(container, "Archie Cohen");

    // 3 - Click on the delete button
    const appointment = getAllByTestId(container, "appointment").find((appointment) =>
      queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(getByAltText(appointment, "Delete"));

    // 4 - Expect warning message to appear
    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument()

    // 5 - Click on confirm
    fireEvent.click(getByText(appointment, "Confirm"));

    // 6 - Wait for deleting text to show up
    await expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    // 7 - Check for the text to say '2 spot remaining' for monday
    const day = getAllByTestId(container, "day").find((day) => queryByText(day, "Monday"));
    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();

    //debug()
  });


  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    //1 - Render the app
    const { container, getByTestId } = render(<Application />)

    //2 - Wait until 'Archie Cohen' is displayed
    await findByText(container, "Archie Cohen");

    //3 - Click on the Edit button (alt)
    const appointment = getAllByTestId(container, 'appointment').find((appointment) => queryByText(appointment, 'Archie Cohen'));

    fireEvent.click(getByAltText(appointment, 'Edit'));

    //4 - Edit the name of the person
    fireEvent.change(getByTestId("student-name-input"), {
      target: { value: "Jose Eduardo" },
    });

    //5 - Choose another interviewer 
    fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'));

    //6 - Click on the save button
    fireEvent.click(getByText(appointment, "Save"));

    //7 - Expect the saving button
    expect(getByText(appointment, 'Saving')).toBeInTheDocument();

    //8 - Expect new appointment with new data
    await (findByText(appointment, 'Jose Eduardo'));

    //9 - Check for the text to say '1 spot remaining' for monday
    const day = getAllByTestId(container, "day").find((day) => queryByText(day, "Monday"));
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();

  });



  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();
    const { container } = render(<Application />);

    await findByText(container, "Archie Cohen");

    const appointments = getAllByTestId(container, "appointment")
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter Student Name/i), { target: { value: "Lydia Miller-Jones" } });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"))

    await findByText(appointment, "Could not book appointment.");
  });


  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce(new Error("Could not cancel appointment."));
    const { container } = render(<Application />);

    await findByText(container, "Archie Cohen");

    const appointment = getAllByTestId(container, "appointment").find((appointment) =>
      queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(getByAltText(appointment, "Delete"));

    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument()

    fireEvent.click(getByText(appointment, "Confirm"));

    await findByText(appointment, "Could not cancel appointment.");
  });
});

