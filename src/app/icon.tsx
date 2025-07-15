export const runtime = 'edge'

export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

export default function Icon() {
  return new Response(
    null,
    {
      status: 301,
      headers: {
        Location: '/icon.png',
      },
    }
  )
}