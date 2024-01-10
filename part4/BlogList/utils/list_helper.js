var _ = require('lodash');

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => {
        return sum + blog.likes
    }, 0)
}

const favoriteBlog = (blogs) => {
    const reducer = (maxLikeBlog, blog) => {
        return blog.likes > maxLikeBlog.likes ? blog : maxLikeBlog 
    }

    const formatter = (blog) => {
        return {
            title: blog.title,
            author: blog.author,
            likes: blog.likes
        }
    }

    return blogs.length === 0 ? {} : formatter(blogs.reduce(reducer, {likes: -Infinity}))
}

const mostBlogs = (blogs) => {
    const groupedByAuthor = _.groupBy(blogs, 'author')

    const countBlogs = _.map(groupedByAuthor, (blogs, author) => ({
        author,
        'blogs': blogs.length 
    }))

    const authorWithMostBlogs = _.maxBy(countBlogs, 'blogs')

    return authorWithMostBlogs
}

const mostLikes = (blogs) => {
    const groupedByAuthor = _.groupBy(blogs, 'author')

    const countLikes = _.map(groupedByAuthor, (blogs, author) => ({
        author,
        likes: totalLikes(blogs)
    }))

    const authorWithMostLikes = _.maxBy(countLikes, 'likes')

    return authorWithMostLikes
}
  
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog, 
    mostBlogs,
    mostLikes
}