import type { Metadata } from "next"

import { Editor } from "@/components/editor/editor"
import { getDrawing, getScene } from "@/lib/dal"

type Props = { params: Promise<{ drawingId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { drawingId } = await params
  return { title: (await getDrawing(drawingId)).title }
}

export default async function Page({ params }: Props) {
  const { drawingId } = await params
  const [drawing, scene] = await Promise.all([
    getDrawing(drawingId),
    getScene(drawingId),
  ])

  return (
    <div className="h-svh">
      <Editor drawing={drawing} scene={scene} />
    </div>
  )
}
