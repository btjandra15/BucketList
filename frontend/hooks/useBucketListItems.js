import { useCallback, useState } from "react"

const API_URL = "https://bucketlist-2d6w.onrender.com"

export const useBucketListItems = (userId) => {
    const [bucketlistItems, setBucketlistItems] = useState([])

    const fetchBucketlistItems = useCallback(async() => {
         try {
            const res = await fetch(`${API_URL}/api/bucketlist_items/${userId}`)
            const data = await res.json()
            setBucketlistItems(data);
         } catch (error) {
            console.error("Error fetching bucketlist items: ", error);
         }
    }, [userId]);

    const deleteBucketListItem = async(id) => {
        try {
            const res = await fetch(`${API_URL}/api/bucketlist_items/${id}`, { 
                method: "DELETE"
            });

            if(res.ok) {
                setBucketlistItems((prevItems) => prevItems.filter(item => item.id !== id));
            }
        } catch (error) {
            console.error("Error deleting bucketlist item: ", error);
        }
    }

    const loadData = useCallback(async() => {
        if(!userId) return;

        try {
            await Promise.all([fetchBucketlistItems()]);
        } catch (error) {
            console.error("Error loading data: ", error);
        }
    }, [fetchBucketlistItems, userId]);

    return {bucketlistItems, loadData, deleteBucketListItem}
}
