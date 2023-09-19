import { ReviewRequest } from 'hooks/useActiveReviewRequests'
import {
  Image,
  StyleSheet,
  TouchableNativeFeedback,
  TouchableOpacity,
  View
} from 'react-native'
import { Text, TouchableRipple } from 'react-native-paper'
import { Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { StackNavigation } from 'App'

export type ReviewRequestsListItemProps = {
  reviewRequest: ReviewRequest
}
const ReviewRequestsListItem = ({
  reviewRequest
}: ReviewRequestsListItemProps) => {
  const navigation = useNavigation<StackNavigation>()
  return (
    <TouchableRipple
      onPress={() => {
        navigation.navigate('review-request-details', {
          reviewRequest
        })
      }}
    >
      <View style={styles.container}>
        <Image
          source={{ uri: reviewRequest.product.imageUrl }}
          style={styles.productImage}
        />
        <Text style={styles.productName}>{reviewRequest.product.name}</Text>
        <Feather name="chevron-right" size={24} color={'rgb(124, 117, 126)'} />
      </View>
    </TouchableRipple>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8
  },
  productImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 8
  },
  productName: {
    flex: 1,
    fontSize: 16
  }
})

export default ReviewRequestsListItem
