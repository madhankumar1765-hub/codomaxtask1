// Get saved data from Local Storage
function getUsers() {
return JSON.parse(localStorage.getItem("blogUsers") || "[]");
}

function getBlogs() {
return JSON.parse(localStorage.getItem("blogPosts") || "[]");
}

// Register
const registerForm = document.getElementById("registerForm");

if (registerForm) {
registerForm.addEventListener("submit", function (event) {
event.preventDefault();


    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim().toLowerCase();
    const password = document.getElementById("registerPassword").value;
    const message = document.getElementById("registerMessage");

    const users = getUsers();

    if (users.some(user => user.email === email)) {
        message.textContent = "This email is already registered.";
        return;
    }

    users.push({ name, email, password });

    localStorage.setItem("blogUsers", JSON.stringify(users));

    message.textContent = "Registration successful! Please log in.";

    registerForm.reset();

    setTimeout(() => {
        window.location.href = "login.html";
    }, 1000);
});


}

// Login
const loginForm = document.getElementById("loginForm");

if (loginForm) {
loginForm.addEventListener("submit", function (event) {
event.preventDefault();


    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;
    const message = document.getElementById("loginMessage");

    const users = getUsers();

    const user = users.find(
        user => user.email === email && user.password === password
    );

    if (user) {
        localStorage.setItem("loggedInUser", user.email);
        window.location.href = "dashboard.html";
    } else {
        message.textContent = "Invalid email or password.";
    }
});


}

// Check current user
function getCurrentUser() {
const email = localStorage.getItem("loggedInUser");


if (!email) {
    return null;
}

return getUsers().find(user => user.email === email) || null;


}

// Create Blog
const blogForm = document.getElementById("blogForm");

if (blogForm) {
blogForm.addEventListener("submit", function (event) {
event.preventDefault();


    const user = getCurrentUser();

    if (!user) {
        alert("Please log in before creating a blog.");
        window.location.href = "login.html";
        return;
    }

    const title = document.getElementById("blogTitle").value.trim();
    const content = document.getElementById("blogContent").value.trim();

    if (!title || !content) {
        document.getElementById("blogMessage").textContent =
            "Please enter the title and content.";
        return;
    }

    const blogs = getBlogs();

    blogs.unshift({
        id: Date.now(),
        title: title,
        content: content,
        author: user.name,
        email: user.email,
        date: new Date().toLocaleDateString()
    });

    localStorage.setItem("blogPosts", JSON.stringify(blogs));

    blogForm.reset();

    document.getElementById("blogMessage").textContent =
        "Blog published successfully!";

    setTimeout(() => {
        window.location.href = "dashboard.html";
    }, 800);
});


}

// Display blog cards safely
function createBlogCard(blog, showDelete = false) {
const card = document.createElement("article");
card.className = "blog-card";


const title = document.createElement("h3");
title.textContent = blog.title;

const content = document.createElement("p");
content.textContent = blog.content;

const author = document.createElement("small");
author.textContent = `By ${blog.author} | ${blog.date}`;

card.append(title, content, author);

if (showDelete) {
    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", function () {
        deleteBlog(blog.id);
    });

    card.appendChild(document.createElement("br"));
    card.appendChild(deleteButton);
}

return card;


}

// Display all blogs on Home Page
const blogList = document.getElementById("blogList");

if (blogList) {
const blogs = getBlogs();


if (blogs.length === 0) {
    blogList.textContent = "No blogs published yet. Be the first to create one!";
} else {
    blogs.forEach(blog => {
        blogList.appendChild(createBlogCard(blog));
    });
}


}

// Display current user's blogs on Dashboard
const dashboardBlogs = document.getElementById("dashboardBlogs");

if (dashboardBlogs) {
const user = getCurrentUser();


if (!user) {
    alert("Please log in to view your dashboard.");
    window.location.href = "login.html";
} else {
    const blogs = getBlogs().filter(blog => blog.email === user.email);

    if (blogs.length === 0) {
        dashboardBlogs.textContent = "You have not created any blogs yet.";
    } else {
        blogs.forEach(blog => {
            dashboardBlogs.appendChild(createBlogCard(blog, true));
        });
    }
}


}

// Delete Blog
function deleteBlog(id) {
const user = getCurrentUser();


if (!user) {
    window.location.href = "login.html";
    return;
}

const blogs = getBlogs();

const updatedBlogs = blogs.filter(
    blog => !(blog.id === id && blog.email === user.email)
);

localStorage.setItem("blogPosts", JSON.stringify(updatedBlogs));

window.location.reload();


}

// Logout
const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {
logoutButton.addEventListener("click", function (event) {
event.preventDefault();


    localStorage.removeItem("loggedInUser");

    window.location.href = "index.html";
});


}
