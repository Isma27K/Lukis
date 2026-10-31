import type { Metadata } from "next"

import { Editor } from "@/components/editor/editor"
import { realtimeUrl } from "@/lib/backend"
import { getDrawing, getFeatures, getScene } from "@/lib/dal"

type Props = { params: Promise<{ drawingId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { drawingId } = await params
  return { title: (await getDrawing(drawingId)).title }
}

export default async function Page({ params }: Props) {
  const { drawingId } = await params
  const [drawing, scene, features] = await Promise.all([
    getDrawing(drawingId),
    getScene(drawingId),
    getFeatures(),
  ])

  return (
    <div className="h-svh">
      <Editor
        source={{
          kind: "member",
          drawing,
          publicLinks: features.public_links,
        }}
        scene={scene}
        realtimeUrl={realtimeUrl}
      />
    </div>
  )
}
