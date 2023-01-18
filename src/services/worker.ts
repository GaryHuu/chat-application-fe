export const trackingRequestWorker: Worker = new Worker(
  new URL('./trackingRequestWorker.ts', import.meta.url)
)
