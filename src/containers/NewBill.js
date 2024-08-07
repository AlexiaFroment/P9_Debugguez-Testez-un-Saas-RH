import { ROUTES_PATH } from "../constants/routes.js"
import Logout from "./Logout.js"

export default class NewBill {
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document
    this.onNavigate = onNavigate
    this.store = store
    const formNewBill = this.document.querySelector(
      `form[data-testid="form-new-bill"]`
    )
    formNewBill.addEventListener("submit", this.handleSubmit)
    const file = this.document.querySelector(`input[data-testid="file"]`)
    file.addEventListener("change", this.handleChangeFile)

    this.fileUrl = null
    this.fileName = null
    this.billId = null
    new Logout({ document, localStorage, onNavigate })
  }

  handleChangeFile = (e) => {
    e.preventDefault()
    const fileInput = this.document.querySelector("input[data-testid='file']")
    const errorMessage = this.document.getElementById("file-error")
    const file = fileInput.files[0]
    const fileName = file ? file.name : ""
    const extension = fileName.split(".").pop().toLowerCase()

    // SET UP A CONDITIONNAL RENDERING ON THE FILE TYPE RECEIVED, I CAN RECEPT ONLY .JPG, .JPEG, .PNG
    const fileAcceptedFormats = ["jpg", "jpeg", "png"]

    if (!file || fileAcceptedFormats.indexOf(extension) === -1) {
      errorMessage.style.display = "block"
      fileInput.value = ""
    } else {
      errorMessage.style.display = "none"

      // SEND DATA (MAIL AND FILE)
      const formData = new FormData()
      const email = JSON.parse(localStorage.getItem("user")).email
      formData.append("file", file)
      formData.append("email", email)

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
          console.log("fileUrl", fileUrl)
          this.billId = key
          this.fileUrl = fileUrl
          this.fileName = fileName
        })
        .catch((error) => console.error(error))
    }
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const errorMessage = this.document.getElementById("file-error")
    if (errorMessage.style.display === "block") {
      return
    }

    const email = JSON.parse(localStorage.getItem("user")).email
    // console.log("email", email);

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
    }
    // console.log("bill", bill);

    this.updateBill(bill)
    this.onNavigate(ROUTES_PATH["Bills"])
  }

  // not need to cover this function by tests
  updateBill = (bill) => {
    if (this.store) {
      this.store
        .bills()
        .update({ data: JSON.stringify(bill), selector: this.billId })
        .then(() => {
          this.onNavigate(ROUTES_PATH["Bills"])
        })
        .catch((error) => console.error(error))
    }
  }
}
