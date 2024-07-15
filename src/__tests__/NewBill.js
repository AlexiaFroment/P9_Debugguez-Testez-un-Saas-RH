/**
 * @jest-environment jsdom
 */
import { localStorageMock } from "../__mocks__/localStorage.js"
import mockStore from "../__mocks__/store.js"

import { screen, waitFor, fireEvent } from "@testing-library/dom"
import "@testing-library/jest-dom"
import { expect, jest, test } from "@jest/globals"
import userEvent from "@testing-library/user-event"

import NewBillUI from "../views/NewBillUI.js"
import BillsUI from "../views/BillsUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes.js"
import router from "../app/Router.js"
import { create } from "../../../Billed-app-FR-Back/controllers/bill.js"

jest.mock("../app/store", () => mockStore)

describe("Given I am connected as an employee", () => {
  const mockNavigate = jest.fn()
  let newBillPage

  beforeEach(() => {
    document.body.innerHTML = NewBillUI()
    newBillPage = new NewBill({
      document,
      onNavigate: mockNavigate,
      store: mockStore,
      localStorage: window.localStorage,
    })
  })
  describe("When I am on NewBill page", () => {
    test("Then mail icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, "localStorage", { value: localStorageMock })
      window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)

      await waitFor(() => screen.getByTestId("icon-mail"))
      const mailIcon = screen.getByTestId("icon-mail")
      expect(mailIcon.getAttribute("class")).toContain("active-icon")
    })
  })
  describe("When I am on NewBill page, there is a form", () => {
    test("Should check if type of expense is correct", () => {
      // CHECK IS A DROPDOWN COMPONENT AND A VALUE IS SELECTED
      const typeOfExpense = screen.getByTestId("expense-type")
      expect(typeOfExpense).toBeDefined()
      expect(typeOfExpense).toBeInTheDocument()

      const options = typeOfExpense.children
      expect(options.length).toBeGreaterThan(0)

      fireEvent.change(typeOfExpense, {
        target: { value: "Restaurants et bars" },
      })
      expect(typeOfExpense.value).toBe("Restaurants et bars")
    })
    test("Should check if name of depense is correct", () => {
      // TEST SI UNE VALEUR EST ENTREE & SI C'EST UNE STRING EN SORTIE
      const nameOfExpense = screen.getByTestId("expense-name")
      expect(nameOfExpense).toBeDefined()
      expect(nameOfExpense).toBeInTheDocument()
      fireEvent.change(nameOfExpense, { target: { value: "restaurant" } })
      expect(nameOfExpense.value).toBeTruthy()
      expect(typeof nameOfExpense.value).toBe("string")
    })
    test("Should check if date is correct", () => {
      // TEST SI UNE VALEUR EST ENTREE & SI C'EST UNE DATE EN SORTIE
      const date = screen.getByTestId("datepicker")
      expect(date).toBeDefined()
      expect(date).toBeInTheDocument()
      fireEvent.change(date, { target: { value: "2022-01-01" } })
      expect(date.value).toBeTruthy()
      expect(typeof date.value).toBe("string")

      const parsedDate = Date.parse(date.value)
      expect(isNaN(parsedDate)).toBe(false)
    })
    test("Should check if amount is correct", () => {
      // TEST SI UNE VALEUR EST ENTREE & SI C'EST UN NUMBER EN SORTIE
      const amount = screen.getByTestId("amount")
      expect(amount).toBeDefined()
      expect(amount).toBeInTheDocument()
      fireEvent.change(amount, { target: { value: "100" } })
      const amountParsed = parseInt(amount.value, 10)

      expect(amount.value).toBeTruthy()
      expect(amountParsed).toBe(100)
      expect(typeof amountParsed).toBe("number")
    })
    test("Should check if TVA is correct", () => {
      // TEST SI UNE VALEUR EST ENTREE & SI C'EST UN NUMBER EN SORTIE
      const tva = screen.getByTestId("vat")
      expect(tva).toBeDefined()
      expect(tva).toBeInTheDocument()
      fireEvent.change(tva, { target: { value: "20" } })
      const tvaParsed = parseInt(tva.value, 10)

      expect(tva.value).toBeTruthy()
      expect(tvaParsed).toBe(20)
      expect(typeof tvaParsed).toBe("number")
    })
    test("Should check if comment is correct", () => {
      const comment = screen.getByTestId("commentary")
      expect(comment).toBeDefined()
      expect(comment).toBeInTheDocument()
    })
    test("Should check if Justificatif is correct", () => {
      // TEST SI UN FICHIER EST FOURNI & SI C'EST UN JPG, JPEG OU PNG
      const file = screen.getByTestId("file")

      const insertFile = new File(["test"], "test.png", { type: "image/png" })
      fireEvent.change(file, { target: { files: [insertFile] } })
      expect(file).toBeDefined()
      expect(file).toBeInTheDocument()
      expect(file).toBeTruthy()
      expect(file).toHaveAttribute("accept", ".jpg, .jpeg, .png")
      expect(file.files.length).toBe(1)
      expect(file.files[0].name).toBe("test.png")
      expect(file.files[0].type).toMatch(/image\/(jpeg|jpg|png)/)
    })
    // Tests fonctionnels
    test("should check if the handleSubmit function is called", () => {
      const formNewBill = screen.getByTestId("form-new-bill")
      expect(formNewBill).toBeInTheDocument()

      const handleSubmit = jest.fn(newBillPage.handleSubmit)
      formNewBill.addEventListener("submit", handleSubmit)
      fireEvent.submit(formNewBill)
      expect(handleSubmit).toHaveBeenCalled()
    })
    test("should check if the handleChangeFile function is called", () => {
      const inputFile = screen.getByTestId("file")
      expect(inputFile).toBeInTheDocument()

      const handleChangeFile = jest.fn(newBillPage.handleChangeFile)
      inputFile.addEventListener("change", handleChangeFile)
      fireEvent.change(inputFile)
      expect(handleChangeFile).toHaveBeenCalled()
    })
  })
})

