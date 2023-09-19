import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from 'App'
import { View, StyleSheet } from 'react-native'
import { Text, Button, IconButton, Snackbar } from 'react-native-paper'
import Lottie from 'lottie-react-native'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Camera, CameraType, PermissionStatus, VideoCodec } from 'expo-camera'
import { Audio, ResizeMode, Video } from 'expo-av'
import client from 'lib/client/api/client'
const animationSource = require('animations/321go.json')
import * as Clipboard from 'expo-clipboard'
import * as Linking from 'expo-linking'

export type ProductVideoReview = {
  id: string
  reviewerId: string
  reviewRequestId: string
  productId: string
  videoUrl: string
  thumbnailUrl: string
  isPublished: boolean
  submitedDate: Date
  publishedDate: Date | null
  createdAt: Date
}

type RecordVideoReviewScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'record-video-review'
>

const RecordVideoReviewScreen = ({
  route: {
    params: { reviewRequest }
  },
  navigation
}: RecordVideoReviewScreenProps) => {
  const animation = useRef(null)
  const [hasStartedAnimation, setHasStartedAnimation] = useState(false)
  const [hasFinishedAnimation, setHasFinishedAnimation] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isRecordingFinished, setIsRecordingFinished] = useState(false)
  const [isRecordingUploaded, setIsRecordingUploaded] = useState(false)
  const [isRecordingUploading, setIsRecordingUploading] = useState(false)

  const [hasAudioPermission, setHasAudioPermission] = useState(null)
  const [hasCameraPermission, setHasCameraPermission] = useState(null)
  const cameraRef = useRef<Camera | null>(null)
  const [recordedVideoUri, setRecordedVideoUri] = useState(null)
  const [cameraOrientation, setCameraOrientation] = useState(undefined)
  const video = useRef<Video>(null)
  const [status, setStatus] = useState({})
  const [cameraKey, setCameraKey] = useState(0)
  const [finalUrl, setFinalUrl] = useState<string | null>(null)
  const [videoReview, setVideoReview] = useState<ProductVideoReview | null>(
    null
  )
  const [copySnackVisible, setCopySnackVisible] = useState(false)

  useEffect(() => {
    ;(async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync()
      setHasCameraPermission(cameraStatus.status === PermissionStatus.GRANTED)

      const audioStatus = await Camera.requestMicrophonePermissionsAsync()
      const { status: audioStatus2 } = await Audio.requestPermissionsAsync()

      console.log('audio status', { cameraStatus, audioStatus, audioStatus2 })
      setHasAudioPermission(audioStatus.status === PermissionStatus.GRANTED)
    })()
  }, [])

  const playAnimation = useCallback(() => {
    console.log('playing animation')
    animation.current.play()
    setHasStartedAnimation(true)
    setHasFinishedAnimation(false)
  }, [animation.current])

  const startRecordingVideo = async () => {
    console.log('starting recording')
    if (cameraRef.current) {
      console.log('camera ok')
      setIsRecording(true)
      try {
        setTimeout(() => {
          setCameraKey(cameraKey + 1)
          setCameraOrientation(CameraType.back)
          setCameraOrientation(CameraType.front)
        }, 500)

        const data = await cameraRef.current.recordAsync({
          maxDuration: 10 * 60, // 10 minutes
          codec: VideoCodec.H264
        })

        console.log('recording', data)
        setRecordedVideoUri(data.uri)
      } catch (e) {
        alert('error recording')
        console.log('error recording', e)
      }
    } else {
      alert('camera not initialised, cannot record')
    }
  }

  const stopVideoRecording = async () => {
    setCameraOrientation(CameraType.back)

    cameraRef.current.stopRecording()
    setIsRecording(false)
    setIsRecordingFinished(true)

    console.log('finished recording', recordedVideoUri)
  }

  if (hasCameraPermission === null || hasAudioPermission === null) {
    return <View />
  }
  if (hasCameraPermission === false || hasAudioPermission === false) {
    return <Text>No access to camera</Text>
  }

  const uploadVideo = async () => {
    console.log('uploading video')
    setIsRecordingUploading(true)
    try {
      const {
        status,
        url: signedUrl,
        finalUrl,
        videoReview
      } = await client.get<{
        url: string
        finalUrl: string
        videoReview: ProductVideoReview
      }>(
        `/video-reviews/get-signed-upload-url?reviewRequestId=${reviewRequest.id}`
      )

      if (!status) {
        throw new Error('could not get signed upload url')
      }

      console.log('signed url', signedUrl)

      const imageData = await fetch(recordedVideoUri) // <-- This line crashes with the error
      const blob = await imageData.blob()

      const putResult = await fetch(signedUrl, {
        method: 'PUT',
        body: blob
      })

      // console.log('putResult== ', putResult)
      if (!putResult.ok) {
        throw new Error(
          `server error while uploading data at signed-url: ${signedUrl}: ${putResult.status} - ${putResult.url}`
        )
      }
      console.log('finalUrl', finalUrl, videoReview)
      setFinalUrl(finalUrl)
      setVideoReview(videoReview)
      setIsRecordingUploaded(true)
      setIsRecordingUploading(false)
    } catch (e) {
      console.log('error uploading video', e)
      alert('error uploading video')
      setIsRecordingUploading(false)
    }
  }

  if (videoReview && finalUrl) {
    return (
      <View style={{ flex: 1 }}>
        <Video
          ref={video}
          style={styles.video}
          shouldPlay={true}
          source={{
            uri: finalUrl
          }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          isLooping
          onPlaybackStatusUpdate={status => setStatus(() => status)}
          onReadyForDisplay={() => {
            video.current.playAsync()
          }}
        />
        <View
          style={{ position: 'absolute', width: '100%', bottom: 100, gap: 10 }}
        >
          <Text style={{ padding: 20, color: 'white', textAlign: 'center' }}>
            Video Review Uploaded!
          </Text>
          <Button
            mode="contained"
            onPress={async () => {
              await Clipboard.setStringAsync(
                `${process.env.EXPO_PUBLIC_WEB_HOST}/${reviewRequest.brand.seoName}/${reviewRequest.product.seoName}/video-reviews`
              )
              setCopySnackVisible(true)
            }}
          >
            Copy Video Reviews Link
          </Button>
          <Snackbar
            visible={copySnackVisible}
            onDismiss={() => setCopySnackVisible(false)}
            action={{
              label: 'Open link',
              onPress: () => {
                Linking.openURL(
                  `${process.env.EXPO_PUBLIC_WEB_HOST}/${reviewRequest.brand.seoName}/${reviewRequest.product.seoName}/video-reviews`
                )
                setCopySnackVisible(false)
              }
            }}
          >
            Link copied to clipboard!
          </Snackbar>
        </View>
      </View>
    )
  }
  if (isRecordingFinished) {
    return (
      <View style={{ flex: 1 }}>
        {!recordedVideoUri ? <Text>missing video uri...</Text> : null}
        <Video
          ref={video}
          style={styles.video}
          shouldPlay={true}
          source={{
            uri: recordedVideoUri
          }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          isLooping
          onPlaybackStatusUpdate={status => setStatus(() => status)}
          onReadyForDisplay={() => {
            video.current.playAsync()
          }}
        />
        <View
          style={{
            width: '100%',
            position: 'absolute',
            bottom: 100,
            gap: 10,
            alignItems: 'center'
          }}
        >
          <Button
            mode="contained"
            loading={isRecordingUploading}
            style={{
              backgroundColor: 'green'
            }}
            onPress={() => {
              uploadVideo()
            }}
          >
            Upload Video
          </Button>
        </View>
      </View>
    )
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {!isRecordingFinished ? (
        <View style={styles.cameraContainer}>
          <Camera
            ref={cameraRef}
            ratio={'9:16'}
            type={cameraOrientation || CameraType.front}
            style={{ flex: 1 }}
          />
        </View>
      ) : null}
      {!hasFinishedAnimation ? (
        <Lottie
          source={animationSource}
          ref={animation}
          autoPlay={false}
          loop={false}
          useNativeLooping={true}
          onAnimationFinish={isCanceled => {
            if (!isCanceled) {
              setHasFinishedAnimation(true)
              startRecordingVideo()
            }
          }}
        />
      ) : null}
      {!hasStartedAnimation ? (
        <Button
          style={{ position: 'absolute', zIndex: 20, backgroundColor: 'red' }}
          mode="contained"
          onPress={playAnimation}
        >
          Start Recording
        </Button>
      ) : null}
      {isRecording ? (
        <View style={{ position: 'absolute', bottom: 0, gap: 10 }}>
          <View
            style={{
              alignItems: 'center',
              gap: 8,
              backgroundColor: 'white',
              padding: 10,
              borderRadius: 16
            }}
          >
            <Text>Recording...</Text>
            <Text>
              {recordedVideoUri
                ? 'URI is OK, can finish recording'
                : 'URI is missing, once you filmed your bit, please switch orientation back and forth, before pressing "Finish Recording" - this is a bug in Expo'}
            </Text>
            <IconButton
              mode="contained"
              icon={'camera-switch'}
              onPress={() => {
                setCameraOrientation(
                  cameraOrientation === CameraType.back
                    ? CameraType.front
                    : CameraType.back
                )
              }}
            />
          </View>

          <Button
            mode="contained"
            onPress={() => stopVideoRecording()}
            style={{ marginBottom: 100, backgroundColor: 'red' }}
          >
            Finish Recording
          </Button>
        </View>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'black'
  },
  fixedRatio: {
    flex: 1
  },
  video: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'red'
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default RecordVideoReviewScreen
