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
              width: 120,
              height: 120,
              marginBottom: 40,
              borderRadius: 20,
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                background: '#007BFF',
                borderRadius: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 32,
                  background: 'white',
                  borderRadius: 2,
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              />
              <div
                style={{
                  width: 16,
                  height: 2,
                  background: '#007BFF',
                  position: 'absolute',
                  top: '70%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              />
            </div>
          </div>
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