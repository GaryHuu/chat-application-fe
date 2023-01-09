export const requestTrackingWorker: Worker = new Worker(
  new URL('./requestTracking', import.meta.url)
)
