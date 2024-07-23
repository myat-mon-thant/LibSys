
document.addEventListener("DOMContentLoaded", function () {

    if (document.querySelector("#booklists")) {

        loadAuthorsForSelectBox();
        loadCategories();
    }
    if (document.querySelector("#searchInput")) {
        document.getElementById('searchInput').addEventListener('input', searchBooks);
    }
    if (window.location.pathname.endsWith("edit.html")) {
        loadBookForEdit();
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
//function showAddBookFormForCategory() {
//    var newDiv = document.createElement('div');
//    newDiv.className = 'new-book-form mt-4';
//    loadAuthorsForSelectBox();
//    var formContent = `
//            <div class="form-group">
//        <label style = "font-weight:bold;" for= "book-title"> Book Title</label>
//            <input type="text" class="form-control" id="book-title" placeholder="Enter book title">
//        </div>
//        <div class="form-group">
//            <label style="font-weight:bold;" for="book-author">Author</label>
//            <select class="form-control" id="book-author"></select>
//        </div>
//         <div class="form-group">
//            <label style="font-weight:bold;" for="publicationDate">Publication Date</label>
//            <input type="date" class="form-control" id="publicationDate" placeholder="Enter Publication Date">
//        </div>
//        <div class="form-group">
//            <label style="font-weight:bold;" for="price">Price</label>
//            <input type="text" class="form-control" id="price" placeholder="Enter book price">
//        </div>
//        `;
//    newDiv.innerHTML = formContent;
//    document.getElementById('new-book-form-container').appendChild(newDiv);
//    document.getElementById('addNewBook').style.display = "none";
//}

/*function displayMessage(message, isSuccess) {
    const messageDiv = document.getElementById('messages');
    messageDiv.innerText = message;
    messageDiv.style.color = isSuccess ? 'green' : 'red';
}*/
function displayMessage(message, isSuccess) {
    if (isSuccess) {
        alertify.success(message);
    } else {
        alertify.error(message);
    }
}

function searchBooks() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const booksTable = document.getElementById('booksTable');
    const rows = booksTable.getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        let found = false;

        for (let j = 0; j < cells.length; j++) {
            const cellValue = cells[j].textContent || cells[j].innerText;
            if (cellValue.toLowerCase().indexOf(searchInput) > -1) {
                found = true;
                break;
            }
        }

        if (found) {
            rows[i].style.display = '';
        } else {
            rows[i].style.display = 'none';
        }
    }
}


//function exportTableToExcel() {
//    var table = document.getElementById("books");
//    var clonedTable = table.cloneNode(true);

//    // Remove the status column (assuming it's the 7th column, index 6)
//    var rows = clonedTable.rows;
//    for (var i = 0; i < rows.length; i++) {
//        if (rows[i].cells[7]) {
//            rows[i].deleteCell(7);
//        }
//    }

//    var wb = XLSX.utils.table_to_book(clonedTable, { sheet: "Sheet JS" });

//    // Define cell styles
//    var ws = wb.Sheets["Sheet JS"];
//    var range = XLSX.utils.decode_range(ws['!ref']);

//    for (var R = range.s.r; R <= range.e.r; ++R) {
//        for (var C = range.s.c; C <= range.e.c; ++C) {
//            var cell_address = { c: C, r: R };
//            var cell_ref = XLSX.utils.encode_cell(cell_address);

//            if (!ws[cell_ref]) continue;

//            // Apply borders
//            ws[cell_ref].s = {
//                border: {
//                    top: { style: "thin" },
//                    bottom: { style: "thin" },
//                    left: { style: "thin" },
//                    right: { style: "thin" }
//                }
//            };

//            // Make the header bold
//            if (R === 0) {
//                ws[cell_ref].s.font = { bold: true };
//            }
//        }
//    }

//    XLSX.writeFile(wb, "Book_List.xlsx");
//}


function exportTableToExcel() {
    var table = document.getElementById("booklists");
    var clonedTable = table.cloneNode(true);

    // Remove the status column (assuming it's the 7th column, index 6)
    var rows = clonedTable.rows;
    for (var i = 0; i < rows.length; i++) {
        if (rows[i].cells[7]) { // Adjusted index to 6 for 7th column
            rows[i].deleteCell(7);
        }
    }

    var wb = XLSX.utils.table_to_book(clonedTable, { sheet: "Sheet JS" });

    // Define cell styles
    var ws = wb.Sheets["Sheet JS"];
    var range = XLSX.utils.decode_range(ws['!ref']);

    for (var R = range.s.r; R <= range.e.r; ++R) {
        for (var C = range.s.c; C <= range.e.c; ++C) {
            var cell_address = { c: C, r: R };
            var cell_ref = XLSX.utils.encode_cell(cell_address);

            if (!ws[cell_ref]) continue;

            // Apply borders
            ws[cell_ref].s = ws[cell_ref].s || {};
            ws[cell_ref].s.border = {
                top: { style: "thin" },
                bottom: { style: "thin" },
                left: { style: "thin" },
                right: { style: "thin" }
            };

            // Make the header bold
            if (R === 0) {
                ws[cell_ref].s.font = { bold: true };
            }
        }
    }

    XLSX.writeFile(wb, "Book_List.xlsx");
}


//function exportTableToExcel() {
//    var table = document.getElementById("books");
//    var clonedTable = table.cloneNode(true);

//    // Remove the status column (assuming it's the 7th column, index 6)
//    var rows = clonedTable.rows;
//    for (var i = 0; i < rows.length; i++) {
//        if (rows[i].cells[6]) { // Adjusted index to 6 for 7th column
//            rows[i].deleteCell(6);
//        }
//    }

//    var wb = XLSX.utils.table_to_book(clonedTable, { sheet: "Sheet JS" });

//    // Define cell styles
//    var ws = wb.Sheets["Sheet JS"];
//    var range = XLSX.utils.decode_range(ws['!ref']);

//    for (var R = range.s.r; R <= range.e.r; ++R) {
//        for (var C = range.s.c; C <= range.e.c; ++C) {
//            var cell_address = { c: C, r: R };
//            var cell_ref = XLSX.utils.encode_cell(cell_address);

//            if (!ws[cell_ref]) continue;

//            // Apply borders
//            ws[cell_ref].s = ws[cell_ref].s || {};
//            ws[cell_ref].s.border = {
//                top: { style: "thin" },
//                bottom: { style: "thin" },
//                left: { style: "thin" },
//                right: { style: "thin" }
//            };

//            // Make the header bold
//            if (R === 0) {
//                ws[cell_ref].s.font = { bold: true };
//            }
//        }
//    }

//    XLSX.writeFile(wb, "Book_List.xlsx");
//}




function showAddBookFormForCategory() {
    var newDiv = document.createElement('div');
    newDiv.className = 'new-book-form mt-4';
    loadAuthorsForSelectBox();
    var formContent = `
        <div class="add-book-form">
           <h2>Add Book</h2>
                    <input type="text" id="book-title" class="form-control" placeholder="Book Title" />
                    <select id="book-author" class="form-control my-2"></select>
                    <input type="date" class="form-control" id="publicationDate">
                    <input type="text" class="form-control" id="price" placeholder="Enter book price">
            <button type="submit" onclick="cancelAddCategory()" class="btn btn-primary">Cancel</button>
        </div>
    `;

    newDiv.innerHTML = formContent;
    document.getElementById('new-book-form-container').appendChild(newDiv);


    document.getElementById("addNewBook").style.display = 'none';

    // Optional: Hide the add button if you only want to allow one form at a time
    // document.getElementById('addNewBook').style.display = "none";
}
function cancelAddBook() {
    const addBookForm = document.getElementById("add-book-form");
    const categorySelect = document.getElementById("book-category");

    addBookForm.style.display = "none";
    categorySelect.disabled = false; // Re-enable the category select box
}

function cancelAddCategory() {
    window.location.href = 'category.html';
    //const addCategoryForm = document.getElementById("add-book-form");


    //addCategoryForm.style.display = "none";

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
    if (!response.ok) {
        throw new Error('Failed to fetch books');
    }
    const books = await response.json();
    const data = books.data;

    const tableBody = document.getElementById("booksTable");

    if (!tableBody) {
        console.error("Table body element not found");
        return;
    }

    // Clear existing table rows
    tableBody.innerHTML = "";

    // Populate the table with book data
    for (const [index, book] of data.entries()) {
        /* let authorName = 'unknown';
         let categoryName = 'unknown';*/
      
        // Fetch author data for the book
        const authorResponse = await fetch(`http://localhost:5211/api/authors/${book.authorId}`);
        if (authorResponse.ok) {
            const author = await authorResponse.json();
            authorName = author.data.name;
        } else {
            console.error(`Failed to fetch author with ID ${book.authorId}`);
        }


        // Fetch category data for the book
        const categoryResponse = await fetch(`http://localhost:5211/api/categories/${book.categoryId}`);
        if (categoryResponse.ok) {
            const category = await categoryResponse.json();
            categoryName = category.data.name;
           
        } else {
            console.error(`Failed to fetch category with ID ${book.categoryId}`);
        }

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
        cell2.textContent = book.title;
        cell3.textContent = authorName; // Use the author name from the fetched author data
        cell4.textContent = categoryName;; // Use the category name from the fetched category data
        cell5.textContent = new Date(book.publicationDate).toLocaleDateString();
        cell6.textContent = book.price;
        cell7.textContent = new Date(book.createdDate).toLocaleDateString(); // Display created date
        cell8.innerHTML = `<button class="btn btn-link text-dark" onclick="redirectToEdit(${book.id})">Edit</button>
                            <button class="btn btn-link text-danger" onclick="deleteBook(${book.id})">Delete</button>
                            <button class="btn btn-link text-info" onclick="redirectToDetail(${book.id})">Details</button>`;
    }

}



// Function to redirect to the detail page with the book ID
function redirectToDetail(bookId) {
    window.location.href = `detail.html?id=${bookId}`;
}
async function redirectToEdit(bookId) {
    document.getElementById("add-book-form").style.display = "block";
    const response = await fetch(`http://localhost:5211/api/books/${bookId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch book data');
    }
    const book = await response.json();

    await loadAuthorsForSelectBox();
    await loadCategories();
    document.getElementById('book-title').value = book.data.title;
    document.getElementById("book-author").value = book.data.authorId;
    document.getElementById("book-category").value = book.data.categoryId;
    const publicationDate = book.data.publicationDate.split('T')[0];
    document.getElementById("publicationDate").value = publicationDate;
    document.getElementById("price").value = book.data.price;

    document.getElementById('hiddenBook').value = bookId;

}
// Function to delete a book
async function deleteBook(bookId) {
    const response = await fetch(`http://localhost:5211/api/books/${bookId}`, {
        method: 'DELETE'
    });
    const result = await response.json();
    if (response.ok) {
        displayMessage(result.message);
        // Reload the authors table or remove the specific row from the table
        loadBooks();
    } else {
        displayMessage(result.message, false);
        console.error('Failed to delete author:', await response.text());
    }
}

