
document.addEventListener("DOMContentLoaded", function () {
  if (document.querySelector("#books")) {
    loadAuthorsForSelectBox();
    loadCategories();
    }
   
    if (window.location.pathname.endsWith("edit.html")) {
        loadBookForEdit();
    }
    if (window.location.pathname.endsWith("editAuthor.html")) {
        loadAuthorForEdit();
    }
    if (window.location.pathname.endsWith("editCategory.html")) {
        loadCategoryForEdit();
    }
    if (window.location.pathname.endsWith("detail.html")) {
        loadDetailPage();
    }
  if (document.querySelector("#authors-table-body")) {
    loadAuthorsForTable();
    }
    if (document.querySelector("#categoriesTableBody")) {
        loadCategoriesForTable();
    }
    if (document.querySelector("#booksTable")) {
        loadBooks();
    }
  
  if (document.querySelector("#categories")) {
    loadCategories();
    }
    
});


function exportTableToExcel() {
    var table = document.getElementById("books");
    var rows = table.getElementsByTagName("tr");
    var csvContent = "data:text/csv;charset=utf-8," + "Id,Title,Author,Category,Publication Date,Price,Created Date\n"; // CSV header;

    // Iterate through rows and append to csvContent
    for (var i = 0; i < rows.length; i++) {
        var row = [], cols = rows[i].getElementsByTagName("td");
        for (var j = 0; j + 1 < cols.length; j++) {
            row.push(cols[j].innerText);
        }
        csvContent += row.join(",") + "\n";
    }

    // Create a hidden link element to trigger the download
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Book_List.csv");
    document.body.appendChild(link);

    // Trigger the download
    link.click();

}
function showAddBookFormForCategory(categoryId) {
    const addBookForm = document.getElementById("add-book-form");
    const categorySelect = document.getElementById("book-category");

    addBookForm.style.display = "block";
    categorySelect.value = categoryId;
    categorySelect.disabled = true; // Disable the category select box
}
function cancelAddBook() {
    const addBookForm = document.getElementById("add-book-form");
    const categorySelect = document.getElementById("book-category");

    addBookForm.style.display = "none";
    categorySelect.disabled = false; // Re-enable the category select box
}

function cancelAddCategory() {
    const addCategoryForm = document.getElementById("add-category-form");
    

    addCategoryForm.style.display = "none";
    
}
function cancelAddAuthor() {
    const addAuthorForm = document.getElementById("add-author-form");


    addAuthorForm.style.display = "none";

}

function cancelEditBook() {
    window.location.href = 'booklist.html';
}
function cancelEditCategory() {
    window.location.href = 'category.html';
}
function cancelEditAuthor() {
    window.location.href = 'authorlist.html';
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
    for (const [index, book] of books.entries()) {
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
        const cell7 = row.insertCell(6);
        const cell8 = row.insertCell(7);
        const displayedId = index + 1;


        cell1.textContent = displayedId;
        /*cell1.textContent = book.id;*/
        cell2.textContent = book.title;
        cell3.textContent = author.name; // Use the author name from the fetched author data
        cell4.textContent = category.name; // Use the category name from the fetched category data
        cell5.textContent = new Date(book.publicationDate).toLocaleDateString();
        cell6.textContent = book.price;
        cell7.textContent = new Date(book.createdDate).toLocaleDateString(); // Display created date
        cell8.innerHTML = `<button class="btn btn-add" onclick="redirectToEdit(${book.id})">Edit</button>
                        <button class="btn btn-add" onclick="deleteBook(${book.id})">Delete</button>
                        <button class="btn btn-add" onclick="redirectToDetail(${book.id})">Details</button>`; 
    }
}

