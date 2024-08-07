// implement your posts router here
const express = require('express')
const Posts = require('./posts-model')

const router = express.Router()


// Returns an array of all the post objects contained in the database
router.get('/', async (req, res) => {
    try {
        const posts = await Posts.find()
        res.status(200).json(posts)
    } catch (err) {
        res.status(500).json({ message: "The posts information could not be retrieved" })
    }
})

// Returns the post object with the specified id
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const post = await Posts.findById(id)
        if (!post) {
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        } else {
            res.status(200).json(post)
        }
    } catch (err) {
        res.status(500).json({ message: "The post information could not be retrieved" })
    }
})

// Creates a post using the information sent inside the request body and returns the newly created post object
router.post('/', async (req, res) => {
    try {
        const { title, contents } = req.body
        if (!title || !contents) {
            res.status(400).json({ message: "Please provide title and contents for the post" })
        } else {
            const { id } = await Posts.insert({ title, contents })
            const post = await Posts.findById(id)
            res.status(201).json(post)
        }
    } catch (err) {
        res.status(500).json({ message: "There was an error while saving the post to the database" })
    }
})

// Updates the post with the specified id using data from the request body and returns the modified document, not the original
router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const { title, contents } = req.body
        if (!title || !contents) {
            res.status(400).json({ message: "Please provide title and contents for the post" })
        } else {
            const postUpdated = await Posts.update(id, { title, contents })
            if (!postUpdated) {
                res.status(404).json({ message: "The post with the specified ID does not exist" })
            } else {
                const post = await Posts.findById(id)
                res.status(200).json(post)
            }
        }
    } catch (err) {
        res.status(500).json({ message: "The post information could not be modified" })
    }
})

// Removes the post with the specified id and returns the deleted post object
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const post = await Posts.findById(id)
        const postDeleted = await Posts.remove(id)
        if (!postDeleted) {
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        } else {
            res.status(200).json(post)
        }
    } catch (err) {
        res.status(500).json({ message: "The post could not be removed" })
    }
})

// Returns an array of all the comment objects associated with the post with the specified id
router.get('/:id/comments', async (req, res) => {
    try {
        const id = req.params.id
        const post = await Posts.findById(id)
        if (!post) {
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        } else {
            const comments = await Posts.findPostComments(id)
            res.status(200).json(comments)
        }
    } catch (err) {
        res.status(500).json({ message: "The comments information could not be retrieved" })
    }
})

module.exports = router