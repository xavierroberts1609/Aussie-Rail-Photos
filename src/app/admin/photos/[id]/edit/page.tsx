import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EditPhotoForm from "@/components/EditPhotoForm";

export const dynamic = "force-dynamic";

export default async function EditPhotoPage({ params }: { params: { id: string } }) {
  const photo = await prisma.photo.findUnique({ where: { id: params.id } });
  if (!photo) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <p className="text-sm font-semibold uppercase tracking-widest text-gold">Admin</p>
      <h1 className="mt-2 font-display text-4xl text-bone">Edit Photo</h1>
      <p className="mt-2 text-bone-muted">Update the details for &ldquo;{photo.title}&rdquo;.</p>

      <EditPhotoForm
        photo={{
          id: photo.id,
          title: photo.title,
          category: photo.category,
          operator: photo.operator,
          trainLine: photo.trainLine,
          trainType: photo.trainType,
          consist: photo.consist,
          state: photo.state,
          suburb: photo.suburb,
          station: photo.station,
          locationDetail: photo.locationDetail,
          camera: photo.camera,
          description: photo.description,
          dateTaken: photo.dateTaken ? photo.dateTaken.toISOString() : null,
        }}
      />
    </div>
  );
}