//Function to load and display the details of a book
async function loadBookDetails(bookId) {
    try {
        // Fetch book data
        const response = await fetch(`http://localhost:5211/api/books/${bookId}`);
        const book = await response.json();

        
        // Fetch author data
        const authorResponse = await fetch(`http://localhost:5211/api/authors/${book.data.authorId}`);
        const author = await authorResponse.json();
        
        // Fetch category data
        const categoryResponse = await fetch(`http://localhost:5211/api/categories/${book.data.categoryId}`);
        const category = await categoryResponse.json();
       
        const detailsContainer = document.getElementById("bookDetails");

        if (!detailsContainer) {
            console.error("Details container element not found");
            return;
        }

        // Display the details of the book
        detailsContainer.innerHTML = `
        <h2 class="card-title">${book.data.title}</h2>
            <p class="card-text"><strong>Author:</strong> ${author.data.name}</p>
            <p class="card-text"><strong>Category:</strong> ${category.data.name}</p>
            <p class="card-text"><strong>Publication Date:</strong> ${new Date(book.data.publicationDate).toLocaleDateString()}</p>
            <p class="card-text"><strong>Price:</strong> ${book.data.price}</p>
            <p class="card-text"><strong>Created Date:</strong> ${new Date(book.data.createdDate).toLocaleDateString()}</p>
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
    doc.text(`${book.data.title}`, margin + 60, yPosition);
    yPosition += lineHeight;

    doc.setFont(undefined, 'bold');
    doc.text(`Author:`, margin, yPosition);
    doc.setFont(undefined, 'normal');
    doc.text(`${author.data.name}`, margin + 60, yPosition);
    yPosition += lineHeight;

    doc.setFont(undefined, 'bold');
    doc.text(`Category:`, margin, yPosition);
    doc.setFont(undefined, 'normal');
    doc.text(`${category.data.name}`, margin + 60, yPosition);
    yPosition += lineHeight;

    doc.setFont(undefined, 'bold');
    doc.text(`Publication Date:`, margin, yPosition);
    doc.setFont(undefined, 'normal');
    doc.text(`${new Date(book.data.publicationDate).toLocaleDateString()}`, margin + 60, yPosition);
    yPosition += lineHeight;

    doc.setFont(undefined, 'bold');
    doc.text(`Price:`, margin, yPosition);
    doc.setFont(undefined, 'normal');
    doc.text(`${book.data.price}`, margin + 60, yPosition);
    yPosition += lineHeight;

    doc.setFont(undefined, 'bold');
    doc.text(`Created Date:`, margin, yPosition);
    doc.setFont(undefined, 'normal');
    doc.text(`${new Date(book.data.createdDate).toLocaleDateString()}`, margin + 60, yPosition);
    yPosition += lineHeight;


    // Save PDF with a dynamic filename
    doc.save(`BookDetails_${book.data.title}.pdf`);
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
    try {
        const response = await fetch("http://localhost:5211/api/authors");
        if (!response.ok) {
            throw new Error('Failed to fetch authors');
        }
        const apiResponse = await response.json();
        const authors = apiResponse.data; // Access the Data property

        // Log the response to check the structure
        

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

        // Check if authors is an array

        // Add authors to the select box
        authors.forEach((author) => {
            const option = document.createElement("option");
            option.value = author.id;
            option.textContent = author.name;
            authorSelect.appendChild(option);
        });

    } catch (error) {
        console.error('Error loading authors:', error);
    }
}
async function loadAuthorsForTable() {
    try {
        const response = await fetch("http://localhost:5211/api/authors");
        if (!response.ok) {
            throw new Error('Failed to fetch authors');
        }
        const apiResponse = await response.json();
        const authors = apiResponse.data; // Access the Data property

        const tableBody = document.getElementById("authors-table-body");
        if (!tableBody) {
            console.error("Table body element not found");
            return;
        }

        // Clear existing table rows
        tableBody.innerHTML = "";

        // Populate the table with author data
        if (Array.isArray(authors)) {
            authors.forEach((author, index) => {
                const row = tableBody.insertRow();
                const cell1 = row.insertCell(0);
                const cell2 = row.insertCell(1);
                const cell3 = row.insertCell(2);
                const cell4 = row.insertCell(3);
                const displayedId = index + 1;

                cell1.textContent = displayedId;
                cell2.textContent = author.name;
                cell3.textContent = new Date(author.createdDate).toLocaleDateString(); // Display created date
                cell4.innerHTML = `
          <button class="btn btn-link text-dark" onclick="editAuthor(${author.id})">Edit</button>
          <button class="btn btn-link text-danger" onclick="deleteAuthor(${author.id})">Delete</button>`;
            });
        } else {
            console.error('Expected an array of authors, but got:', authors);
        }
    } catch (error) {
        console.error('Error loading authors:', error);
        alertify.error('An error occurred while loading authors.');
    }
}


async function editAuthor(authorId) {
    
    document.getElementById("add-author-form").style.display = "block";
    const response = await fetch(`http://localhost:5211/api/authors/${authorId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch author data');
    }
    const author = await response.json();

    document.getElementById('author-name').value = author.data.name;
    document.getElementById('hiddenAuthor').value = authorId;

}


