import express from 'express';
import { createBucketListItem, deleteBucketListItem, getBucketListItems } from '../controllers/bucketlistItemController.js';

const router = express.Router();

router.post("/", createBucketListItem);
router.get("/:userId", getBucketListItems);
router.delete("/:id", deleteBucketListItem);

export default router;