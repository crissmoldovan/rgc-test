import { Button, Text } from 'react-native-paper'

const ErrorBox = ({ error, retry }: { error: Error; retry?: () => void }) => {
  return (
    <>
      <Text>Error! {error.message}</Text>
      {retry && typeof retry === 'function' && (
        <Button
          onPress={() => {
            retry()
          }}
        >
          retry
        </Button>
      )}
    </>
  )
}

export default ErrorBox
