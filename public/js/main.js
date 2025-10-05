let appdata = [];

const submit = async function(event) {
  event.preventDefault();

  const model = document.querySelector("#model").value.trim();
  const year = parseInt(document.querySelector("#year").value);
  const mpg = parseInt(document.querySelector("#mpg").value);
  const age = new Date().getFullYear() - year;

  const body = JSON.stringify({ model, year, mpg, age });

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

const editCar = function(model) {
  const car = appdata.find(c => c.model === model);
  if (!car) return;

  document.querySelector("#model").value = car.model;
  document.querySelector("#year").value = car.year;
  document.querySelector("#mpg").value = car.mpg;

  const button = document.querySelector("#carform button");
  button.textContent = "Update Car";
  button.onclick = updateCar;
};

const updateCar = async function(event) {
  event.preventDefault();

  const model = document.querySelector("#model").value.trim();
  const year = parseInt(document.querySelector("#year").value);
  const mpg = parseInt(document.querySelector("#mpg").value);
  const age = new Date().getFullYear() - year;

  const body = JSON.stringify({ model, year, mpg, age });

  const response = await fetch("/submit", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body
  });

  const updatedData = await response.json();
  appdata = updatedData;
  renderTable(updatedData);
  resetForm();
};

const deleteCar = async function(model) {
  const response = await fetch("/submit", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model })
  });

  const updatedData = await response.json();
  appdata = updatedData;
  renderTable(updatedData);
};

const renderTable = function(data) {
  const container = document.querySelector("#results");
  container.innerHTML = "";

  const table = document.createElement("table");
  table.className = "w-full table-auto border border-white text-sm text-white";
  table.setAttribute("role", "table");

  const thead = document.createElement("thead");
  thead.innerHTML = `
    <tr class="bg-gray-800">
      <th scope="col" class="border border-white px-4 py-2">Model</th>
      <th scope="col" class="border border-white px-4 py-2">Year</th>
      <th scope="col" class="border border-white px-4 py-2">MPG</th>
      <th scope="col" class="border border-white px-4 py-2">Age</th>
      <th scope="col" class="border border-white px-4 py-2">Actions</th>
    </tr>
  `;
  table.appendChild(thead);

  const tbody = document.createElement("tbody");

  data.forEach((car, index) => {
    const row = document.createElement("tr");
    row.className = index % 2 === 0 ? "bg-gray-900 hover:bg-gray-700" : "bg-gray-800 hover:bg-gray-700";

    row.innerHTML = `
      <td class="border border-white px-4 py-2">${car.model}</td>
      <td class="border border-white px-4 py-2">${car.year}</td>
      <td class="border border-white px-4 py-2">${car.mpg}</td>
      <td class="border border-white px-4 py-2">${car.age ?? (new Date().getFullYear() - car.year)}</td>
      <td class="border border-white px-4 py-2">
        <button class="bg-yellow-500 text-black px-2 py-1 rounded mr-2" aria-label="Edit ${car.model}">Edit</button>
        <button class="bg-red-600 text-white px-2 py-1 rounded" aria-label="Delete ${car.model}">Delete</button>
      </td>
    `;

    const [editBtn, deleteBtn] = row.querySelectorAll("button");
    editBtn.onclick = () => editCar(car.model);
    deleteBtn.onclick = () => deleteCar(car.model);

    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  container.appendChild(table);
};

const resetForm = function() {
  document.querySelector("#model").value = "";
  document.querySelector("#year").value = "";
  document.querySelector("#mpg").value = "";

  const button = document.querySelector("#carform button");
  button.textContent = "Add Car";
  button.onclick = submit;
};

window.onload = async function() {
  const carform = document.querySelector("#carform");
  const loginBtn = document.querySelector("#loginBtn");
  const logoutBtn = document.querySelector("#logoutBtn");
  const userStatus = document.querySelector("#userStatus");
  const usernameSpan = document.querySelector("#username");
  const userInfo = document.querySelector("#userInfo");
  const params = new URLSearchParams(window.location.search);
  if (params.get("loggedin")) {
    location.replace("/");
    return;
  }

  try {
    const userRes = await fetch("/user");
    if (!userRes.ok) throw new Error("Not logged in");

    const user = await userRes.json();
    usernameSpan.textContent = user.username;
    userInfo.classList.remove("hidden");

    const response = await fetch("/results");
    if (!response.ok) throw new Error("Not logged in");

    const data = await response.json();
    appdata = data;
    renderTable(data);

    carform.classList.remove("hidden");
    logoutBtn.classList.remove("hidden");
    loginBtn.classList.add("hidden");
    userStatus.textContent = "Logged in via GitHub";

    logoutBtn.onclick = async () => {
      await fetch("/logout");
      location.reload();
    };
  } catch (err) {
    userInfo.classList.add("hidden");
    carform.classList.add("hidden");
    logoutBtn.classList.add("hidden");
    loginBtn.classList.remove("hidden");
    userStatus.textContent = "Not logged in. Please log in to manage your cars.";
  }

  carform.onsubmit = submit;
};
//https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
//https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model
// https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault
//https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event
// https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild
//https://dev.to/patoliyainfotech/improving-lighthouse-scores-for-web-applications-a-step-by-step-guide-5d9i
//https://www.valido.ai/en/lighthouse-best-practices-audit-optimize-score/
//https://www.debugbear.com/blog/lighthouse-seo-score