// Function to delete an author
async function deleteAuthor(authorId) {
    const response = await fetch(`http://localhost:5211/api/authors/${authorId}`, {
        method: 'DELETE'
    });
    const result = await response.json();
    if (response.ok) {
        displayMessage(result.message, true);
        /*alert()*/
        // Reload the authors table or remove the specific row from the table
        loadAuthorsForTable();
    } else {
        displayMessage(result.message, false);
        console.error('Failed to delete author:', await response.text());
    }
}
async function loadCategoriesForTable() {
    try {
        const response = await fetch("http://localhost:5211/api/categories");
        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }
        const apiResponse = await response.json();
        const categories = apiResponse.data; // Access the Data property

        const categoriesTableBody = document.getElementById("categoriesTableBody");

        if (!categoriesTableBody) {
            console.error("Categories table body element not found");
            return;
        }

        // Clear existing table rows
        categoriesTableBody.innerHTML = "";

        // Populate the table with author data
        if (Array.isArray(categories)) {
            categories.forEach((category, index) => {
                const row = categoriesTableBody.insertRow();
                const cell1 = row.insertCell(0);
                const cell2 = row.insertCell(1);
                const cell3 = row.insertCell(2);
                const cell4 = row.insertCell(3);
                const displayedId = index + 1;

                cell1.textContent = displayedId;
                cell2.textContent = category.name;
                cell3.textContent = new Date(category.createdDate).toLocaleDateString(); // Display created date
                cell4.innerHTML = `
          <button class="btn btn-link text-dark" onclick="editCategory(${category.id})">Edit</button>
          <button class="btn btn-link text-danger" onclick="deleteCategory(${category.id})">Delete</button>`;
            });
        } else {
            console.error('Expected an array of authors, but got:', authors);
        }
    } catch (error) {
        console.error('Error loading categories:', error);
        alertify.error('An error occurred while loading categories.');
    }
}

