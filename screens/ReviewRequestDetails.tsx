import { Image, StyleSheet, View } from 'react-native'
import { Button, Text } from 'react-native-paper'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from 'App'

type ReviewRequestDetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'review-request-details'
>

const ReviewRequestDetailsScreen = ({
  route: {
    params: { reviewRequest }
  },
  navigation
}: ReviewRequestDetailsScreenProps) => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: reviewRequest.product.imageUrl }}
        style={styles.productImage}
      />
      <Text style={styles.productDescription}>
        {reviewRequest.product.description}
      </Text>
      <View style={styles.spacer}></View>
      <Button
        mode="contained"
        style={styles.recordVideoButton}
        onPress={() => {
          navigation.navigate('record-video-review', {
            reviewRequest
          })
        }}
      >
        Record Video Review
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    padding: 8,
    paddingBottom: 32,
    gap: 16
  },
  productDescription: {
    fontSize: 14,
    textAlign: 'center'
  },
  productImage: {
    width: 200,
    height: 200,
    borderRadius: 8
  },
  recordVideoButton: {
    backgroundColor: 'rgb(255, 59, 48)'
  },
  spacer: {
    flex: 1
  }
})

export default ReviewRequestDetailsScreen
