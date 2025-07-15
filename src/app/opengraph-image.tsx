import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
 
export const alt = 'Meta Prompt Generator'
export const size = {
  width: 1200,
  height: 630,
}
 
export const contentType = 'image/png'
 
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          color: 'white',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 'bold',
              marginBottom: 20,
            }}
          >
            Meta Prompt Generator
          </div>
          <div
            style={{
              fontSize: 32,
              opacity: 0.8,
            }}
          >
            Intelligent AI Prompt Template Generation Tool
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}