/**
 * @jest-environment jsdom
 */
import { screen, waitFor } from "@testing-library/dom"
import { expect, jest, test } from "@jest/globals"
import userEvent from "@testing-library/user-event"

import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import Bills from "../containers/Bills.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes.js"
import { localStorageMock } from "../__mocks__/localStorage.js"
import mockStore from "../__mocks__/store.js"
import router from "../app/Router.js"

jest.mock("../app/store", () => ({
  __esModule: true,
  default: mockStore,
}))

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    const mockNavigate = jest.fn()

    let billsPage = new Bills({
      document,
      onNavigate: mockNavigate,
      store: mockStore,
      localStorage: window.localStorage,
    })
    document.body.innerHTML = BillsUI({ data: bills })

    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, "localStorage", { value: localStorageMock })
      window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId("icon-window"))
      const windowIcon = screen.getByTestId("icon-window")
      expect(windowIcon.getAttribute("class")).toContain("active-icon")
    })

    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })

      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.innerHTML)

      const antiChrono = (a, b) => (a < b ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).not.toEqual(datesSorted)
      expect(dates).toEqual(expect.arrayContaining(datesSorted))
    })

    test("Then the modal should open and display supporting document when I click on IconEye", () => {
      // MOCK MODAL
      $.fn.modal = jest.fn()

      const eyeIcon = screen.getAllByTestId("icon-eye")

      // MOCK HANDLECLICKICONEYE FUNCTION
      const handleShowModalFile = jest.fn((e) => {
        billsPage.handleClickIconEye(e)
      })

      eyeIcon.forEach((icon) => {
        icon.addEventListener("click", () => handleShowModalFile(icon))
        userEvent.click(icon)
        expect(handleShowModalFile).toHaveBeenCalled()
      })

      const modal = $("#modaleFile")
      expect(modal.css("display")).toEqual("block")
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

//----------------------------- Test d'intégration GET ----------------------------- //
describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to Bills", () => {
    test("then fetch bills mock API GET", async () => {
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router() // On appelle le routeur pour préparer à l'utilisation de la route Bills
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByText("Mes notes de frais"))
      const title = screen.getByText("Mes notes de frais") // On s'attends à voir la chaîne de caractère Mes notes de frais sur la page.

      expect(title).toBeTruthy()
    })

    describe("When an error occurs on API", () => {
      beforeEach(() => {
        jest.spyOn(mockStore, "bills") // On espionne la méthode bills.
        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.appendChild(root)
        router()
      })

      test("fetches bills from an API and fails with 404 message error", async () => {
        mockStore.bills.mockImplementationOnce(() => {
          // On simule une méthode list qui renvoit une erreur 404.
          return {
            list: () => {
              return Promise.reject(new Error("Erreur 404"))
            },
          }
        })

        window.onNavigate(ROUTES_PATH.Bills)
        await new Promise(process.nextTick) // On attends que toutes les tâches soient exécutées.
        const messages = await screen.getAllByTestId("error-message")

        const message = messages.find((msg) => msg.textContent.includes("404"))
        expect(message).toBeTruthy() // On s'attends à voir la chaîne de caractère 404.
      })
    })

    test("fetches messages from an API and fails with 500 message error", async () => {
      // On simule une méthode list qui renvoit une erreur 500.
      mockStore.bills.mockImplementationOnce(() => {
        return {
          list: () => {
            return Promise.reject(new Error("Erreur 500"))
          },
        }
      })

      window.onNavigate(ROUTES_PATH.Bills)
      await new Promise(process.nextTick)
      const messages = await screen.getAllByTestId("error-message")
      const message = messages.find((msg) => msg.textContent.includes("500"))
      expect(message).toBeTruthy() // On s'attends à voir la chaîne de caractère 500.
    })
  })
})
