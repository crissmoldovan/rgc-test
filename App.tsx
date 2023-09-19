import * as React from 'react'
import ReviewRequestsScreen from './screens/ReviewRequests'
import RecordVideoReviewScreen from './screens/RecordVideoReview'
import { NavigationContainer, NavigationProp } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { PaperProvider, DefaultTheme, Button } from 'react-native-paper'
import { ReviewRequest } from 'hooks/useActiveReviewRequests'
import ReviewRequestDetailsScreen from 'screens/ReviewRequestDetails'

export type ScreenNames = [
  'review-requests',
  'record-video-review',
  'review-request-details'
]
export type RootStackParamList = {
  'review-requests': undefined
  'record-video-review': { reviewRequest: ReviewRequest }
  'review-request-details': { reviewRequest: ReviewRequest }
}

export type StackNavigation = NavigationProp<RootStackParamList>

const Stack = createNativeStackNavigator<RootStackParamList>()

export type RootNavigationType = typeof Stack

export default class App extends React.Component {
  render() {
    return (
      <PaperProvider theme={DefaultTheme}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Group>
              <Stack.Screen
                name="review-requests"
                options={{
                  title: 'Products available for review'
                }}
                component={ReviewRequestsScreen}
              />
              <Stack.Screen
                name="review-request-details"
                options={({ route }) => ({
                  title: route.params.reviewRequest.product.name,
                  headerBackTitle: 'Back'
                })}
                component={ReviewRequestDetailsScreen}
              />
            </Stack.Group>
            <Stack.Group>
              <Stack.Screen
                name="record-video-review"
                options={({ navigation, route }) => ({
                  presentation: 'containedModal',
                  headerTitle: `${route.params.reviewRequest.product.name} Video Review`,
                  headerTintColor: 'white',
                  headerTransparent: true,
                  headerLeft: () => (
                    <Button
                      mode="text"
                      textColor="white"
                      onPress={() => {
                        navigation.goBack()
                      }}
                    >
                      Cancel
                    </Button>
                  )
                })}
                component={RecordVideoReviewScreen}
              />
            </Stack.Group>
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    )
  }
}