// Function to redirect to the detail page with the book ID
function redirectToDetail(bookId) {
    window.location.href = `detail.html?id=${bookId}`;
}
function redirectToEdit(bookId) {
    window.location.href = `edit.html?bookId=${bookId}`;
}
// Function to delete a book
async function deleteBook(bookId) {
    const response = await fetch(`http://localhost:5211/api/books/${bookId}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        // Reload the authors table or remove the specific row from the table
        loadBooks();
    } else {
        console.error('Failed to delete author:', await response.text());
    }
}
// Function to load book data into the form for editing
async function loadBookForEdit() {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('bookId');

    if (!bookId) {
        console.error("No bookId found in URL");
        return;
    }

    const response = await fetch(`http://localhost:5211/api/books/${bookId}`);
    const book = await response.json();
    console.log("Publication Date from API:", book.publicationDate);
    // Load author and category data for select boxes
    await loadAuthorsForSelectBox();
    await loadCategories();

    // Populate the form fields with the book data
    document.getElementById("book-title").value = book.title;
    document.getElementById("book-author").value = book.authorId;
    document.getElementById("book-category").value = book.categoryId;
    const publicationDate = book.publicationDate.split('T')[0];
    document.getElementById("book-publication-date").value = publicationDate;
    document.getElementById("book-price").value = book.price;

/*    // Show the form
    document.getElementById("editBookForm").style.display = "block";*/

    // Add submit event listener to the form
    document.getElementById("editBookForm").addEventListener("submit", async function (event) {
        event.preventDefault();

        const updatedBook = {
            ...book,
            title: document.getElementById("book-title").value,
            authorId: document.getElementById("book-author").value,
            categoryId: document.getElementById("book-category").value,
            publicationDate: document.getElementById("book-publication-date").value,
            price: document.getElementById("book-price").value,
        };

        const updateResponse = await fetch(`http://localhost:5211/api/books/${bookId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedBook),
        });

        if (updateResponse.ok) {
            window.location.href = "booklist.html"; // Redirect to the book list page
        } else {
            console.error("Failed to update book:", await updateResponse.text());
        }
    });
}
// Function to load and display the details of a book
async function loadBookDetails(bookId) {
    try { 
    // Fetch book data
    const response = await fetch(`http://localhost:5211/api/books/${bookId}`);
    const book = await response.json();

    // Fetch author data
    const authorResponse = await fetch(`http://localhost:5211/api/authors/${book.authorId}`);
    const author = await authorResponse.json();

    // Fetch category data
    const categoryResponse = await fetch(`http://localhost:5211/api/categories/${book.categoryId}`);
    const category = await categoryResponse.json();

    const detailsContainer = document.getElementById("bookDetails");

    if (!detailsContainer) {
        console.error("Details container element not found");
        return;
    }

    // Display the details of the book
    detailsContainer.innerHTML = `
        <h2 class="card-title">${book.title}</h2>
            <p class="card-text"><strong>Author:</strong> ${author.name}</p>
            <p class="card-text"><strong>Category:</strong> ${category.name}</p>
            <p class="card-text"><strong>Publication Date:</strong> ${new Date(book.publicationDate).toLocaleDateString() }</p>
            <p class="card-text"><strong>Price:</strong> ${book.price}</p>
            <p class="card-text"><strong>Created Date:</strong> ${new Date(book.createdDate).toLocaleDateString()}</p>
    `;
    // Add event listener to the download PDF button
    const downloadButton = document.getElementById("downloadButton");
    if (downloadButton) {
        downloadButton.addEventListener("click", () => {
            downloadBookDetailsAsPDF(book, author, category);
        });
    }

} catch (error) {
    console.error("Error loading book details:", error);
}
}
// Function to download book details as PDF
function downloadBookDetailsAsPDF(book, author, category) {
    // Access the jsPDF library
    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    const margin = 15;
    const lineHeight = 10;
    let yPosition = margin;

    doc.setFontSize(16);
    doc.text("Book Details", margin, yPosition);
    yPosition += lineHeight * 2;

    doc.setFontSize(14);
    doc.setFont(undefined, 'bold'); // Set font to bold
    doc.text(`Book Title:`, margin, yPosition);
    doc.setFont(undefined, 'normal');
    doc.text(`${book.title}`, margin + 60, yPosition);
    yPosition += lineHeight;

    doc.setFont(undefined, 'bold');
    doc.text(`Author:`, margin, yPosition);
    doc.setFont(undefined, 'normal');
    doc.text(`${author.name}`, margin + 60, yPosition);
    yPosition += lineHeight;

    doc.setFont(undefined, 'bold');
    doc.text(`Category:`, margin, yPosition);
    doc.setFont(undefined, 'normal');
    doc.text(`${category.name}`, margin + 60, yPosition);
    yPosition += lineHeight;

    doc.setFont(undefined, 'bold');
    doc.text(`Publication Date:`, margin, yPosition);
    doc.setFont(undefined, 'normal');
    doc.text(`${new Date(book.publicationDate).toLocaleDateString()}`, margin + 60, yPosition);
    yPosition += lineHeight;

    doc.setFont(undefined, 'bold');
    doc.text(`Price:`, margin, yPosition);
    doc.setFont(undefined, 'normal');
    doc.text(`${book.price}`, margin + 60, yPosition);
    yPosition += lineHeight;

    doc.setFont(undefined, 'bold');
    doc.text(`Created Date:`, margin, yPosition);
    doc.setFont(undefined, 'normal');
    doc.text(`${new Date(book.createdDate).toLocaleDateString()}`, margin + 60, yPosition);
    yPosition += lineHeight;


    // Save PDF with a dynamic filename
    doc.save(`BookDetails_${book.title}.pdf`);
}
// Function to extract the book ID from the URL query string and load the details
async function loadDetailPage() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const bookId = urlParams.get('id');
    if (bookId) {
        await loadBookDetails(bookId);
    } else {
        console.error("Book ID not found in URL");
    }
    // Add event listener to the cancel button
    const cancelButton = document.getElementById("cancelButton");
    if (cancelButton) {
        cancelButton.addEventListener("click", () => {
            // Redirect to the main books list page (assuming it is index.html)
            window.location.href = "booklist.html";
        });
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
  authors.forEach((author,index) => {
    const row = tableBody.insertRow();
    const cell1 = row.insertCell(0);
      const cell2 = row.insertCell(1);
      const cell3 = row.insertCell(2);
      const cell4 = row.insertCell(3);
      const displayedId = index + 1;


      cell1.textContent = displayedId;
    /*cell1.textContent = author.id;*/
      cell2.textContent = author.name;
      cell3.textContent = new Date(author.createdDate).toLocaleDateString(); // Display created date
      cell4.innerHTML = `<button class="btn btn-add" onclick="editAuthor(${author.id})">Edit</button>
                        <button class="btn btn-add" onclick="deleteAuthor(${author.id})">Delete</button>`;
  });
}

async function editAuthor(authorId) {
    console.log('Editing author with ID:', authorId);
    window.location.href = `editAuthor.html?authorId=${authorId}`;
}
async function loadAuthorForEdit() {
    
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const authorId = urlParams.get('authorId');

        if (!authorId) {
            console.error("No authorId found in URL");
            return;
        }
       
        const response = await fetch(`http://localhost:5211/api/authors/${authorId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch author data');
        }
        const author = await response.json();

        document.getElementById('authorName').value = author.name;

       
        document.getElementById("editAuthorForm").addEventListener("submit", async function (event) {
            event.preventDefault();
        

            const updatedName = document.getElementById('authorName').value;

            const updatedAuthor = {
                id: authorId,
                name: updatedName
            };

            const updateResponse = await fetch(`http://localhost:5211/api/authors/${authorId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedAuthor)
            });

            if (updateResponse.ok) {
                alert('Author updated successfully!');
                window.location.href = 'authorList.html'; // Redirect to author list page
            } else {
                throw new Error('Failed to update author');
            }
        });
    } catch (error) {
        console.error('Error:', error);
        // Handle error, e.g., display an error message to the user
    }
}