//--------------------------------------------------- Test d'intégration POST --------------------------------------------------- //
describe("Given I am a user connected as Employee", () => {
  describe("When I create new Bill", () => {
    test("then send bill to mock API POST", async () => {
      localStorage.setItem(
        "user",
        JSON.stringify({ type: "Employee", email: "a@a" })
      )
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)
      jest.spyOn(mockStore, "bills")

      mockStore.bills.mockImplementationOnce(() => {
        // MOCK METHOD CREATE WICH RETURN A RESOLVE PROMISE
        return {
          create: () => {
            return Promise.resolve()
          },
        }
      })

      await new Promise(process.nextTick)

      document.body.innerHTML = BillsUI({})
      expect(screen.getByText("Mes notes de frais")).toBeTruthy()
    })

    test("A user POST a new bill with the handleSubmit method", async () => {
      const newbill = {
        id: "47qAXb6fIm2zOKkLzMro",
        vat: "80",
        fileUrl:
          "https://firebasestorage.googleapis.com/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
        status: "pending",
        type: "Hôtel et logement",
        commentary: "séminaire billed",
        name: "encore",
        fileName: "preview-facture-free-201801-pdf-1.jpg",
        date: "2004-04-04",
        amount: 400,
        commentAdmin: "ok",
        email: "a@a",
        pct: 20,
      }

      // Définir le mockStore avec la méthode update
      const mockStore = {
        bills: jest.fn(() => ({
          update: jest.fn().mockResolvedValue(newbill),
        })),
      }

      const postSpy = jest.spyOn(mockStore, "bills")
      const postBills = await mockStore.bills().update(newbill)
      expect(postSpy).toHaveBeenCalledTimes(1)
      expect(postBills).toStrictEqual(newbill)
    })

    describe("When an error occurs on API", () => {
      beforeEach(() => {
        localStorage.setItem(
          "user",
          JSON.stringify({ type: "Employee", email: "a@a" })
        )
        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.append(root)
        router()
        window.onNavigate(ROUTES_PATH.NewBill)
        jest.spyOn(mockStore, "bills")
      })

      test("send bill to an API and fails with 404 message error", async () => {
        mockStore.bills.mockImplementationOnce(() => {
          return {
            create: () => {
              return Promise.reject(new Error("Erreur 404"))
            },
          }
        })

        await new Promise(process.nextTick)

        document.body.innerHTML = BillsUI({ error: "Erreur 404" })
        const message = screen.getByTestId("error-message")
        expect(message.textContent).toContain("404")
      })

      test("send bill to an API and fails with 500 message error", async () => {
        mockStore.bills.mockImplementationOnce(() => {
          return {
            create: () => {
              return Promise.reject(new Error("Erreur 500"))
            },
          }
        })

        await new Promise(process.nextTick)

        document.body.innerHTML = BillsUI({ error: "Erreur 500" })
        const message = screen.getByTestId("error-message")
        expect(message.textContent).toContain("500")
      })
    })
  })
})
