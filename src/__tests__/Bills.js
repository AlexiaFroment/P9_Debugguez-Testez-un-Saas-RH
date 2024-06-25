/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom";
import { bills } from "../fixtures/bills.js";
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import BillsUI from "../views/BillsUI.js";

import Actions from "./Actions.js";
import Bills from "../containers/Bills.js";
import router from "../app/Router.js";

// jest.mock("../app/store", () => mockStore);

// TESTS BILLUI WHEN I AM CONNECTED AS EMPLOYEE
describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId("icon-window"));
      const windowIcon = screen.getByTestId("icon-window");
      //to-do write expect expression
      expect(windowIcon.classList.contains("active-icon")).toBe(true);
    });

    test("Then bills should be ordered from earliest to latest", () => {
      // INSERT A NEW LINE IN DASHBOARD
      document.body.innerHTML = BillsUI({ data: bills });

      // CATCH ALL THE DATES AND CONVERT IT TO A STRING
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.innerHTML);

      // console.log("dates", dates);

      // SORT THE DATES
      const antiChrono = (a, b) => (a < b ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);

      // console.log("datesSorted", datesSorted);

      // CHECK IF DATE ARE EQUAL TO DATESSORTED ELSE TEST IS FAILED
      expect(dates).toEqual(expect.arrayContaining(datesSorted));
    });
  });
});

//DOESN'T WORK THE ID VALUE IS NOT GO UP IN THE DOM => Unable to find an element by: [data-testid="icon-eye"]
describe("Given I am connected as an employee and I click on the eye icon", () => {
  test("should open a modal to see the bill preview ", () => {
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
    });
    window.localStorage.setItem(
      "user",
      JSON.stringify({
        type: "Employee",
      })
    );
    console.log("localStorage", window.localStorage, "✅");

    document.body.innerHTML = Actions(bills[0]);

    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname });
    };

    console.log(document.body.innerHTML);
    const store = null;

    const bill = new Bills({
      document,
      onNavigate,
      store,
      bills,
      localStorage: window.localStorage,
    });

    console.log({ bill });

    const handleClickIconEye = jest.fn(bill.handleClickIconEye);
    console.log({ handleClickIconEye });

    const eyes = screen.getAllByTestId("icon-eye");
    eyes.forEach((eye) => {
      eye.addEventListener("click", handleClickIconEye);
    });
    userEvent.click(eyes[1]);
    expect(handleClickIconEye).toHaveBeenCalled();

    const modale = screen.getByTestId("modaleFile");
    expect(modale).toBeTruthy();
  });
});

// describe('Given I am connected as an employee and I click on the new bill button', () => {
//   test('should open a modal to add a new bill', () => {
//     expect().()
//   });
// });
