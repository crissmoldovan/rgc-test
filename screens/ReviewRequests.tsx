import ReviewRequestsListItem from 'components/ReviewRequests/ListItem'
import ErrorBox from 'components/abstract/ErrorBox'
import useActiveReviewRequests, {
  ReviewRequest
} from 'hooks/useActiveReviewRequests'
import { FlatList, StyleSheet, View } from 'react-native'
import { ActivityIndicator, Button, Divider, Text } from 'react-native-paper'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from 'App'

type ReviewRequestsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'review-requests'
>

const ReviewRequestsScreen = ({ navigation }: ReviewRequestsScreenProps) => {
  const { activeRequests, isLoading, error, refresh } =
    useActiveReviewRequests()

  if (error)
    return (
      <ErrorBox
        error={error}
        retry={() => {
          refresh()
        }}
      />
    )

  if (isLoading) return <ActivityIndicator animating={true} />

  return (
    <View style={styles.container}>
      <FlatList<ReviewRequest>
        data={activeRequests}
        renderItem={({ item }) => (
          <ReviewRequestsListItem reviewRequest={item} />
        )}
        ItemSeparatorComponent={() => <Divider />}
        style={styles.list}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  list: {
    flex: 1
  }
})

export default ReviewRequestsScreen
