document.addEventListener("DOMContentLoaded", function () {
  if (document.querySelector("#books")) {
    loadAuthorsForSelectBox();
    loadCategories();
  }
  if (document.querySelector("#authors-table-body")) {
    loadAuthorsForTable();
    }
    if (document.querySelector("#booksTable")) {
        loadBooks();
    }
  if (document.querySelector("#category-list")) {
    loadCategoriesForTable();
  }
  if (document.querySelector("#categories")) {
    loadCategories();
  }
});

function showAddBookForm() {
  document.getElementById("add-book-form").style.display = "block";

}
function showAddBookFormForCategory(categoryId) {
    const addBookForm = document.getElementById("add-book-form");
    const categorySelect = document.getElementById("book-category");

    addBookForm.style.display = "block";
    categorySelect.value = categoryId;
    categorySelect.disabled = true; // Disable the category select box
}

function showAddAuthorForm() {
  document.getElementById("add-author-form").style.display = "block";
}

function showAddCategoryForm() {
  document.getElementById("add-category-form").style.display = "block";
}

async function loadBooks() {
    const response = await fetch("http://localhost:5211/api/books");
    const books = await response.json();
    const tableBody = document.getElementById("booksTable");

    if (!tableBody) {
        console.error("Table body element not found");
        return;
    }

    // Clear existing table rows
    tableBody.innerHTML = "";

    // Populate the table with book data
    for (const book of books) {
        // Fetch author data for the book
        const authorResponse = await fetch(`http://localhost:5211/api/authors/${book.authorId}`);
        const author = await authorResponse.json();

        // Fetch category data for the book
        const categoryResponse = await fetch(`http://localhost:5211/api/categories/${book.categoryId}`);
        const category = await categoryResponse.json();

        const row = tableBody.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        const cell4 = row.insertCell(3);
        const cell5 = row.insertCell(4);
        const cell6 = row.insertCell(5);

        cell1.textContent = book.id;
        cell2.textContent = book.title;
        cell3.textContent = author.name; // Use the author name from the fetched author data
        cell4.textContent = category.name; // Use the category name from the fetched category data
        cell5.textContent = book.publicationDate;
        cell6.textContent = book.price;
    }
}



async function loadAuthorsForSelectBox() {
  const response = await fetch("http://localhost:5211/api/authors");
  const authors = await response.json();
  const authorSelect = document.getElementById("book-author");

  if (!authorSelect) {
    console.error("Select box element not found");
    return;
  }

  // Clear existing options
  authorSelect.innerHTML = "";

  // Add a default option
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select Author";
  authorSelect.appendChild(defaultOption);

  // Add authors to the select box
  authors.forEach((author) => {
    const option = document.createElement("option");
    option.value = author.id;
    option.textContent = author.name;
    authorSelect.appendChild(option);

    console.log(author.id);
  });
}



async function loadAuthorsForTable() {
  const response = await fetch("http://localhost:5211/api/authors");
  const authors = await response.json();
  const tableBody = document.getElementById("authors-table-body");

  if (!tableBody) {
    console.error("Table body element not found");
    return;
  }

  // Clear existing table rows
  tableBody.innerHTML = "";

  // Populate the table with author data
  authors.forEach((author) => {
    const row = tableBody.insertRow();
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    cell1.textContent = author.id;
    cell2.textContent = author.name;
  });
}

async function loadCategoriesForTable() {
  const response = await fetch("http://localhost:5211/api/categories");
  const categories = await response.json();
    const categoriesLinks = document.getElementById("categories-links");

    if (!categoriesLinks) {
    console.error("Category list element not found");
    return;
  }

    // Clear existing table rows
    categoriesLinks.innerHTML = "";

  // Populate the table with author data
    categories.forEach((category) => {
        const listItem = document.createElement("li");
      const link = document.createElement("a");
      link.href = "#"; // You can set the link href to navigate to a specific page
        link.textContent = category.name;
        link.classList.add("list-group-item", "list-group-item-action");
      link.onclick = (event) => {
          event.preventDefault(); // Prevent default link behavior
          handleCategoryClick(category.id);
      }; // Handle the click event
        listItem.appendChild(link);
        categoriesLinks.appendChild(listItem); // Add a line break for spacing
  });
}
function handleCategoryClick(categoryId) {
    showAddBookFormForCategory(categoryId);
}

async function loadCategories() {
  const response = await fetch("http://localhost:5211/api/categories");
  const categories = await response.json();
  const categorySelect = document.getElementById("book-category");

  if (!categorySelect) {
    console.error("Select box element not found");
    return;
  }

  categorySelect.innerHTML = "";

  // Add a default option
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select Category";
  categorySelect.appendChild(defaultOption);

  // Add categories to the select box
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    categorySelect.appendChild(option);
  });
}

async function addBook() {
  const title = document.getElementById("book-title").value;
  /* const authorId = parseInt(document.getElementById("book-author").value, 10); */

  const authorId = document.getElementById("book-author").value;

    const categoryId = document.getElementById("book-category").value;
    const publicationDate = document.getElementById("publicationDate").value;
    const price = document.getElementById("price").value;

  console.log("ID : ", authorId);
  if (isNaN(authorId) || isNaN(categoryId)) {
    console.error("Author ID and Category ID must be integers.");
    return;
  }
  const response = await fetch("http://localhost:5211/api/books", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: title,
      authorId: authorId,
        categoryId: categoryId,
        publicationDate: publicationDate,
        price: price
    }),
  });

  if (response.ok) {
    loadBooks();
    document.getElementById("add-book-form").style.display = "none";
  } else {
    console.error("Failed to add book:", await response.text());
  }
}

async function addAuthor() {
  const name = document.getElementById("author-name").value.trim();
    if (!name) {
        alert("Category name cannot be empty.");
        return;
    }

    
  try {
    const response = await fetch("http://localhost:5211/api/authors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: name }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    await response.json();
    loadAuthorsForTable();
    loadAuthorsForSelectBox();
    document.getElementById("add-author-form").style.display = "none";
  } catch (error) {
    console.error("Error adding author:", error);
  }
}

async function addCategory() {
  const name = document.getElementById("category-name").value;

  const response = await fetch("http://localhost:5211/api/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: name }),
  });

  if (response.ok) {
    loadCategories();
    loadCategoriesForTable();
    document.getElementById("add-category-form").style.display = "none";
  }
}
