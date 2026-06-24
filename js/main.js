"use strict";

/*******************************************************
 *    Asynchronotrigger - 100p
 *
 *    This is your last assignment. Finish this to proof that
 *    you are a grown up now, who doesn't need to be held by
 *    the hand.
 *
 *    Create a users-class. Fetch the users, create Instances.
 *    - https://jsonplaceholder.typicode.com/users
 *
 *    Create a posts-class. Fetch the posts. create Instances.
 *    Assign them to the users (see userId in the posts).
 *    - https://jsonplaceholder.typicode.com/posts
 *
 *    Print the shit. Beautifully:
 *    List the 10 users. On click, expand them with their posts.
 *    Each Post should also have a Button to "load comments".
 *    Yes, you are correct. This is the perfect usecase for
 *    event-delegation! You can get the comments to a post from either
 *    - https://jsonplaceholder.typicode.com/posts/1/comments
 *    or
 *    - https://jsonplaceholder.typicode.com/comments?postId=1
 *    where "1" stands for the posts ID of course.
 *
 *    I believe in...
 *    Emily - 2026-06-09
 *******************************************************/

import { User } from "./class.user.js";
import { Post } from "./class.post.js";

const API_BASE = "https://jsonplaceholder.typicode.com";

const usersById = new Map();

async function fetchJSON(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Request to ${url} failed with status ${response.status}`);
    }
    return response.json();
}

async function loadUsersAndPosts() {
    const [usersData, postsData] = await Promise.all([
        fetchJSON(`${API_BASE}/users`),
        fetchJSON(`${API_BASE}/posts`),
    ]);

    usersData.forEach((userData) => {
        usersById.set(userData.id, new User(userData));
    });

    postsData.forEach((postData) => {
        const post = new Post(postData);
        const user = usersById.get(postData.userId);
        if (user) {
            user.addPost(post);
        }
    });
}

function renderUsers() {
    const root = document.getElementById("app");
    root.innerHTML = "";

    const ul = document.createElement("ul");
    ul.className = "users-list";

    usersById.forEach((user) => {
        ul.appendChild(user.render());
    });

    root.appendChild(ul);
}


function findPostById(postId) {
    for (const user of usersById.values()) {
        const post = user.posts.find((p) => p.id === postId);
        if (post) {
            return post;
        }
    }
    return null;
}

async function handleLoadComments(button) {
    const postId = Number(button.dataset.postId);
    const post = findPostById(postId);
    if (!post) {
        return;
    }

    const postEl = button.closest(".post");
    const commentsList = postEl.querySelector(".comments-list");

    if (post.commentsLoaded) {
        commentsList.classList.toggle("hidden");
        button.textContent = commentsList.classList.contains("hidden")
            ? "Load comments"
            : "Hide comments";
        return;
    }

    button.disabled = true;
    button.textContent = "Loading...";

    try {
        const comments = await fetchJSON(`${API_BASE}/posts/${postId}/comments`);
        post.setComments(comments);
        post.renderComments(commentsList);
        commentsList.classList.remove("hidden");
        button.textContent = "Hide comments";
    } catch (error) {
        console.error(error);
        button.textContent = "Failed - retry";
    } finally {
        button.disabled = false;
    }
}

function handleToggleUser(header) {
    const userEl = header.closest(".user");
    const details = userEl.querySelector(".user-details");
    const icon = header.querySelector(".user-toggle-icon");

    details.classList.toggle("hidden");
    icon.textContent = details.classList.contains("hidden") ? "▸" : "▾";
}

function setupEventDelegation() {
    const root = document.getElementById("app");

    root.addEventListener("click", (event) => {
        const actionTarget = event.target.closest("[data-action]");
        if (!actionTarget) {
            return;
        }

        switch (actionTarget.dataset.action) {
            case "toggle-user":
                handleToggleUser(actionTarget);
                break;
            case "load-comments":
                handleLoadComments(actionTarget);
                break;
        }
    });
}

async function init() {
    const root = document.getElementById("app");
    root.textContent = "Loading users and posts...";

    try {
        await loadUsersAndPosts();
        renderUsers();
        setupEventDelegation();
    } catch (error) {
        console.error(error);
        root.textContent = "Something went wrong while loading data. Check the console.";
    }
}

init();