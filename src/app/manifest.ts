import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    "name": "Meta Prompt Generator",
    "short_name": "PromptGen",
    "description": "Intelligent AI Prompt Template Generation Tool",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#ffffff",
    "theme_color": "#667eea",
    "orientation": "any",
    "scope": "/",
    "lang": "en",
    "icons": [
      {
        "src": "/icon-32.png",
        "sizes": "32x32",
        "type": "image/png",
        "purpose": "any"
      },
      {
        "src": "/icon-192.png",
        "sizes": "192x192",
        "type": "image/png",
        "purpose": "maskable"
      },
      {
        "src": "/icon-512.png",
        "sizes": "512x512",
        "type": "image/png",
        "purpose": "maskable"
      },
      {
        "src": "/apple-icon.png",
        "sizes": "1024x1024",
        "type": "image/png",
        "purpose": "any"
      }
    ],
    "screenshots": [
      {
        "src": "/screenshot-mobile.png",
        "sizes": "390x844",
        "type": "image/png",
        "form_factor": "narrow",
        "label": "Mobile view of the prompt generator"
      },
      {
        "src": "/screenshot-desktop.png",
        "sizes": "1920x1080",
        "type": "image/png",
        "form_factor": "wide",
        "label": "Desktop view of the prompt generator"
      }
    ],
    "categories": ["productivity", "utilities", "developer"],
    "shortcuts": [
      {
        "name": "Generate Prompt",
        "short_name": "Generate",
        "description": "Generate a new AI prompt",
        "url": "/",
        "icons": [{ "src": "/icon-192.png", "sizes": "192x192" }]
      },
      {
        "name": "Test Prompt",
        "short_name": "Test",
        "description": "Test existing prompts",
        "url": "/test",
        "icons": [{ "src": "/icon-192.png", "sizes": "192x192" }]
      }
    ]
  }
}