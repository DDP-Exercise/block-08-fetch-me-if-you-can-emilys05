"use strict";



export class User {
    constructor({ id, name, username, email, website }) {
        this.id = id;
        this.name = name;
        this.username = username;
        this.email = email;
        this.website = website;
        this.posts = [];
    }

    addPost(post) {
        this.posts.push(post);
    }

    render() {
        const li = document.createElement("li");
        li.className = "user";
        li.dataset.userId = this.id;

        li.innerHTML = `
            <div class="user-header" data-action="toggle-user">
                <span class="user-name">${this.name}</span>
                <span class="user-username">@${this.username}</span>
                <span class="user-toggle-icon">▸</span>
            </div>
            <div class="user-details hidden">
                <p>
                    <strong>Email:</strong>
                    <a href="mailto:${this.email}">${this.email}</a>
                </p>
                <p>
                    <strong>Website:</strong>
                    <a href="https://${this.website}" target="_blank" rel="noopener noreferrer">${this.website}</a>
                </p>
                <h4>Posts</h4>
                <ul class="posts-list"></ul>
            </div>
        `;

        const postsList = li.querySelector(".posts-list");
        this.posts.forEach((post) => {
            postsList.appendChild(post.render());
        });

        return li;
    }
}