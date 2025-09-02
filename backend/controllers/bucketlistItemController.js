import {sql} from "../config/db.js";

const createBucketListItem = async(req, res) => {
    try {
        const {user_id, collaborator_user_id, name, collaborator_name, title, description} = req.body;

        if(!user_id || !collaborator_user_id || !name || !collaborator_name || !title || !description) 
            return res.status(400).json({message: "All fields required"})

        const bucketlist_item = await sql`
            INSERT INTO bucketlist_items(user_id, collaborator_user_id, name, collaborator_name, title, description)
            VALUES (${user_id}, ${collaborator_user_id}, ${name}, ${collaborator_name}, ${title}, ${description})
            RETURNING *
        `
        console.log("Bucketlist Item: ", bucketlist_item);
        res.status(200).json(bucketlist_item[0]);
    } catch (error) {
        console.log("Error creating Bucketlist Item: ", error);
        res.status(500).json({message: "Interval Server Error"});
    }
}

const getBucketListItems = async(req, res) => {
    try {
        const {userId} = req.params;
        const bucketlist_items = await sql`SELECT * FROM bucketlist_items WHERE user_id = ${userId} ORDER BY created_at DESC`;

        res.status(200).json(bucketlist_items);
    } catch (error) {
        console.log("Error getting transactions: ", error)
    }
}

const deleteBucketListItem = async(req, res) => {
    try {
        const {id} = req.params;
        const result = await sql`DELETE FROM bucketlist_items WHERE id = ${id} RETURNING *`

        if(result.length === 0) return res.status(404).json({message: "Bucketlist Item not found"});

        res.status(200).json({messsage: "Bucketlist Item successfully deleted "})
    } catch (error) {
        console.log("Error deleting Bucketlist item: ", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export {createBucketListItem, getBucketListItems, deleteBucketListItem};