// Function to delete an author
async function deleteAuthor(authorId) {
    const response = await fetch(`http://localhost:5211/api/authors/${authorId}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        // Reload the authors table or remove the specific row from the table
        loadAuthorsForTable();
    } else {
        console.error('Failed to delete author:', await response.text());
    }
}


async function loadCategoriesForTable() {
    const response = await fetch("http://localhost:5211/api/categories");
    const categories = await response.json();
    const categoriesTableBody = document.getElementById("categoriesTableBody");

    if (!categoriesTableBody) {
        console.error("Categories table body element not found");
        return;
    }

    // Clear existing table rows
    categoriesTableBody.innerHTML = "";

    // Populate the table with category data
    categories.forEach((category) => {
        const row = categoriesTableBody.insertRow();
        const nameCell = row.insertCell();
        const dateCell = row.insertCell(); // New cell for createdDate
        const actionCell = row.insertCell();

        const link = document.createElement("a");
        link.href = "#"; // You can set the link href to navigate to a specific page
        link.textContent = category.name;
        link.classList.add("category-link", "text-white");
        link.onclick = (event) => {
            event.preventDefault(); // Prevent default link behavior
            handleCategoryClick(category.id);
        }; // Handle the click event

        nameCell.appendChild(link);
        const formattedDate = new Date(category.createdDate).toLocaleDateString();
        dateCell.textContent = formattedDate; // Set the createdDate cell
        actionCell.innerHTML = `<button class="btn btn-add" onclick="editCategory(${category.id})">Edit</button>
                                <button class="btn btn-add" onclick="deleteCategory(${category.id})">Delete</button>`;
    });
}

async function editCategory(categoryId) {
    console.log('Editing category with ID:', categoryId);
    window.location.href = `editCategory.html?categoryId=${categoryId}`;
}
async function loadCategoryForEdit() {

    try {
        const urlParams = new URLSearchParams(window.location.search);
        const categoryId = urlParams.get('categoryId');

        if (!categoryId) {
            console.error("No categoryId found in URL");
            return;
        }

        const response = await fetch(`http://localhost:5211/api/categories/${categoryId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch category data');
        }
        const category = await response.json();

        document.getElementById('categoryName').value = category.name;
        document.getElementById("editCategoryForm").addEventListener("submit", async function (event) {
            event.preventDefault();


            const updatedName = document.getElementById('categoryName').value;

            const updatedCategory = {
                id: categoryId,
                name: updatedName
            };

            const updateResponse = await fetch(`http://localhost:5211/api/categories/${categoryId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedCategory)
            });

            if (updateResponse.ok) {
                alert('Category updated successfully!');
                window.location.href = 'category.html';
            } else {
                throw new Error('Failed to update category');
            }
        });
    } catch (error) {
        console.error('Error:', error);
        // Handle error, e.g., display an error message to the user
    }
}
//Function to delete an category
async function deleteCategory(categoryId) {
    const response = await fetch(`http://localhost:5211/api/categories/${categoryId}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        // Reload the authors table or remove the specific row from the table
        loadCategoriesForTable();
    } else {
        console.error('Failed to delete author:', await response.text());
    }
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

    const formData =  {
        Title: title,
        AuthorId: authorId,
        CategoryId: categoryId,
        PublicationDate: publicationDate,
        Price: price
    };

    const response = await fetch("http://localhost:5211/api/books", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    });

  //const response = await fetch(`http://localhost:5211/api/books`, {
  //  method: "POST",
  //  headers: {
  //    "Content-Type": "application/json",
  //  },
  //  body: JSON.stringify({
  //    Title: title,
  //    AuthorId: authorId,
  //      CategoryId: categoryId,
  //      PublicationDate: publicationDate,
  //      Price: price
  //  }).then((response) => response.json())
  //        .then((data) => {
  //            if (data.errors) {

  //                console.error("Failed to add employee:", data);
  //            } else {

  //                console.log("Employee added successfully:", data);
  //                // Optionally, reset the form or update the UI
  //            }
  //        })
  //        .catch((error) => console.error("Error:", error))

  //    /*body: JSON.stringify(formData)*/
  //});

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
