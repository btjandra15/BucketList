import { SignOutButton } from "../../components/SignOutButton.jsx";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { Text, View } from "react-native";
import { useBucketListItems } from "../../hooks/useBucketListItems.js";
import { useEffect } from "react";

export default function Index() {
  const { user } = useUser();
  const {bucketListItems, loadData, deleteBucketListItem} = useBucketListItems(user?.id);

  useEffect(() => {
    loadData();
  }, [loadData]);

  console.log("UserID: ", user.id)
  console.log("Bucket List Item:", bucketListItems);

  return (
    <View>
      <SignedIn>
        <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
        <SignOutButton/>
      </SignedIn>

      <SignedOut>
        <Link href="/(auth)/sign-in">
          <Text>Sign in</Text>
        </Link>
        <Link href="/(auth)/sign-up">
          <Text>Sign up</Text>
        </Link>
      </SignedOut>
    </View>
  )
}
