import useToast from 'services/notificationAdapter'
import { trackingRequestWorker } from 'services/worker'
import { START_TRACKING_WORKER_HANDLER_CODE } from 'utils/constants'

// eslint-disable-next-line react-hooks/rules-of-hooks
const toast = useToast()

export const trackingWorkerHandler = () => {
  if (window.Worker) {
    trackingRequestWorker.postMessage(START_TRACKING_WORKER_HANDLER_CODE)

    trackingRequestWorker.onmessage = function (event) {
      toast.warn(event.data)
    }
  }
}
