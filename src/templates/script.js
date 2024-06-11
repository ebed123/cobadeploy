document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('commentForm');
    const messageDiv = document.getElementById('message');
    const commentsDiv = document.getElementById('comments');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const comment = document.getElementById('comment').value;

        try {
            const response = await fetch('/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, comment })
            });

            if (response.ok) {
                messageDiv.textContent = 'Comment added successfully!';
                messageDiv.style.color = 'green';
                form.reset();
                loadComments();
            } else {
                const errorData = await response.json();
                messageDiv.textContent = errorData.error || 'Failed to add comment';
                messageDiv.style.color = 'red';
            }
        } catch (error) {
            messageDiv.textContent = 'Failed to add comment';
            messageDiv.style.color = 'red';
        }
    });

    async function loadComments() {
        try {
            const response = await fetch('/comments');
            const comments = await response.json();

            commentsDiv.innerHTML = '';
            comments.forEach(comment => {
                const commentDiv = document.createElement('div');
                commentDiv.classList.add('comment');
                commentDiv.innerHTML = `<p><strong>${comment.name}</strong></p><p>${comment.comment}</p>`;
                commentsDiv.appendChild(commentDiv);
            });
        } catch (error) {
            commentsDiv.innerHTML = '<p>Failed to load comments</p>';
        }
    }

    loadComments();
});
