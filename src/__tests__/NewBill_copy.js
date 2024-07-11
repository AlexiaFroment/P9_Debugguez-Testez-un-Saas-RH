/**
 * @jest-environment jsdom
 */

import { screen, waitFor, fireEvent } from "@testing-library/dom"
import { expect, jest, test } from '@jest/globals';
import userEvent from "@testing-library/user-event";

import NewBillUI from "../views/NewBillUI.js";
import BillsUI from "../views/BillsUI.js";
import NewBill from "../containers/NewBill.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store.js";
import router from "../app/Router.js";

jest.mock("../app/store", () => mockStore);


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    const mockNavigate = jest.fn()

    let newBillPage = new NewBill({ document, onNavigate: mockNavigate, store: mockStore, localStorage: window.localStorage });
    beforeEach(() => {
     document.body.innerHTML = NewBillUI();
    })

    // test("Then mail icon in vertical layout should be highlighted", async () => {   
    //   Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    //   window.localStorage.setItem('user', JSON.stringify({type: 'Employee'}))
    //   const root = document.createElement("div")
    //   root.setAttribute("id", "root")
    //   document.body.append(root)

    //   console.log('⚡⚡⚡Avant la navigation', document.body.innerHTML)
    //   router()
    //   window.onNavigate(ROUTES_PATH.NewBill);
    //   console.log('🌞🌞🌞Après la navigation', document.body.innerHTML)

    //   await waitFor(() => screen.getByTestId("icon-mail"));
    //   const mailIcon = screen.getByTestId("icon-mail");
    //   const mailIconIsActive = mailIcon.classList.contains("active-icon");
    //   expect(mailIconIsActive).toBeTruthy();
    //   // expect(mailIcon.getAttribute("class")).toContain("active-icon");
    // });
  })
})











// describe("Given I am connected as an employee", () => {
//   describe("When I am on NewBill Page", () => {
//     beforeEach(() => {
//       document.body.innerHTML = NewBillUI()
//     })

    // test("Should check if type of expense is correct", () => {
    //   // CHECK IS A DROPDOWN COMPONENT AND A VALUE IS SELECTED
    //   const typeOfExpense = screen.getByTestId("expense-type")
    //   expect(typeOfExpense).toBeInTheDocument()

    //   const options = typeOfExpense.children
    //   expect(options.length).toBeGreaterThan(0)

    //   fireEvent.change(typeOfExpense, {
    //     target: { value: "Restaurants et bars" },
    //   })
    //   expect(typeOfExpense.value).toBe("Restaurants et bars")
    // })

  //   test("Should check if name of depense is correct", () => {
  //     // TEST SI UNE VALEUR EST ENTREE & SI C'EST UNE STRING EN SORTIE
  //     const nameOfExpense = screen.getByTestId("expense-name")
  //     expect(nameOfExpense).toBeInTheDocument()
  //     fireEvent.change(nameOfExpense, { target: { value: "restaurant" } })
  //     expect(nameOfExpense.value).toBeTruthy()
  //     expect(typeof nameOfExpense.value).toBe("string")
  //   })

  //   test("Should check if date is correct", () => {
  //     // TEST SI UNE VALEUR EST ENTREE & SI C'EST UNE DATE EN SORTIE
  //     const date = screen.getByTestId("datepicker")
  //     expect(date).toBeInTheDocument()
  //     fireEvent.change(date, { target: { value: "2022-01-01" } })
  //     expect(date.value).toBeTruthy()
  //     expect(typeof date.value).toBe("string")

  //     const parsedDate = Date.parse(date.value)
  //     expect(isNaN(parsedDate)).toBe(false)
  //   })

  //   test("Should check if amount is correct", () => {
  //     // TEST SI UNE VALEUR EST ENTREE & SI C'EST UN NUMBER EN SORTIE
  //     const amount = screen.getByTestId("amount")
  //     expect(amount).toBeInTheDocument()
  //     fireEvent.change(amount, { target: { value: "100" } })
  //     const amountParsed = parseInt(amount.value, 10)

  //     expect(amount.value).toBeTruthy()
  //     expect(amountParsed).toBe(100)
  //     expect(typeof amountParsed).toBe("number")
  //   })

  //   test("Should check if TVA is correct", () => {
  //     // TEST SI UNE VALEUR EST ENTREE & SI C'EST UN NUMBER EN SORTIE
  //     const tva = screen.getByTestId("vat")
  //     expect(tva).toBeInTheDocument()
  //     fireEvent.change(tva, { target: { value: "20" } })
  //     const tvaParsed = parseInt(tva.value, 10)

  //     expect(tva.value).toBeTruthy()
  //     expect(tvaParsed).toBe(20)
  //     expect(typeof tvaParsed).toBe("number")
  //   })

  //   test("Should check if comment is correct", () => {
  //     const comment = screen.getByTestId("commentary")
  //     expect(comment).toBeInTheDocument()
  //   })

  //   test("Should check if Justificatif is correct", () => {
  //     // TEST SI UN FICHIER EST FOURNI & SI C'EST UN JPG, JPEG OU PNG
  //     const file = screen.getByTestId("file")

  //     const insertFile = new File(["test"], "test.png", { type: "image/png" })
  //     fireEvent.change(file, { target: { files: [insertFile] } })
  //     expect(file).toBeInTheDocument()
  //     expect(file).toBeTruthy()
  //     expect(file).toHaveAttribute("accept", ".jpg, .jpeg, .png")
  //     expect(file.files.length).toBe(1)
  //     expect(file.files[0].name).toBe("test.png")
  //     expect(file.files[0].type).toMatch(/image\/(jpeg|jpg|png)/)
  //   })
  // })
// })

// describe("Given I am connected as an employee", () => {
//   describe("When I am on NewBill Page", () => {
//     beforeEach(() => {
//       Object.defineProperty(window, "localStorage", { value: localStorageMock })
//       window.localStorage.setItem(
//         "user",
//         JSON.stringify({
//           type: "Employee",
//         })
//       )
//       document.body.innerHTML = NewBillUI()
//     })

//     test.skip("Then bill icon in vertical layout should be highlighted", async () => {
//       await waitFor(() => screen.getByTestId("icon-mail"))
//       expect(mailIcon).toBeInTheDocument()
//       const mailIconIsActive = mailIcon.classList.contains("active-icon")
//       expect(mailIconIsActive).toBeTruthy()
//     })

//     test("should function handleSubmit is called", () => {
//       const sendBtn = screen.getByText("Envoyer")
//       expect(sendBtn).toBeInTheDocument()

//       const handleSubmit = jest.fn((e) => {
//         e.preventDefault()
//         NewBill.handleSubmit(e)
//       })

//       sendBtn.addEventListener("click", handleSubmit)
//       userEvent.click(sendBtn)
//       expect(handleSubmit).toHaveBeenCalled()
//     })
//     test("Should navigate to Bill page when submit button is clicked", () => {})
//   })
//  })
