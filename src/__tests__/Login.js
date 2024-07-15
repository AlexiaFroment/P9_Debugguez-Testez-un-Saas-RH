/**
 * @jest-environment jsdom
 */
import { localStorageMock } from "../__mocks__/localStorage.js"
import mockStore from "../__mocks__/store.js"

import { expect, jest, test } from "@jest/globals"
import LoginUI from "../views/LoginUI"
import Login from "../containers/Login.js"
import Bills from "../containers/Bills.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes"
import { fireEvent, screen } from "@testing-library/dom"

import DashboardUI from "../views/DashboardUI.js"
import router from "../app/Router.js"

jest.mock("../app/store", () => ({
  __esModule: true,
  default: mockStore,
}))

// EMPLOYEE
describe("Given that I am a user on login page", () => {
  describe("When I do not fill fields and I click on employee button Login In", () => {
    beforeEach(() => {
      document.body.innerHTML = LoginUI()
    })
    test("Then It should renders Login page", () => {
      const inputEmailUser = screen.getByTestId("employee-email-input")
      expect(inputEmailUser.value).toBe("")

      const inputPasswordUser = screen.getByTestId("employee-password-input")
      expect(inputPasswordUser.value).toBe("")

      const form = screen.getByTestId("form-employee")
      const handleSubmit = jest.fn((e) => e.preventDefault())

      form.addEventListener("submit", handleSubmit)
      fireEvent.submit(form)
      expect(screen.getByTestId("form-employee")).toBeTruthy()
    })
  })

  describe("When I do fill fields in incorrect format and I click on employee button Login In", () => {
    test("Then It should renders Login page", () => {
      // document.body.innerHTML = LoginUI()

      const inputEmailUser = screen.getByTestId("employee-email-input")
      fireEvent.change(inputEmailUser, { target: { value: "pasunemail" } })
      expect(inputEmailUser.value).toBe("pasunemail")

      const inputPasswordUser = screen.getByTestId("employee-password-input")
      fireEvent.change(inputPasswordUser, { target: { value: "azerty" } })
      expect(inputPasswordUser.value).toBe("azerty")

      const form = screen.getByTestId("form-employee")
      const handleSubmit = jest.fn((e) => e.preventDefault())

      form.addEventListener("submit", handleSubmit)
      fireEvent.submit(form)
      expect(screen.getByTestId("form-employee")).toBeTruthy()
    })
  })

  describe("When I do fill fields in correct format and I click on employee button Login In", () => {
    test("Then I should be identified as an Employee in app", () => {
      // document.body.innerHTML = LoginUI()
      const inputData = {
        email: "johndoe@email.com",
        password: "azerty",
      }

      const inputEmailUser = screen.getByTestId("employee-email-input")
      fireEvent.change(inputEmailUser, { target: { value: inputData.email } })
      expect(inputEmailUser.value).toBe(inputData.email)

      const inputPasswordUser = screen.getByTestId("employee-password-input")
      fireEvent.change(inputPasswordUser, {
        target: { value: inputData.password },
      })
      expect(inputPasswordUser.value).toBe(inputData.password)

      const form = screen.getByTestId("form-employee")

      // localStorage should be populated with form data
      Object.defineProperty(window, "localStorage", {
        value: {
          getItem: jest.fn(() => null),
          setItem: jest.fn(() => null),
        },
        writable: true,
      })

      // we have to mock navigation to test it
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      let PREVIOUS_LOCATION = ""

      const store = jest.fn()

      const login = new Login({
        document,
        localStorage: window.localStorage,
        onNavigate,
        PREVIOUS_LOCATION,
        store,
      })

      const handleSubmit = jest.fn(login.handleSubmitEmployee)
      login.login = jest.fn().mockResolvedValue({})
      form.addEventListener("submit", handleSubmit)
      fireEvent.submit(form)
      expect(handleSubmit).toHaveBeenCalled()
      expect(window.localStorage.setItem).toHaveBeenCalled()
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        "user",
        JSON.stringify({
          type: "Employee",
          email: inputData.email,
          password: inputData.password,
          status: "connected",
        })
      )
    })

    test("It should renders Bills page", () => {
      expect(screen.getAllByText("Mes notes de frais")).toBeTruthy()
    })
  })
})

