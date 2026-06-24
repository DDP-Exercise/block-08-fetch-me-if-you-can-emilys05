"use strict";


export class Post {
    constructor({ id, title, body }) {
        this.id = id;
        this.title = title;
        this.body = body;
        this.comments = [];
        this.commentsLoaded = false;
    }

    setComments(comments) {
        this.comments = comments;
        this.commentsLoaded = true;
    }

    render() {
        const li = document.createElement("li");
        li.className = "post";
        li.dataset.postId = this.id;

        li.innerHTML = `
            <h5 class="post-title">${this.title}</h5>
            <p class="post-body">${this.body}</p>
            <button type="button" class="load-comments-btn" data-action="load-comments" data-post-id="${this.id}">
                Load comments
            </button>
            <ul class="comments-list hidden"></ul>
        `;

        return li;
    }

    renderComments(ul) {
        ul.innerHTML = "";
        this.comments.forEach((comment) => {
            const li = document.createElement("li");
            li.className = "comment";
            li.innerHTML = `
                <p class="comment-header"><strong>${comment.name}</strong> (${comment.email})</p>
                <p class="comment-body">${comment.body}</p>
            `;
            ul.appendChild(li);
        });
    }
}