async function editCategory(categoryId) {
   
    document.getElementById("add-category-form").style.display = "block";
    const response = await fetch(`http://localhost:5211/api/categories/${categoryId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch category data');
    }
    const category = await response.json();
    document.getElementById('category-name').value = category.data.name;
    document.getElementById('hiddenCategory').value = categoryId;

}

//Function to delete an category
async function deleteCategory(categoryId) {
    const response = await fetch(`http://localhost:5211/api/categories/${categoryId}`, {
        method: 'DELETE'
    });
    const result = await response.json();
    if (response.ok) {
        displayMessage(result.message);
        // Reload the authors table or remove the specific row from the table
        loadCategoriesForTable();
    } else {
        displayMessage(result.message, true);
        console.error('Failed to delete author:', await response.text());
    }
}



//function handleCategoryClick(categoryId) {
//    showAddBookFormForCategory(categoryId);
//}

async function loadCategories() {
    try {
        const response = await fetch("http://localhost:5211/api/categories");
        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }
        const apiResponse = await response.json();
        const categories = apiResponse.data; // Access the Data property
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


        categories.forEach((category) => {
            const option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });

    } catch (error) {
        console.error('Error loading categories:', error);
        alertify.error('An error occurred while loading categories.');
    }
}



function addBook() {
    const id = document.getElementById("hiddenBook").value;
    const title = document.getElementById("book-title").value;
    const authorId = document.getElementById("book-author").value;
    const categoryId = document.getElementById("book-category").value;
    const publicationDate = document.getElementById("publicationDate").value;
    const price = document.getElementById("price").value;


    if (isNaN(authorId) || isNaN(categoryId)) {
        console.error("Author ID and Category ID must be integers.");
        return;
    }

    const formData = {
        Title: title,
        AuthorId: authorId,
        CategoryId: categoryId,
        PublicationDate: publicationDate,
        Price: price,
        Status: "Active",
        createdDate:Date.now
    };
    fetch(`http://localhost:5211/api/books/${id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.errors) {
                console.error("Failed to add book:", data);
            } else {
                displayMessage(data.message, true);
                document.getElementById("book-title").value = "";
                document.getElementById("book-author").value = "";
                document.getElementById("book-category").value = "";
                document.getElementById("publicationDate").value = "";
                document.getElementById("price").value = "";
                loadBooks();

                // Optionally, reset the form or update the UI
            }
        })
        .catch((error) => console.error("Error:", error));
}



async function addAuthor() {
    const id = document.getElementById("hiddenAuthor").value;
    const name = document.getElementById("author-name").value.trim();
    if (!name) {
        alert("Category name cannot be empty.");
        return;
    }
    try {
        const AuthorData = {
            name: name,
            status: "Active",
            createdDate: Date.now
        };
        const response = await fetch(`http://localhost:5211/api/authors/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(AuthorData),
        });
        const result = await response.json();
        if (response.ok) {

            displayMessage(result.message, true);
            loadAuthorsForTable();
            loadAuthorsForSelectBox();
            document.getElementById("author-name").value = "";

            document.getElementById("hiddenAuthor").value = 0;
        } else {
            displayMessage(result.message, false);
        }

    } catch (error) {
        displayMessage(error.message, false);
    }
}

