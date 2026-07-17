import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import EditPhotoForm from "@/components/EditPhotoForm";

export const dynamic = "force-dynamic";

export default async function EditOwnPhotoPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/photo/${params.id}/edit`);
  }

  const photo = await prisma.photo.findUnique({ where: { id: params.id } });
  if (!photo) notFound();
  if (photo.photographerId !== session.user.id) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-display text-4xl text-bone">Edit Photo</h1>
      <p className="mt-2 text-bone-muted">Update the details for &ldquo;{photo.title}&rdquo;.</p>

      <EditPhotoForm
        endpoint={`/api/photos/${photo.id}`}
        redirectTo={`/photo/${photo.id}`}
        notice="Saving changes will send this photo back to an admin for review before it's visible in the gallery again."
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