// ADMIN
describe("Given that I am a user on login page", () => {
  describe("When I do not fill fields and I click on admin button Login In", () => {
    test("Then It should renders Login page", () => {
      document.body.innerHTML = LoginUI()

      const inputEmailUser = screen.getByTestId("admin-email-input")
      expect(inputEmailUser.value).toBe("")

      const inputPasswordUser = screen.getByTestId("admin-password-input")
      expect(inputPasswordUser.value).toBe("")

      const form = screen.getByTestId("form-admin")
      const handleSubmit = jest.fn((e) => e.preventDefault())

      form.addEventListener("submit", handleSubmit)
      fireEvent.submit(form)
      expect(screen.getByTestId("form-admin")).toBeTruthy()
    })
  })

  describe("When I do fill fields in incorrect format and I click on admin button Login In", () => {
    test("Then it should renders Login page", () => {
      document.body.innerHTML = LoginUI()

      const inputEmailUser = screen.getByTestId("admin-email-input")
      fireEvent.change(inputEmailUser, { target: { value: "pasunemail" } })
      expect(inputEmailUser.value).toBe("pasunemail")

      const inputPasswordUser = screen.getByTestId("admin-password-input")
      fireEvent.change(inputPasswordUser, { target: { value: "azerty" } })
      expect(inputPasswordUser.value).toBe("azerty")

      const form = screen.getByTestId("form-admin")
      const handleSubmit = jest.fn((e) => e.preventDefault())

      form.addEventListener("submit", handleSubmit)
      fireEvent.submit(form)
      expect(screen.getByTestId("form-admin")).toBeTruthy()
    })
  })

  describe("When I do fill fields in correct format and I click on admin button Login In", () => {
    test("Then I should be identified as an HR admin in app", () => {
      document.body.innerHTML = LoginUI()
      const inputData = {
        type: "Admin",
        email: "johndoe@email.com",
        password: "azerty",
        status: "connected",
      }

      const inputEmailUser = screen.getByTestId("admin-email-input")
      fireEvent.change(inputEmailUser, { target: { value: inputData.email } })
      expect(inputEmailUser.value).toBe(inputData.email)

      const inputPasswordUser = screen.getByTestId("admin-password-input")
      fireEvent.change(inputPasswordUser, {
        target: { value: inputData.password },
      })
      expect(inputPasswordUser.value).toBe(inputData.password)

      const form = screen.getByTestId("form-admin")

      // localStorage should be populated with form data
      Object.defineProperty(window, "localStorage", {
        value: {
          getItem: jest.fn(() => null),
          setItem: jest.fn(() => null),
        },
        writable: true,
      })

      // we have to mock navigation to test it
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      let PREVIOUS_LOCATION = ""

      const store = jest.fn()

      const login = new Login({
        document,
        localStorage: window.localStorage,
        onNavigate,
        PREVIOUS_LOCATION,
        store,
      })

      const handleSubmit = jest.fn(login.handleSubmitAdmin)
      login.login = jest.fn().mockResolvedValue({})
      form.addEventListener("submit", handleSubmit)
      fireEvent.submit(form)
      expect(handleSubmit).toHaveBeenCalled()
      expect(window.localStorage.setItem).toHaveBeenCalled()
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        "user",
        JSON.stringify({
          type: "Admin",
          email: inputData.email,
          password: inputData.password,
          status: "connected",
        })
      )
    })

    test("It should renders HR dashboard page", () => {
      expect(screen.queryByText("Validations")).toBeTruthy()
    })
  })
})

// --------------------------------------------------------------------------------TEST D'INTEGATION-------------------------------------------------------------------------------- //
describe("integration login", () => {
  beforeEach(() => {
    // Réinitialiser localStorage avant chaque test
    Object.defineProperty(window, "localStorage", { value: localStorageMock })
    window.localStorage.clear()

    // Mock des méthodes localStorage
    jest.spyOn(window.localStorage, "getItem")
    jest.spyOn(window.localStorage, "setItem")
    jest.spyOn(window.localStorage, "clear")
    jest.spyOn(window.localStorage, "removeItem")

    document.body.innerHTML = LoginUI()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
  test("should be able to acces Bills page after login", async () => {
    // Simuler les données utilisateur
    const inputData = { email: "johndoe@email.com", password: "azerty" }

    // Mock de la méthode de connexion pour simuler une réponse réussie
    const loginMock = jest.fn().mockResolvedValue({
      jwt: "fake-jwt-token",
    })

    const store = {
      login: loginMock,
      bills: jest.fn().mockReturnValue({
        list: jest
          .fn()
          .mockResolvedValue([
            { id: 1, date: "2024-07-01", status: "pending" },
          ]),
      }),
    }

    const login = new Login({
      document,
      localStorage: window.localStorage,
      onNavigate: (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      },
      store,
    })

    // Sélectionner le formulaire et ajouter un event listener
    const formEmployee = screen.getByTestId("form-employee")
    formEmployee.addEventListener("submit", login.handleSubmitEmployee)

    // Simuler la soumission du formulaire
    await login.login(inputData)

    // Vérifier que le token est stocké
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      "jwt",
      "fake-jwt-token"
    )

    // Naviguer vers la page des notes de frais
    const billsPage = new Bills({
      document,
      store,
      localStorage: window.localStorage,
      onNavigate: (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      },
    })

    // Appeler getBills et vérifier les données
    const bills = await billsPage.getBills()
    expect(bills).toBeTruthy()
    expect(bills.length).toBeGreaterThan(0)
  })
})
