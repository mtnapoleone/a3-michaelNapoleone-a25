let appdata = [];

const getFormData = () => {
  const model = document.querySelector("#model").value;
  const year = parseInt(document.querySelector("#year").value);
  const mpg = parseInt(document.querySelector("#mpg").value);
  const age = new Date().getFullYear() - year;
  return { model, year, mpg, age };
};

const submit = async (event) => {
  event.preventDefault();
  const body = JSON.stringify(getFormData());

  try {
    const response = await fetch("/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body
    });

    if (!response.ok) throw await response.json();

    const updatedData = await response.json();
    appdata = updatedData;
    renderTable(updatedData);
    resetForm();
  } catch (err) {
    alert("Error: " + (err.details || "Could not add car"));
  }
};

const updateCar = async (event) => {
  event.preventDefault();
  const body = JSON.stringify(getFormData());

  try {
    const response = await fetch("/submit", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body
    });

    if (!response.ok) throw await response.json();

    const updatedData = await response.json();
    appdata = updatedData;
    renderTable(updatedData);
    resetForm();
  } catch (err) {
    alert("Error: " + (err.details || "Could not update car"));
  }
};

const deleteCar = async (model) => {
  try {
    const response = await fetch("/submit", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model })
    });

    if (!response.ok) throw await response.json();

    const updatedData = await response.json();
    appdata = updatedData;
    renderTable(updatedData);
  } catch (err) {
    alert("Error: " + (err.details || "Could not delete car"));
  }
};

const editCar = (model) => {
  const car = appdata.find(c => c.model === model);
  if (!car) return;

  document.querySelector("#model").value = car.model;
  document.querySelector("#year").value = car.year;
  document.querySelector("#mpg").value = car.mpg;

  const button = document.querySelector("#carform button");
  button.textContent = "Update Car";
  button.onclick = updateCar;
};
const resetForm = () => {
  document.querySelector("#model").value = "";
  document.querySelector("#year").value = "";
  document.querySelector("#mpg").value = "";

  const button = document.querySelector("#carform button");
  button.textContent = "Add Car";
  button.onclick = submit;
};