//async function addCategory() {
//    const id = document.getElementById("hiddenCategory").value;
//    if (id == 0) {
//        const name = document.getElementById("category-name").value;

//        const categoryData = {
//            name: name,
//            status: "Active",
//            createdDate: Date.now
//        };
//        const response = await fetch(`http://localhost:5211/api/categories`, {
//            method: "POST",
//            headers: {
//                "Content-Type": "application/json",
//            },
//            body: JSON.stringify(categoryData),
//        });
//        const result = await response.json();
//        if (response.ok) {
//            displayMessage(result.message, true);
//            loadCategories();
//            loadCategoriesForTable();
//            document.getElementById("category-name").value = "";

//        } else {
//            displayMessage(result.message, false);
//        }
//    } else {

//        const updatedName = document.getElementById('category-name').value;

//        const updatedCategory = {
//            id: id,
//            name: updatedName,
//            status: "Active",
//            createdDate: Date.now
//        };
//        const updateResponse = await fetch(`http://localhost:5211/api/categories/${id}`, {
//            method: 'POST',
//            headers: {
//                'Content-Type': 'application/json'
//            },
//            body: JSON.stringify(updatedCategory)
//        });
//        const result = await updateResponse.json();
//        if (updateResponse.ok) {
//            displayMessage(result.message, true);
//            loadCategories();
//            loadCategoriesForTable();
//            document.getElementById("category-name").value = "";
//        } else {
//            displayMessage(result.message, false);
//        }
//    }
async function addCategory() {
    const id = document.getElementById("hiddenCategory").value;
    if (id == 0) {
        const name = document.getElementById("category-name").value;
        const bookForms = document.querySelectorAll('.add-book-form');
        const books = [];

        //const bookTitle = form.querySelector('input[id="book-title"]').value;
        //const bookAuthor = form.querySelector('input[id="book-author"]').value;
        //const publicationDate = form.querySelector('input[id="publication-date"]').value;
        //const bookPrice = form.querySelector('input[id="book-price"]').value;

        //const bookTitle = document.getElementById("book-title").value;
        //const bookAuthor = document.getElementById("book-author").value;
        //const publicationDate = document.getElementById("publicationDate").value;
        //const bookPrice = document.getElementById("price").value;

        const bookTitleElement = document.getElementById("book-title");
        const bookAuthorElement = document.getElementById("book-author");
        const publicationDateElement = document.getElementById("publicationDate");
        const bookPriceElement = document.getElementById("price");

        const bookTitle = bookTitleElement ? bookTitleElement.value : null;
        const bookAuthor = bookAuthorElement ? bookAuthorElement.value : null;
        const publicationDate = publicationDateElement ? publicationDateElement.value : null;
        const bookPrice = bookPriceElement ? bookPriceElement.value : null;


        if (bookTitle && bookAuthor && publicationDate && bookPrice) {
            books.push({
                title: bookTitle,
                authorId: bookAuthor,
                publicationDate: publicationDate,
                price: bookPrice
            });
        }

        const categoryData = {
            name: name,
            book: books

        };
        
        const response = await fetch(`http://localhost:5211/api/categories`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(categoryData),
        });
        const result = await response.json();
        /*  location.reload();*/
        if (response.ok) {
            displayMessage(result.message);
            loadCategories();
            loadCategoriesForTable();
            document.getElementById("category-name").value = "";

        } else {
            displayMessage(result.message, false);
        }
    } else {

        const updatedName = document.getElementById('category-name').value;

        const updatedCategory = {
            id: id,
            name: updatedName,
            status: "Active",
            createdDate: Date.now
        };
        const updateResponse = await fetch(`http://localhost:5211/api/categories/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedCategory)
        });
        const result = await updateResponse.json();
        if (updateResponse.ok) {
            displayMessage(result.message, true);
            loadCategories();
            loadCategoriesForTable();
            document.getElementById("category-name").value = "";
        } else {
            displayMessage(result.message, false);
        }
    }
}



