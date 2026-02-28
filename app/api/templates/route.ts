import { NextResponse } from 'next/server'
import path from 'path'
import { promises as fs } from 'fs'

export async function GET() {
  try {
    const templatesDir = path.join(process.cwd(), 'public', 'templates')

    // Check if templates directory exists
    try {
      await fs.access(templatesDir)
    } catch {
      return NextResponse.json({ templates: [] }, { status: 200 })
    }

    const entries = await fs.readdir(templatesDir, { withFileTypes: true })
    // Resolve all template definitions asynchronously
    const templatePromises = entries
      .filter(entry => entry.isDirectory())
      .map(async dir => {
        const templatePath = path.join(templatesDir, dir.name)
        const configPath = path.join(templatePath, 'config.json')

        // Base fallback properties
        let templateData: any = {
          id: dir.name,
          name: dir.name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
          description: `A beautiful ${dir.name.replace('-', ' ')} template.`,
          theme: 'pink',
          thumbnail_url: null,
          customization_fields: []
        }

        try {
          // Attempt to load and merge config.json if it exists
          const configContent = await fs.readFile(configPath, 'utf8')
          const parsedConfig = JSON.parse(configContent)

          templateData = {
            ...templateData,
            ...parsedConfig,
            id: dir.name, // Force ID to match folder name
          }
        } catch (error) {
          // It's perfectly fine if a template lacks a config.json (use defaults)
          console.debug(`No config.json found for template ${dir.name}`)
        }

        return templateData
      })

    const templates = await Promise.all(templatePromises)

    return NextResponse.json(
      { templates },
      { status: 200 }
    )
  } catch (error) {
    console.error('Get templates error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    )
  }
}
