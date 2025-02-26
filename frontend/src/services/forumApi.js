const API_URL = "/api";

export const getPostsBySubject = async (subject) => {
    const response = await fetch(`${API_URL}/forum/subjects/${subject}/posts`);
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch posts");
    }
    return data;
};

export const getPostById = async (id, token) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await fetch(`${API_URL}/forum/posts/${id}`, {
        headers
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch post");
    }
    return data;
};

export const createPost = async (postData, token) => {
    const response = await fetch(`${API_URL}/forum/posts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to create post");
    }
    return data;
};

export const createReply = async (postId, content, token) => {
    const response = await fetch(`${API_URL}/forum/posts/${postId}/replies`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to create reply");
    }
    return data;
};

export const likePost = async (postId, token) => {
    const response = await fetch(`${API_URL}/forum/posts/${postId}/like`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to like post");
    }
    return data;
};

export const likeReply = async (replyId, token) => {
    const response = await fetch(`${API_URL}/forum/replies/${replyId}/like`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to like reply");
    }
    return data;
};