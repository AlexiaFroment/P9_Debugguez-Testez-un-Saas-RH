import { ROUTES_PATH } from "../constants/routes.js";
import Logout from "./Logout.js";

export default class NewBill {
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document;
    this.onNavigate = onNavigate;
    this.store = store;
    // QS FORM NEWBILL
    const formNewBill = this.document.querySelector(
      `form[data-testid="form-new-bill"]`
    );
    // ADDEVENTLISTENER ON SUBMIT
    formNewBill.addEventListener("submit", this.handleSubmit);
    // QS DATA-TESTID=FILE => INPUT FILE DOWNLOAD
    const file = this.document.querySelector(`input[data-testid="file"]`);
    //METHOD TO ADD FILE
    file.addEventListener("change", this.handleChangeFile);
    this.fileUrl = null;
    this.fileName = null;
    this.billId = null;
    new Logout({ document, localStorage, onNavigate });
  }

  genarateRandomValue = (length) => {
    const charact =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomValue = "";
    const charactLength = charact.length;
    for (let i = 0; i < length; i++) {
      randomValue += charact.charAt(Math.floor(Math.random() * charactLength));
    }
    return randomValue;
  };

  handleChangeFile = (e) => {
    e.preventDefault();
    const errorMessage = this.document.getElementById("file-error");
    const file = this.document.querySelector(`input[data-testid="file"]`)
      .files[0];
    const filePath = e.target.value.split(/\\/g);
    const fileName = filePath[filePath.length - 1];
    const extension = fileName.split(".").pop().toLowerCase();
    let fileRename = "";
    // RENAME THE FILE SEND TO THE BACKEND
    if (fileName) {
      fileRename = `bill_${this.genarateRandomValue(6)}.${extension}`;
    }
    console.log(
      "filePath",
      filePath,
      "fileName",
      fileName,
      "fileRename",
      fileRename
    );

    // SET UP A CONDITIONNAL RENDERING ON THE FILE TYPE RECEIVED, I CAN RECEPT ONLY .JPG, .JPEG, .PNG
    if (extension !== "jpg" && extension !== "jpeg" && extension !== "png") {
      errorMessage.style.display = "block";
    } else {
      errorMessage.style.display = "none";
    }

    // SEND DATA (MAIL AND FILE)
    const formData = new FormData();
    const email = JSON.parse(localStorage.getItem("user")).email;
    formData.append("file", file);
    formData.append("email", email);

    // SEND REQUEST TO CREATE A NEW BILL (DATA: MAIL AND FILE)
    this.store
      .bills()
      .create({
        data: formData,
        headers: {
          noContentType: true,
        },
      })
      .then(({ fileUrl, key }) => {
        this.billId = key;
        this.fileUrl = fileUrl;
        // this.fileRename = fileRename;
        this.fileName = fileRename;
        console.log(fileUrl, key, fileRename, this.fileName);
      })
      .catch((error) => console.error(error));
  };

  handleSubmit = (e) => {
    console.log("filename= fileRename", this.fileName, "✅");

    e.preventDefault();

    const errorMessage = this.document.getElementById("file-error");
    if (errorMessage.style.display === "block") {
      return;
    }

    const email = JSON.parse(localStorage.getItem("user")).email;
    console.log("email", email);

    const bill = {
      email,
      type: e.target.querySelector(`select[data-testid="expense-type"]`).value,
      name: e.target.querySelector(`input[data-testid="expense-name"]`).value,
      amount: parseInt(
        e.target.querySelector(`input[data-testid="amount"]`).value
      ),
      date: e.target.querySelector(`input[data-testid="datepicker"]`).value,
      vat: e.target.querySelector(`input[data-testid="vat"]`).value,
      pct:
        parseInt(e.target.querySelector(`input[data-testid="pct"]`).value) ||
        20,
      commentary: e.target.querySelector(`textarea[data-testid="commentary"]`)
        .value,
      fileUrl: this.fileUrl,
      fileName: this.fileName,
      status: "pending",
    };
    console.log("bill", bill);

    this.updateBill(bill);
    this.onNavigate(ROUTES_PATH["Bills"]);
  };

  // not need to cover this function by tests
  updateBill = (bill) => {
    if (this.store) {
      this.store
        .bills()
        .update({ data: JSON.stringify(bill), selector: this.billId })
        .then(() => {
          this.onNavigate(ROUTES_PATH["Bills"]);
        })
        .catch((error) => console.error(error));
    }
  };
}
