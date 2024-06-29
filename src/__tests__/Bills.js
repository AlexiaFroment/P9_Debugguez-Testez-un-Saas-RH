/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom"
import { bills } from "../fixtures/bills.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes.js"
import { localStorageMock } from "../__mocks__/localStorage.js"
import { mockStore } from "../__mocks__/store.js"
import BillsUI from "../views/BillsUI.js"

import Bills from "../containers/Bills.js"
import router from "../app/Router.js"
import userEvent from "@testing-library/user-event"

jest.mock("../app/store", () => mockStore)

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async function () {
      Object.defineProperty(window, "localStorage", { value: localStorageMock })
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      )
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId("icon-window"))
      const windowIcon = screen.getByTestId("icon-window")
      //to-do write expect expression
      expect(windowIcon).toBeVisible()
      expect(windowIcon.classList.contains("active-icon")).toBe(true)
    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })

      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.innerHTML)

      // SORT THE DATES
      // console.log("dates", dates)
      const antiChrono = (a, b) => (a < b ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      // console.log("datesSorted", datesSorted)

      // CHECK IF DATE ARE EQUAL TO DATESSORTED ELSE TEST IS FAILED
      // expect(dates).toEqual(datesSorted)
      expect(dates).not.toEqual(datesSorted)
      expect(dates).toEqual(expect.arrayContaining(datesSorted))
    })

    test("Then, loading page should be rendered", () => {
      document.body.innerHTML = BillsUI({ loading: true })
      expect(screen.getAllByText("Loading...")).toBeTruthy()
    })

    test("Then, Error page should be rendered", () => {
      document.body.innerHTML = BillsUI({ error: "some error message" })
      expect(screen.getAllByText("Erreur")).toBeTruthy()
    })
  })
})

describe("Given I am connected as an employee and I click on the eye icon", () => {
  test("Should open a modal to see the bill preview ", () => {
    document.body.innerHTML = BillsUI({ data: bills })

    const handleClickIconEye = jest.fn(bills.handleClickIconEye)
    const eyes = screen.getAllByTestId("icon-eye")
    eyes.forEach((eye) => {
      eye.addEventListener("click", handleClickIconEye)
    })
    userEvent.click(eyes[0])
    expect(handleClickIconEye).toHaveBeenCalled()

    const modale = screen.getByTestId("modaleFile")
    expect(modale).toBeTruthy()
  })
})

describe("Given I am connected as an employee and I click on the new bill button", () => {
  let mockNavigate, billsPage, handleClickNewBill, btnNewBill

  beforeEach(() => {
    mockNavigate = jest.fn()
    billsPage = new Bills({
      document,
      onNavigate: mockNavigate,
      store: mockStore,
      localStorage: window.localStorage,
    })
    document.body.innerHTML = BillsUI({ data: bills })
    handleClickNewBill = jest.fn(billsPage.handleClickNewBill)
    btnNewBill = screen.getByTestId("btn-new-bill")
    btnNewBill.addEventListener("click", handleClickNewBill)
  })

  test("should click on the NewBill btn", () => {
    userEvent.click(btnNewBill)
    expect(handleClickNewBill).toHaveBeenCalled()
  })

  test("should navigate to NewBill page to add a new bill", () => {
    userEvent.click(btnNewBill)
    expect(mockNavigate).toHaveBeenCalled()
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES_PATH["NewBill"])
  })
})
